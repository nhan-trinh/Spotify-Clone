import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { MediaCard } from '../../components/shared/MediaCard';
import { RecentCard } from '../../components/shared/RecentCard';
import { FastAverageColor } from 'fast-average-color';

export const HomePage = () => {
  const [feedData, setFeedData] = useState<any>(null);
  const [dominantColor, setDominantColor] = useState('#121212');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get('/home/feed') as any;
        setFeedData(res.data);

        // Phát hiện màu từ ảnh đầu tiên
        if (res.data?.recentlyPlayed?.[0]?.coverUrl) {
          const fac = new FastAverageColor();
          const img = new Image();
          img.crossOrigin = 'Anonymous'; // Bắt buộc cho CORS
          img.src = res.data.recentlyPlayed[0].coverUrl;
          img.onload = () => {
            try {
              const color = fac.getColor(img);
              setDominantColor(color.hex);
            } catch (err) {
              console.log('Không thể lấy màu do CORS', err);
            } finally {
              fac.destroy();
            }
          };
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu HomePage', error);
      }
    };
    fetchFeed();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (!feedData) {
    return (
      <div className="flex-1 overflow-y-auto w-full p-6 text-white bg-[#121212] pt-24">
        Đang tải nhạc...
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-full overflow-y-auto relative isolate">
      {/* Dynamic Gradient Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-in-out -z-10"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor}88 0%, #121212 332px)`
        }}
      ></div>

      <div className="px-6 pt-20 pb-28 relative z-10 w-full max-w-screen-2xl mx-auto">
        {/* Lời chào */}
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">
          {getGreeting()}
        </h1>

        {/* Recently Played Grid (2 columns or 3 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10 w-full">
          {feedData.recentlyPlayed?.map((item: any) => (
            <RecentCard 
              key={item.id}
              id={item.id}
              title={item.title}
              coverUrl={item.coverUrl}
              songs={item.songs}
            />
          ))}
        </div>

        {/* Made For You Section */}
        <section className="mb-10 w-full">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Dành cho bạn</h2>
            <span className="text-sm font-bold text-[#b3b3b3] hover:underline cursor-pointer">Hiển thị tất cả</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
            {feedData.madeForYou?.map((item: any) => (
              <MediaCard 
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.description}
                coverUrl={item.coverUrl}
                songs={item.songs}
              />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-10 w-full">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Thịnh hành</h2>
            <span className="text-sm font-bold text-[#b3b3b3] hover:underline cursor-pointer">Hiển thị tất cả</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
            {feedData.trending?.map((item: any) => (
              <MediaCard 
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.description}
                coverUrl={item.coverUrl}
                songs={item.songs}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
