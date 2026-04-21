import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';
import { MediaCard } from '../../components/shared/MediaCard';
import { SearchFilterChips } from '../../components/search/SearchFilterChips';
import { TopResultCard } from '../../components/search/TopResultCard';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../../stores/player.store';

const BROWSE_CATEGORIES = [
  { id: '1', name: 'Podcasts', color: 'bg-[#E13300]' },
  { id: '2', name: 'Cho bạn', color: 'bg-[#1E3264]' },
  { id: '3', name: 'Mới phát hành', color: 'bg-[#E8115B]' },
  { id: '4', name: 'Nhạc Việt', color: 'bg-[#148A08]' },
  { id: '5', name: 'Pop', color: 'bg-[#D84000]' },
  { id: '6', name: 'K-Pop', color: 'bg-[#148A08]' },
  { id: '7', name: 'Chill', color: 'bg-[#503750]' },
  { id: '8', name: 'Hip-Hop', color: 'bg-[#BC5900]' },
  { id: '9', name: 'Buồn', color: 'bg-[#8D67AB]' },
  { id: '10', name: 'Tập luyện', color: 'bg-[#777777]' },
];

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [activeTab, setActiveTab] = useState('all');
  const { setQueueAndPlay } = usePlayerStore();

  const { data: results, isLoading: loading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await api.get(`/search?q=${encodeURIComponent(query!)}`) as any;
      return res.data;
    },
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="p-6 pt-24 min-h-full w-full max-w-screen-2xl mx-auto text-white">
        <h2 className="text-2xl font-bold mb-6">Duyệt tìm tất cả</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {BROWSE_CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className={`relative overflow-hidden rounded-lg aspect-square p-4 cursor-pointer hover:scale-[1.02] hover:brightness-110 transition-all ${cat.color}`}
            >
              <span className="text-xl font-bold tracking-tight">{cat.name}</span>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/20 rounded-full rotate-12 blur-sm"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 pt-24 min-h-full w-full max-w-screen-2xl mx-auto">
        <div className="h-8 w-48 bg-white/10 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="bg-[#181818] p-4 rounded-md animate-pulse">
               <div className="w-full aspect-square bg-white/10 rounded mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"></div>
               <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
               <div className="h-3 bg-white/10 rounded w-1/2"></div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  const hasResults = results?.songs?.length > 0 || results?.artists?.length > 0 || results?.albums?.length > 0 || results?.users?.length > 0;

  if (!hasResults) {
    return (
      <div className="p-6 pt-24 min-h-full w-full max-w-screen-2xl mx-auto text-white">
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy kết quả nào cho "{query}"</h2>
          <p className="text-[#B3B3B3]">Vui lòng kiểm tra lại chính tả hoặc dùng các từ khóa khác.</p>
        </div>
      </div>
    );
  }

  const topSongs = results.songs?.slice(0, 4) || [];

  return (
    <div className="p-6 pt-24 min-h-full w-full max-w-screen-2xl mx-auto text-white">
      <div className="mb-6">
        <SearchFilterChips activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex flex-col gap-10">
        {/* TOP RESULT & SONGS - Chỉ hiện ở tab ALL */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột trái: Top Result */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Kết quả hàng đầu</h2>
              {results.topResult && <TopResultCard result={results.topResult} />}
            </div>

            {/* Cột phải: Bài hát tiêu biểu */}
            <div className="lg:col-span-7 flex flex-col gap-4">
               <h2 className="text-2xl font-bold">Bài hát</h2>
               <div className="flex flex-col">
                  {topSongs.map((song: any) => (
                    <div 
                      key={song.id}
                      onClick={() => setQueueAndPlay([song], 0, song.id)}
                      className="group flex items-center gap-4 p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="relative w-10 h-10">
                         <img src={song.coverUrl} className="w-full h-full object-cover rounded" alt={song.title} />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded">
                           <Play size={16} className="fill-current text-white" />
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <span className="font-bold truncate text-sm">{song.title}</span>
                        <span className="text-xs text-[#b3b3b3] truncate">{song.artistName}</span>
                      </div>
                      <span className="text-xs text-[#b3b3b3] p-2">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* GRID RESULTS - Hiện tùy theo tab */}
        {(activeTab === 'all' || activeTab === 'artists') && results.artists?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Nghệ sĩ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.artists.map((artist: any) => (
                <MediaCard 
                  key={artist.id}
                  id={artist.id}
                  title={artist.stageName}
                  subtitle="Nghệ sĩ"
                  coverUrl={artist.avatarUrl}
                  isCircle={true}
                  type="artist"
                />
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'albums') && results.albums?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Album</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.albums.map((album: any) => (
                <MediaCard 
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={album.artistName}
                  coverUrl={album.coverUrl}
                  type="album"
                />
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'playlists') && results.playlists?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Playlist</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.playlists.map((playlist: any) => (
                <MediaCard 
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.title}
                  subtitle={playlist.description || "Danh sách phát"}
                  coverUrl={playlist.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?auto=format&fit=crop&q=80&w=200&h=200'}
                  type="playlist"
                />
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'profiles') && results.users?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Người dùng</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.users.map((user: any) => (
                <MediaCard 
                  key={user.id}
                  id={user.id}
                  title={user.name}
                  subtitle="Người dùng"
                  coverUrl={user.avatarUrl}
                  isCircle={true}
                  type="profile"
                />
              ))}
            </div>
          </section>
        )}

        {/* Khi xem tab Songs thì hiện Grid lớn cho Songs */}
        {activeTab === 'songs' && results.songs?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Bài hát</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.songs.map((song: any) => (
                <MediaCard 
                  key={song.id}
                  id={song.id}
                  title={song.title}
                  subtitle={song.artistName}
                  coverUrl={song.coverUrl}
                  type="song"
                  songs={[song]}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
