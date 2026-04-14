import { prisma } from '../../shared/config/database';
import { redis } from '../../shared/config/redis';
import { AppError, ErrorCodes } from '../../shared/utils/app-error';
import { ListeningHistory, RecentlyPlayed } from './player.model';

export const PlayerService = {
  // 1. Queue Management bằng Redis
  getQueue: async (userId: string) => {
    const queueData = await redis.get(`queue:${userId}`);
    if (!queueData) return [];
    
    // Tối ưu: Lấy thông tin bài hát từ PostgreSQL dựa trên list IDs của Queue
    const songIds: string[] = JSON.parse(queueData);
    if (songIds.length === 0) return [];

    const songs = await prisma.song.findMany({
      where: { id: { in: songIds } },
      select: { id: true, title: true, coverUrl: true, duration: true, artist: { select: { stageName: true } } }
    });

    // Sắp xếp lại map theo đúng order của array
    const idToSong = new Map(songs.map(s => [s.id, s]));
    return songIds.map(id => idToSong.get(id)).filter(Boolean);
  },

  updateQueue: async (userId: string, songIds: string[]) => {
    await redis.set(`queue:${userId}`, JSON.stringify(songIds), 'EX', 86400); // 24 hours TTL
    return { message: 'Cập nhật Queue thành công' };
  },

  // 2. Ghi nhận lượt nghe và lịch sử (MongoDB)
  recordPlay: async (userId: string, songId: string, durationPlayed: number, completed: boolean = false) => {
    try {
      // a. Tăng playCount trên Postgre
      await prisma.song.update({
        where: { id: songId },
        data: { playCount: { increment: 1 } }
      });

      // b. Insert ListeningHistory vào Mongo
      await ListeningHistory.create({
        userId,
        songId,
        durationPlayed,
        completed,
        deviceType: 'web',
      });

      // c. Cập nhật RecentlyPlayed (giữ tối đa 50 phần tử FIFO không trùng lặp)
      // Bước 1: Kéo bài hát ra khỏi mảng nếu đã tồn tại trước đó để tránh duplicate
      await RecentlyPlayed.updateOne(
        { userId },
        { $pull: { items: { songId } } }
      );

      // Bước 2: Push lại vào cuối mảng (sẽ thành mới nhất)
      await RecentlyPlayed.findOneAndUpdate(
        { userId },
        { 
          $push: { 
            items: { 
              $each: [{ songId, playedAt: new Date() }], 
              $slice: -50, 
              $sort: { playedAt: 1 } 
            } 
          },
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      return { success: true };
    } catch (e) {
      console.error('Lỗi recordPlay:', e);
      throw new AppError('Không thể ghi nhận lịch sử', 500, ErrorCodes.INTERNAL_ERROR);
    }
  },

  // 3. Lịch sử nghe nhạc (MongoDB)
  getHistory: async (userId: string) => {
    const history = await ListeningHistory.find({ userId })
      .sort({ playedAt: -1 })
      .limit(100)
      .lean();

    // Map với data Postgre nếu cần
    // (Lý do: Mongo chỉ lưu songId logic, muốn lấy title phải fetch Prisma)
    const songIds = Array.from(new Set(history.map(h => h.songId)));
    
    if (songIds.length === 0) return [];

    const songs = await prisma.song.findMany({
      where: { id: { in: songIds } },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        duration: true,
        audioUrl128: true,
        audioUrl320: true,
        canvasUrl: true,
        artistId: true,
        artist: { select: { stageName: true } }
      }
    });
    
    const songMap = new Map(songs.map(s => [s.id, s]));

    return history.map(h => {
      const song = songMap.get(h.songId);
      return {
        id: h._id?.toString(),
        userId: h.userId,
        songId: h.songId,
        playedAt: h.playedAt,
        durationPlayed: h.durationPlayed,
        completed: h.completed,
        deviceType: h.deviceType,
        // Flatten song data for easier usage
        ...(song ? {
          title: song.title,
          coverUrl: song.coverUrl,
          duration: song.duration,
          artistId: song.artistId,
          artistName: song.artist.stageName,
          audioUrl: song.audioUrl320 || song.audioUrl128 || '',
          canvasUrl: song.canvasUrl,
        } : {})
      };
    });
  },

  // 4. Recently Played API
  getRecentlyPlayed: async (userId: string) => {
    const doc = await RecentlyPlayed.findOne({ userId }).lean();
    if (!doc || !doc.items || doc.items.length === 0) return [];

    // Chiếu hậu dữ liệu với Postgres
    const songIds = doc.items.map(i => i.songId).reverse(); // Mới nhất lên đầu
    const uniqueIds = Array.from(new Set(songIds)); // Bỏ trùng

    const songs = await prisma.song.findMany({
      where: { id: { in: uniqueIds } },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        duration: true,
        audioUrl128: true,
        audioUrl320: true,
        canvasUrl: true,
        artistId: true,
        artist: { select: { stageName: true } }
      }
    });

    const songMap = new Map(songs.map(s => [s.id, s]));

    return uniqueIds.map(id => {
      const song = songMap.get(id);
      if (!song) return null;
      return {
        ...song,
        artistName: song.artist.stageName,
        audioUrl: song.audioUrl320 || song.audioUrl128 || '',
      };
    }).filter(Boolean);
  },

  // 5. Kiểm tra quyền Skip của Free User
  checkSkipLimit: async (userId: string, role: string) => {
     if (role !== 'USER_FREE') return { canSkip: true };

     const cacheKey = `skip_count:${userId}`;
     const currentStr = await redis.get(cacheKey);
     let current = currentStr ? parseInt(currentStr) : 0;

     if (current >= 6) {
        throw new AppError('Bạn đã dùng hết 6 lượt bỏ qua bài trong giờ này. Vui lòng nâng cấp Premium.', 403, ErrorCodes.FORBIDDEN);
     }

     const multi = redis.multi();
     multi.incr(cacheKey);
     if (!current) multi.expire(cacheKey, 3600); // 1 giờ
     await multi.exec();

     return { canSkip: true, remaining: 5 - current };
  }
};
