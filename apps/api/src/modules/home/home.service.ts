import { prisma } from '../../shared/config/database';

export const HomeService = {
  getFeed: async () => {
    // 1. Made For You: Chúng ta sẽ lấy ngẫu nhiên một số playlist public
    const madeForYou = await prisma.playlist.findMany({
      where: { isPublic: true },
      take: 4,
      include: {
        songs: {
          take: 5,
          include: {
            song: {
              include: { artist: true }
            }
          }
        }
      }
    });

    // 2. Trending: Các playlist do system tạo (Top Hit)
    const trending = await prisma.playlist.findMany({
      where: { isSystem: true, isPublic: true },
      take: 3,
      include: {
        songs: {
          take: 5,
          include: {
            song: {
              include: { artist: true }
            }
          }
        }
      }
    });

    // 3. Recently Played: Lấy các Playlist Public (Giả lập History)
    const recentPlaylists = await prisma.playlist.findMany({
      where: { isPublic: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        songs: {
          take: 5,
          include: {
            song: {
              include: { artist: true }
            }
          }
        }
      }
    });
    
    // Map songs ra format mock
    const mapSong = (s: any) => ({
      id: s.id,
      title: s.title,
      artistName: s.artist.stageName,
      coverUrl: s.coverUrl,
      audioUrl: s.audioUrl320 || s.audioUrl128,
      duration: s.duration,
      artistId: s.artistId
    });

    const formatPlaylistCards = (playlists: any[]) => playlists.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      coverUrl: p.coverUrl,
      songs: p.songs.map((ps: any) => mapSong(ps.song))
    }));

    const recentlyPlayed = formatPlaylistCards(recentPlaylists);

    return {
      recentlyPlayed,
      madeForYou: formatPlaylistCards(madeForYou),
      trending: formatPlaylistCards(trending),
    };
  }
};
