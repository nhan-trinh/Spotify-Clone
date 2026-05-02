import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../lib/api';
import { User as UserIcon, BadgeCheck, AlertTriangle, Share2, Sparkles } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { VinylCard } from '../../components/shared/VinylCard';
import { useUIStore } from '../../stores/ui.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const { openReportModal } = useUIStore();
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || id === currentUser?.id;
  const targetId = id || currentUser?.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profileRes = await api.get(`/users/${targetId}`) as any;
        setProfile(profileRes.data);

        // Fetch history only if it's the current user
        if (isOwnProfile) {
          const historyRes = await api.get('/users/history') as any;
          setHistory(historyRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (targetId) fetchProfileData();
  }, [targetId, isOwnProfile]);

  const handleFollow = async () => {
    if (!profile || isOwnProfile) return;
    try {
      await api.post(`/users/${profile.id}/follow`);
      setProfile({ ...profile, isFollowing: true, stats: { ...profile.stats, followers: profile.stats.followers + 1 } });

      const { socketService } = await import('../../lib/socket');
      socketService.emit('social:follow_success', { followingId: profile.id });
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const handleUnfollow = async () => {
    if (!profile || isOwnProfile) return;
    try {
      await api.delete(`/users/${profile.id}/unfollow`);
      setProfile({ ...profile, isFollowing: false, stats: { ...profile.stats, followers: Math.max(0, profile.stats.followers - 1) } });
    } catch (error) {
      console.error('Unfollow failed:', error);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#121212] text-[#B3B3B3]">
        <UserIcon size={80} className="mb-6 opacity-20" />
        <h2 className="text-3xl font-bold text-white mb-2">Không tìm thấy hồ sơ</h2>
        <p className="mb-6 text-sm">Người dùng này có thể không tồn tại.</p>
        <Link to="/" className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121212]">
      
      {/* VIBRANT & YOUTHFUL HEADER SECTION */}
      <div className="relative pt-32 pb-10 px-8 flex items-end min-h-[380px] overflow-hidden bg-[#121212]">
        
        {/* Dynamic Mesh Background Layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Animated Vibrant Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-[#b721ff] blur-[140px] opacity-[0.25] rounded-full animate-aura" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[#21d4fd] blur-[120px] opacity-[0.2] rounded-full animate-aura" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] bg-[#1DB954] blur-[150px] opacity-[0.15] rounded-full animate-aura" style={{ animationDelay: '1s' }} />
          
          {/* Noise Overlay for Texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Smooth Gradient Fade to Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent" />
        </div>

        {/* Header Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* The Vinyl Avatar */}
          <div className="relative group flex-shrink-0">
            {/* Spinning subtle outer ring (Vinyl vibe) */}
            <div className="absolute inset-[-10px] rounded-full border border-white/20 shadow-[0_0_50px_rgba(33,212,253,0.3)] animate-spin-slow opacity-60 flex items-center justify-center">
               <div className="w-[90%] h-[90%] rounded-full border-[0.5px] border-white/10" />
            </div>
            
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-[4px] border-[#121212] bg-[#282828] z-10">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <UserIcon size={80} className="w-full h-full p-12 text-[#B3B3B3]" />
              )}
              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-bold tracking-widest uppercase backdrop-blur-sm"
                >
                  Thay đổi
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center md:text-left flex-1 pb-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-md flex items-center justify-center md:justify-start gap-2 bg-white/10 w-max mx-auto md:mx-0 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              {profile.role === 'ARTIST' && <BadgeCheck size={14} className="text-[#3d91f4] fill-white" />}
              {profile.role === 'ARTIST' ? 'Nghệ sĩ xác thực' : 'Hồ sơ người nghe'}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white tracking-tighter drop-shadow-lg leading-none mt-2 mb-2">
              {profile.name}
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm font-medium mt-2">
              <span><strong className="text-white">{profile.stats?.playlists || 0}</strong> Playlists</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span><strong className="text-white">{(profile.stats?.followers || 0).toLocaleString()}</strong> Người theo dõi</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-5">
              {!isOwnProfile && (
                currentUser?.role === 'ARTIST' && (profile.role === 'USER_FREE' || profile.role === 'USER_PREMIUM') ? (
                  <span className="px-6 py-2.5 rounded-full border border-[#b721ff]/50 bg-[#b721ff]/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} />
                    Fan hâm mộ
                  </span>
                ) : (
                  <button
                    onClick={profile.isFollowing ? handleUnfollow : handleFollow}
                    className={cn(
                      "px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 uppercase tracking-wider",
                      profile.isFollowing
                        ? "bg-transparent text-white border border-white/40 hover:border-white"
                        : "bg-gradient-to-r from-[#21d4fd] to-[#b721ff] text-white hover:scale-105 shadow-[0_0_15px_rgba(183,33,255,0.4)] border-none"
                    )}
                  >
                    {profile.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                  </button>
                )
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Đã sao chép liên kết hồ sơ');
                }}
                className="p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md"
                title="Sao chép liên kết"
              >
                <Share2 size={20} />
              </button>
              
              {!isOwnProfile && currentUser && (
                <button
                  onClick={() => openReportModal(profile.id, 'USER', profile.name)}
                  className="p-3 rounded-full border border-white/10 bg-white/5 text-white hover:text-red-500 hover:bg-red-500/20 transition-all active:scale-90 backdrop-blur-md"
                  title="Báo cáo người dùng"
                >
                  <AlertTriangle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (Structured Grid layout with VinylCards) */}
      <div className="px-8 pb-24 pt-8 space-y-12 bg-[#121212] relative z-20">

        {/* Recently Played */}
        {isOwnProfile && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Giai điệu gần đây</h2>
              <span className="text-xs font-bold text-[#B3B3B3] hover:text-white cursor-pointer uppercase tracking-widest">Xem tất cả</span>
            </div>

            {history.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {history.slice(0, 6).map((song: any) => (
                  <VinylCard
                    key={song.id}
                    item={song}
                    type="song"
                  />
                ))}
              </div>
            ) : (
              <div className="text-[#B3B3B3] italic text-sm py-4">Chưa có lịch sử nghe nhạc. Hãy bắt đầu nghe ngay! 🎵</div>
            )}
          </section>
        )}

        {/* Discography (Artist) */}
        {profile.role === 'ARTIST' && profile.albums?.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Danh sách đĩa nhạc</h2>
              <span className="text-xs font-bold text-[#B3B3B3] hover:text-white cursor-pointer uppercase tracking-widest">Xem tất cả</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {profile.albums.map((album: any) => (
                <VinylCard
                  key={album.id}
                  item={album}
                  type="album"
                />
              ))}
            </div>
          </section>
        )}

        {/* Public Playlists */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Bộ sưu tập công khai</h2>
          </div>

          {profile.playlists?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {profile.playlists.map((pl: any) => (
                <VinylCard
                  key={pl.id}
                  item={pl}
                  type="playlist"
                />
              ))}
            </div>
          ) : (
            <div className="text-[#B3B3B3] italic text-sm">Người dùng này đang giấu kín gu âm nhạc của mình.</div>
          )}
        </section>

      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="flex-1 overflow-y-auto bg-[#121212]">
    <div className="h-[380px] flex items-end p-8 bg-[#181818]/50">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-10 w-full">
        <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full" />
        <div className="space-y-4 flex-1 pb-2 w-full">
          <Skeleton className="h-6 w-32 rounded-full mx-auto md:mx-0" />
          <Skeleton className="h-20 w-3/4 max-w-[500px] rounded-lg mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-4">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
    <div className="p-8 space-y-12">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
