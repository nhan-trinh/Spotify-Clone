import { Request, Response } from 'express';
import { catchAsync } from '../../shared/utils/catch-async';
import { sendSuccess } from '../../shared/utils/response';

const sampleSongs = [
  {
    id: 'mock-1',
    title: 'Bản Nhạc Test 1',
    artistName: 'SoundHelix',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: 'mock-2',
    title: 'Bản Nhạc Test 2',
    artistName: 'SoundHelix',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?auto=format&fit=crop&q=80&w=200&h=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: 'mock-3',
    title: 'Bản Nhạc Test 3',
    artistName: 'SoundHelix',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200&h=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 344,
  },
  {
    id: 'mock-4',
    title: 'Bản Nhạc Test 4',
    artistName: 'SoundHelix',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=200&h=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
  },
  {
    id: 'mock-5',
    title: 'Bản Nhạc Test 5',
    artistName: 'SoundHelix',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=200&h=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 353,
  }
];

export const homeController = {
  getFeed: catchAsync(async (_req: Request, res: Response) => {

    // Tạo 6 card Recently Played (Nghe gần đây)
    // Tùy biến Cover đẹp cho UI 
    const recentlyPlayed = [
      { id: 'rp-1', title: 'Cà phê sáng', coverUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[0], sampleSongs[1]] },
      { id: 'rp-2', title: 'Lofi Chill', coverUrl: 'https://images.unsplash.com/photo-1516280440502-6cfa7b8f6c38?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[2], sampleSongs[3]] },
      { id: 'rp-3', title: 'Nhạc Acoustic Nhẹ Nhàng', coverUrl: 'https://images.unsplash.com/photo-1460036521480-c116c4bbb614?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[4], sampleSongs[0]] },
      { id: 'rp-4', title: 'Mix Của Tôi', coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[1], sampleSongs[2]] },
      { id: 'rp-5', title: 'Edm Sôi Động', coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[2], sampleSongs[4]] },
      { id: 'rp-6', title: 'Pop & Rap VN', coverUrl: 'https://images.unsplash.com/photo-1520004434532-668416a08753?auto=format&fit=crop&q=80&w=200&h=200', songs: [sampleSongs[3], sampleSongs[1]] },
    ];

    const madeForYou = [
      { id: 'mfy-1', title: 'Tuyển tập Nhạc Ngủ', description: 'Cho giấc ngủ sâu và thảnh thơi.', coverUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[4], sampleSongs[0]] },
      { id: 'mfy-2', title: 'Daily Mix 1', description: 'Cập nhật mỗi ngày dựa trên gu của bạn.', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[1], sampleSongs[2]] },
      { id: 'mfy-3', title: 'Mưa & Nostalgia', description: 'Cảm giác hoài niệm trong mưa.', coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[3], sampleSongs[4]] },
      { id: 'mfy-4', title: 'Tập Luyện Toát Mồ Hôi', description: 'Pump up the bass.', coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[0], sampleSongs[3]] },
    ];

    const trending = [
      { id: 'tr-1', title: 'Top 50 Global', description: 'Các bài hát đang càn quét thế giới.', coverUrl: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&q=80&w=300&h=300', songs: sampleSongs },
      { id: 'tr-2', title: 'Top 50 Vietnam', description: 'Top nghe nhiều nhất tại Việt Nam.', coverUrl: 'https://images.unsplash.com/photo-1582215886638-348e3cf3abec?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[4], sampleSongs[3], sampleSongs[2]] },
      { id: 'tr-3', title: 'Viral 50', description: 'Đang nổi rần rần trên TikTok.', coverUrl: 'https://images.unsplash.com/photo-1491897554428-130a60a1496c?auto=format&fit=crop&q=80&w=300&h=300', songs: [sampleSongs[1], sampleSongs[0]] },
    ];

    sendSuccess(res, { recentlyPlayed, madeForYou, trending }, 'Lấy dữ liệu trang chủ thành công');
  }),
};
