import { prisma } from '../../shared/config/database';
import { meilisearch } from '../../shared/config/meilisearch';
import { redis } from '../../shared/config/redis';

export const SearchService = {
  // 1. Đồng bộ hóa lại dữ liệu với Meilisearch (thường chạy thủ công hoặc trên cron)
  syncIndexes: async () => {
    // a. Đồng bộ Songs
    const songs = await prisma.song.findMany({
      where: { status: 'APPROVED' },
      include: { artist: { select: { stageName: true } }, album: { select: { title: true } } }
    });

    const songDocs = songs.map(s => ({
      id: s.id,
      title: s.title,
      artistName: s.artist.stageName,
      albumTitle: s.album?.title || '',
      genre: s.genreId || '',
      language: s.language || '',
      releaseDate: s.releaseDate?.getTime() || 0,
      playCount: s.playCount,
      status: s.status,
      // Pass data render Frontend
      audioUrl: s.audioUrl320 || s.audioUrl128 || '',
      coverUrl: s.coverUrl || '',
      artistId: s.artistId
    }));
    await meilisearch.index('songs').addDocuments(songDocs, { primaryKey: 'id' });

    // b. Đồng bộ Artists
    const artists = await prisma.artist.findMany();
    const artistDocs = artists.map(a => ({
      id: a.id,
      stageName: a.stageName,
      bio: a.bio || '',
      isVerified: a.isVerified,
    }));
    await meilisearch.index('artists').addDocuments(artistDocs, { primaryKey: 'id' });

    // c. Đồng bộ Albums
    const albums = await prisma.album.findMany({
      where: { status: 'PUBLISHED' },
      include: { artist: { select: { stageName: true } } }
    });
    const albumDocs = albums.map(a => ({
      id: a.id,
      title: a.title,
      artistName: a.artist.stageName,
      releaseDate: a.releaseDate?.getTime() || 0,
    }));
    await meilisearch.index('albums').addDocuments(albumDocs, { primaryKey: 'id' });

    return { message: 'Đã đồng bộ xong dữ liệu Meilisearch' };
  },

  // 2. Mock Tìm kiếm hợp nhất -> Đã chuyển sang MEILISEARCH REAL
  globalSearch: async (query: string, _type?: string) => {
    if (!query) return { songs: [], artists: [], albums: [] };

    const q = query.toLowerCase();

    const [songsRes, artistsRes, albumsRes] = await Promise.all([
      meilisearch.index('songs').search(q, { limit: 10 }),
      meilisearch.index('artists').search(q, { limit: 5 }),
      meilisearch.index('albums').search(q, { limit: 5 }),
    ]);

    return { 
      songs: songsRes.hits, 
      artists: artistsRes.hits,
      albums: albumsRes.hits 
    };
  },

  // 3. Top Charts (Trending theo playCount cached 1h)
  getTopCharts: async () => {
    const cached = await redis.get('music:top_charts');
    if (cached) return JSON.parse(cached);

    const topSongs = await prisma.song.findMany({
      where: { status: 'APPROVED' },
      orderBy: { playCount: 'desc' },
      take: 50,
      include: { artist: { select: { stageName: true } } }
    });

    await redis.set('music:top_charts', JSON.stringify(topSongs), 'EX', 3600); // 1 hr
    return topSongs;
  },

  discoverWeekly: async (_userId: string) => {
    // Thuật toán đề xuất đơn giản: Random top 30 bài hát 
    // TODO: Connect listening_history mongodb ở Phase 4
    
    // Fallback: lay 30 bai mix random
    const count = await prisma.song.count({ where: { status: 'APPROVED' } });
    const skip = Math.max(0, Math.floor(Math.random() * count) - 30);
    
    return await prisma.song.findMany({
       where: { status: 'APPROVED' },
       take: 30,
       skip,
       include: { artist: { select: { stageName: true } } }
    });
  }
};
