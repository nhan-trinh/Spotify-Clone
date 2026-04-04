
import { Home, Search, Library, Plus, Heart, Music2, CheckCircle2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLibraryStore } from '../../stores/library.store';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/auth.store';

export const Sidebar = ({ className }: { className?: string }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { isHydrated } = useLibraryStore();
  const [libraryItems, setLibraryItems] = useState<any>(null);

  const isArtist = user?.role === 'ARTIST';
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Tìm kiếm', path: '/search', icon: Search },
  ];

  useEffect(() => {
    if (!isAuthenticated || !isHydrated) return;
    const fetchSidebarLibrary = async () => {
      try {
        const res = await api.get('/users/library') as any;
        setLibraryItems(res.data);
      } catch { }
    };
    fetchSidebarLibrary();
  }, [isAuthenticated, isHydrated]);

  const hasItems = libraryItems?.likedSongs?.length > 0 || libraryItems?.followedArtists?.length > 0;

  return (
    <nav className={twMerge('flex flex-col gap-2 h-full', className)}>
      {/* Top Nav Box */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 text-sm font-bold transition-colors",
                isActive ? "text-white" : "text-[#B3B3B3] hover:text-white"
              )}
            >
              <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}

        {/* Artist Dashboard link */}
        {(isArtist || isAdmin) && (
          <Link
            to="/artist-dashboard"
            className={clsx(
              "flex items-center gap-4 text-sm font-bold transition-colors",
              location.pathname.startsWith('/artist-dashboard') ? "text-[#1DB954]" : "text-[#B3B3B3] hover:text-white"
            )}
          >
            <LayoutDashboard className="h-6 w-6" />
            Artist Hub
          </Link>
        )}

        {/* Admin Dashboard link */}
        {isAdmin && (
          <Link
            to="/admin"
            className={clsx(
              "flex items-center gap-4 text-sm font-bold transition-colors",
              location.pathname.startsWith('/admin') ? "text-[#1DB954]" : "text-[#B3B3B3] hover:text-white"
            )}
          >
            <ShieldCheck className="h-6 w-6" />
            Admin
          </Link>
        )}
      </div>

      {/* Library Box */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between text-[#B3B3B3] font-bold shadow-sm">
          <Link to="/library" className="flex items-center gap-4 hover:text-white transition-colors duration-200">
            <Library className="h-6 w-6" />
            Thư viện
          </Link>
          <button className="hover:text-white transition-colors rounded-full p-1 hover:bg-[#282828]">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
          {!isAuthenticated || !hasItems ? (
            <>
              <div className="p-4 bg-[#242424] rounded-lg mt-2 mb-4 text-sm">
                <p className="font-bold text-white mb-2">Tạo playlist đầu tiên của bạn</p>
                <p className="text-[#B3B3B3] mb-4">Rất dễ, chúng tôi sẽ giúp bạn</p>
                <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform text-sm">
                  Tạo danh sách phát
                </button>
              </div>

              <div className="p-4 bg-[#242424] rounded-lg text-sm">
                <p className="font-bold text-white mb-2">Hãy cùng tìm vài podcast theo dõi</p>
                <p className="text-[#B3B3B3] mb-4">Chúng tôi sẽ cập nhật các tập mới cho bạn</p>
                <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform text-sm">
                  Duyệt xem podcast
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Liked Songs card */}
              {libraryItems?.likedSongs?.length > 0 && (
                <Link
                  to="/library"
                  className={clsx(
                    "flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer group",
                    location.pathname === '/library' && 'bg-[#282828]'
                  )}
                >
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-[#7b52b8] to-[#2d0f6e] flex items-center justify-center flex-shrink-0 shadow">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">Bài hát đã thích</p>
                    <p className="text-xs text-[#B3B3B3] truncate">
                      Danh sách phát • {libraryItems.likedSongs.length} bài hát
                    </p>
                  </div>
                </Link>
              )}

              {/* Followed Artists */}
              {libraryItems?.followedArtists?.map((artist: any) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <img
                    src={artist.avatarUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=100&h=100'}
                    alt={artist.stageName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-white truncate">{artist.stageName}</p>
                      {artist.isVerified && <CheckCircle2 size={12} className="text-[#1DB954] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[#B3B3B3]">Nghệ sĩ</p>
                  </div>
                </Link>
              ))}

              {/* Fallback nếu không có gì */}
              {!hasItems && (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <Music2 className="w-8 h-8 text-[#B3B3B3] mb-3" />
                  <p className="text-sm font-bold text-white mb-1">Thư viện trống</p>
                  <p className="text-xs text-[#B3B3B3]">Thích bài hát hoặc theo dõi nghệ sĩ để bắt đầu.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
