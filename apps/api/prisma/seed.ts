import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seeding dữ liệu...');

  // 1. Tạo Admin gốc
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@spotify.clone' },
    update: {},
    create: {
      email: 'admin@spotify.clone',
      name: 'System Admin',
      passwordHash: adminPassword,
      dateOfBirth: new Date('2000-01-01'),
      role: 'ADMIN',
      isEmailVerified: true
    }
  });
  console.log('Đã tạo Admin:', admin.email);

  // 2. Tạo User & Nghệ sĩ 1 (SoundHelix)
  const artistUser1 = await prisma.user.upsert({
    where: { email: 'soundhelix@mock.com' },
    update: {},
    create: {
      email: 'soundhelix@mock.com',
      name: 'SoundHelix Maker',
      passwordHash: adminPassword,
      dateOfBirth: new Date('1990-01-01'),
      role: 'ARTIST',
      isEmailVerified: true
    }
  });

  const artist1 = await prisma.artist.upsert({
    where: { userId: artistUser1.id },
    update: {},
    create: {
      userId: artistUser1.id,
      stageName: 'SoundHelix',
      bio: 'Nhạc sĩ sáng tác nhạc Electronic mã nguồn mở.',
      avatarUrl: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=500&h=500',
      isVerified: true
    }
  });
  console.log('Đã tạo Artist:', artist1.stageName);

  // 3. Tạo User & Nghệ sĩ 2 (Lofi Girl)
  const artistUser2 = await prisma.user.upsert({
    where: { email: 'lofigirl@mock.com' },
    update: {},
    create: {
      email: 'lofigirl@mock.com',
      name: 'Chilled Cow',
      passwordHash: adminPassword,
      dateOfBirth: new Date('1995-05-05'),
      role: 'ARTIST',
      isEmailVerified: true
    }
  });

  const artist2 = await prisma.artist.upsert({
    where: { userId: artistUser2.id },
    update: {},
    create: {
      userId: artistUser2.id,
      stageName: 'Lofi Girl',
      bio: 'Beats to relax/study to.',
      avatarUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=500&h=500',
      isVerified: true
    }
  });

  // 4. Tạo Thể loại (Genre)
  const popGenre = await prisma.genre.upsert({ where: { slug: 'pop' }, update: {}, create: { name: 'Pop', slug: 'pop' } });
  const edmGenre = await prisma.genre.upsert({ where: { slug: 'edm' }, update: {}, create: { name: 'EDM', slug: 'edm' } });
  const loFiGenre = await prisma.genre.upsert({ where: { slug: 'lofi' }, update: {}, create: { name: 'Lo-Fi', slug: 'lofi' } });

  // 5. Tạo 10 Bài hát
  // Dùng link MP3 từ SoundHelix
  const songDataList = [
    { title: 'The First Spark', artistId: artist1.id, genreId: edmGenre.id, duration: 372, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300', playCount: 15400, expectedStatus: 'APPROVED' },
    { title: 'Midnight Chill', artistId: artist1.id, genreId: edmGenre.id, duration: 425, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?auto=format&fit=crop&q=80&w=300&h=300', playCount: 8900, expectedStatus: 'APPROVED' },
    { title: 'Cyber City', artistId: artist1.id, genreId: popGenre.id, duration: 344, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=300', playCount: 12050, expectedStatus: 'APPROVED' },
    { title: 'Neon Lights', artistId: artist1.id, genreId: edmGenre.id, duration: 302, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=300&h=300', playCount: 19800, expectedStatus: 'APPROVED' },
    { title: 'Rainy Cafe', artistId: artist2.id, genreId: loFiGenre.id, duration: 353, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=300&h=300', playCount: 30500, expectedStatus: 'APPROVED' },
    { title: 'Autumn Leaf', artistId: artist2.id, genreId: loFiGenre.id, duration: 301, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', coverUrl: 'https://images.unsplash.com/photo-1481886756534-97af88ccb43c?auto=format&fit=crop&q=80&w=300&h=300', playCount: 22000, expectedStatus: 'APPROVED' },
    { title: 'Night Walk', artistId: artist2.id, genreId: loFiGenre.id, duration: 353, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=300&h=300', playCount: 27100, expectedStatus: 'APPROVED' },
    { title: 'Desert Wind', artistId: artist1.id, genreId: popGenre.id, duration: 366, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300', playCount: 11000, expectedStatus: 'APPROVED' },
    { title: 'Ocean Waves', artistId: artist2.id, genreId: loFiGenre.id, duration: 365, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', coverUrl: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=300&h=300', playCount: 35000, expectedStatus: 'APPROVED' },
    { title: 'Mountain Top', artistId: artist1.id, genreId: popGenre.id, duration: 391, audioUrl320: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300&h=300', playCount: 9500, expectedStatus: 'APPROVED' },
  ];

  await prisma.song.deleteMany({}); // Xoá sạch bài hát cũ

  const insertedSongs = [];
  for (const s of songDataList) {
    const song = await prisma.song.create({
      data: {
        title: s.title,
        artistId: s.artistId,
        genreId: s.genreId,
        duration: s.duration,
        audioUrl320: s.audioUrl320,
        coverUrl: s.coverUrl,
        playCount: s.playCount,
        status: s.expectedStatus as any
      }
    });
    insertedSongs.push(song);
  }
  console.log('Đã tạo 10 bài hát.');

  // 6. Tạo 1 System Playlist tổng hợp
  await prisma.playlist.deleteMany({});
  const mainPlaylist = await prisma.playlist.create({
    data: {
      title: 'Top Hits Việt Nam & Quốc Tế',
      description: 'Tuyển tập những bản nhạc thịnh hành nhất hiện nay.',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500&h=500',
      ownerId: admin.id,
      isSystem: true,
      isPublic: true,
      isFeatured: true,
    }
  });

  // Nhét bài hát vào Playlist
  for (let i = 0; i < insertedSongs.length; i++) {
    await prisma.playlistSong.create({
      data: {
        playlistId: mainPlaylist.id,
        songId: insertedSongs[i].id,
        addedBy: admin.id,
        position: i + 1
      }
    });
  }
  console.log('Đã tạo Playlist Top Hits.');

  // Playlist Lofi
  const lofiPlaylist = await prisma.playlist.create({
    data: {
      title: 'Lofi Chill 24/7',
      description: 'Nhạc nhẹ nhàng học tập.',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=500&h=500',
      ownerId: artistUser2.id,
      isSystem: false,
      isPublic: true,
      isFeatured: true,
    }
  });

  const lofiSongs = insertedSongs.filter(s => s.artistId === artist2.id);
  for (let i = 0; i < lofiSongs.length; i++) {
    await prisma.playlistSong.create({
      data: {
        playlistId: lofiPlaylist.id,
        songId: lofiSongs[i].id,
        addedBy: artistUser2.id,
        position: i + 1
      }
    });
  }
  console.log('Đã tạo Playlist Lofi.');

  console.log('✅ Seeding hoàn tất.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
