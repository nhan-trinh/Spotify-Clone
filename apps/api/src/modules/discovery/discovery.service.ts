import { prisma } from '../../shared/config/database';
import { ListeningHistory } from '../player/player.model';

export const DiscoveryService = {
  // Lõi thuật toán gợi ý nhạc
  generateDiscoverWeekly: async (userId: string) => {
    // 1. Phân tích lịch sử người dùng trong 30 ngày gần đây
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await ListeningHistory.find({ 
      userId,
      playedAt: { $gte: thirtyDaysAgo } 
    }).lean();

    if (history.length === 0) {
      // Nếu user hoàn toàn mới -> Gợi ý theo Top Songs mặc định lấy từ DB
      return await prisma.song.findMany({
        where: { status: 'APPROVED' },
        orderBy: { playCount: 'desc' },
        take: 20,
        include: { artist: { select: { id: true, stageName: true } } }
      });
    }

    // 2. Gom nhóm Artist và Genre ưu thích
    const listenedSongIds = Array.from(new Set(history.map(h => h.songId)));
    const listenedSongs = await prisma.song.findMany({
      where: { id: { in: listenedSongIds } },
      select: { artistId: true, genreId: true }
    });

    const artistScores: Record<string, number> = {};
    const genreScores: Record<string, number> = {};

    listenedSongs.forEach(song => {
      if (song.artistId) {
        artistScores[song.artistId] = (artistScores[song.artistId] || 0) + 1;
      }
      if (song.genreId) {
        genreScores[song.genreId] = (genreScores[song.genreId] || 0) + 1;
      }
    });

    // Extract Top 3 Artists & Top 3 Genres
    const topArtists = Object.entries(artistScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(i => i[0]);
    const topGenres = Object.entries(genreScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(i => i[0]);

    // 3. Khai phá bài hát (Tìm các bài chưa từng nghe thuộc nhóm top rỗng trên)
    const recommendations = await prisma.song.findMany({
      where: {
        status: 'APPROVED',
        id: { notIn: listenedSongIds },
        OR: [
          { artistId: { in: topArtists } },
          { genreId: { in: topGenres } }
        ]
      },
      orderBy: { playCount: 'desc' },
      take: 20,
      include: { artist: { select: { id: true, stageName: true } } }
    });

    // 4. Nếu thuật toán thiếu bài (do data nghèo), random top bài hát hot bù vào cho đủ 20
    if (recommendations.length < 20) {
      const remaining = 20 - recommendations.length;
      const fillUps = await prisma.song.findMany({
        where: { 
          status: 'APPROVED',
          id: { notIn: [...listenedSongIds, ...recommendations.map(r => r.id)] }
        },
        orderBy: { playCount: 'desc' },
        take: remaining,
        include: { artist: { select: { id: true, stageName: true } } }
      });
      recommendations.push(...fillUps);
    }

    return recommendations;
  },

  // Interface chính để Controller có thể gọi
  getOrCreateDiscoverWeeklyPlaylist: async (userId: string) => {
    let playlist = await prisma.playlist.findFirst({
      where: { 
        ownerId: userId,
        title: 'Discover Weekly' // Cờ nhận dạng Playlist Khuyên Nghe Dành Cho Bạn
      },
      include: {
        songs: {
          orderBy: { position: 'asc' },
          include: { song: { include: { artist: true } } }
        }
      }
    });

    if (!playlist) {
      // User mới tham gia -> chưa có Playlist Discover Weekly -> Tạo mới
      playlist = await prisma.playlist.create({
        data: {
          title: 'Discover Weekly',
          description: 'Hỗn hợp kỳ diệu các bài hát đề xuất riêng cho bạn, được cập nhật mỗi tuần dựa trên gu âm nhạc của bạn.',
          coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop', // Hình Default Discover Weekly
          ownerId: userId,
          isPublic: false,
        },
        include: {
          songs: { include: { song: { include: { artist: true } } } }
        }
      });
    }

    // Checking last update => Cập nhật nếu lớn hơn 7 ngày, hoặc nếu rỗng bài
    const daysSinceUpdate = (new Date().getTime() - playlist.updatedAt.getTime()) / (1000 * 3600 * 24);
    if (daysSinceUpdate < 7 && playlist.songs.length > 0) {
      // Chưa đủ 1 tuần thì cứ trả về cục cũ tiết kiệm băng thông Server
      return playlist;
    }

    // => Bắt đầu Cập nhật thuật toán cho tuần mới
    const recommendedSongs = await DiscoveryService.generateDiscoverWeekly(userId);

    // Xoá mảng nhạc cũ
    await prisma.playlistSong.deleteMany({
      where: { playlistId: playlist.id }
    });

    // Inject mảng nhạc mới
    if (recommendedSongs.length > 0) {
      const inserts = recommendedSongs.map((song, index) => ({
        playlistId: playlist!.id,
        songId: song.id,
        addedBy: userId,
        position: index
      }));

      await prisma.playlistSong.createMany({
        data: inserts
      });
    }

    // Refresh updatedAt
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: { updatedAt: new Date() }
    });

    // Get lại playlist tươi để return
    return await prisma.playlist.findFirst({
      where: { id: playlist.id },
      include: {
        songs: {
          orderBy: { position: 'asc' },
          include: { song: { include: { artist: true } } }
        }
      }
    });
  },

  // Thuật toán lấy nhạc tương tự (Auto-play / Radio)
  getRadioSongs: async (songId: string, limit: number = 10) => {
    // 1. Lấy thông tin bài hát gốc
    const baseSong = await prisma.song.findUnique({
      where: { id: songId },
      select: { genreId: true, artistId: true }
    });

    if (!baseSong) return [];

    // 2. Tìm kiếm bài hát cùng Genre hoặc Artist (Ưu tiên Genre theo yêu cầu Sếp)
    const recommendations = await prisma.song.findMany({
      where: {
        status: 'APPROVED',
        id: { not: songId }, // Không lấy lại chính nó
        genreId: baseSong.genreId, // Ưu tiên cùng thể loại
      },
      orderBy: { playCount: 'desc' },
      take: limit,
      include: { 
        artist: { select: { id: true, stageName: true, avatarUrl: true } } 
      }
    });

    // 3. Nếu cùng Genre không đủ, lấy thêm cùng Artist
    if (recommendations.length < limit) {
      const remainingCount = limit - recommendations.length;
      const artistSongs = await prisma.song.findMany({
        where: {
          status: 'APPROVED',
          id: { notIn: [songId, ...recommendations.map(r => r.id)] },
          artistId: baseSong.artistId
        },
        orderBy: { playCount: 'desc' },
        take: remainingCount,
        include: { 
          artist: { select: { id: true, stageName: true, avatarUrl: true } } 
        }
      });
      recommendations.push(...artistSongs);
    }

    return recommendations;
  }
};
