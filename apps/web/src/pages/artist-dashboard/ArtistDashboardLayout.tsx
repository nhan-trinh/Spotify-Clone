import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useEffect, useState } from 'react';
import { BarChart2, Music, Disc3, Settings, ChevronLeft, Mic2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const navItems = [
  { label: 'Tổng quan', path: '/artist-dashboard', icon: BarChart2, end: true },
  { label: 'Bài hát', path: '/artist-dashboard/songs', icon: Music },
  { label: 'Album', path: '/artist-dashboard/albums', icon: Disc3 },
  { label: 'Cài đặt', path: '/artist-dashboard/settings', icon: Settings },
];

// ─── Setup Wizard ─────────────────────────────────────────────────────────────
const SetupWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuthStore();
  const [stageName, setStageName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!stageName.trim()) { toast.error('Vui lòng nhập tên nghệ sĩ'); return; }
    setLoading(true);
    try {
      await api.post('/artists/setup-profile', { stageName: stageName.trim() });
      toast.success('Profile nghệ sĩ đã được tạo! 🎤');
      onComplete();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="bg-[#181818] rounded-2xl p-8 w-full max-w-md border border-[#282828] text-center">
        <div className="w-16 h-16 bg-[#1DB954]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic2 size={32} className="text-[#1DB954]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Thiết lập Artist Profile</h2>
        <p className="text-[#b3b3b3] text-sm mb-6">
          Bạn chưa có Artist Profile. Hãy tạo nhanh để bắt đầu đăng nhạc!
        </p>
        <div className="text-left mb-4">
          <label className="text-xs text-[#b3b3b3] mb-1.5 block">Tên nghệ sĩ *</label>
          <input
            className="w-full bg-[#282828] border border-[#3e3e3e] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1DB954] transition-colors"
            placeholder="Nhập tên nghệ sĩ của bạn..."
            value={stageName}
            onChange={e => setStageName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetup()}
            autoFocus
          />
        </div>
        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full py-3 bg-[#1DB954] text-black font-bold rounded-full hover:bg-[#1ed760] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Đang tạo...</> : 'Bắt đầu →'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────
export const ArtistDashboardLayout = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState<'loading' | 'missing' | 'ok'>('loading');

  useEffect(() => {
    // Redirect nếu không phải ARTIST/ADMIN
    if (user && user.role !== 'ARTIST' && user.role !== 'ADMIN') {
      navigate('/', { replace: true });
      return;
    }
    // Kiểm tra có Artist profile chưa
    const checkProfile = async () => {
      try {
        await api.get('/artists/me/analytics');
        setProfileStatus('ok');
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.data?.message?.includes('không phải')) {
          setProfileStatus('missing');
        } else {
          // 403 = JWT role cũ, cần re-login
          toast.error('Token hết hạn, vui lòng đăng xuất và đăng nhập lại', { duration: 5000 });
          setProfileStatus('missing');
        }
      }
    };
    if (user) checkProfile();
  }, [user, navigate]);

  if (profileStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#1DB954]" />
      </div>
    );
  }

  if (profileStatus === 'missing') {
    return <SetupWizard onComplete={() => setProfileStatus('ok')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#111] flex flex-col border-r border-[#282828]">
        <div className="p-6 border-b border-[#282828]">
          <div className="flex items-center gap-2 mb-1">
            <Mic2 size={20} className="text-[#1DB954]" />
            <h1 className="text-lg font-black text-white tracking-tight">Artist Hub</h1>
          </div>
          <p className="text-xs text-[#b3b3b3] truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1DB954]/15 text-[#1DB954]'
                    : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#282828]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-[#b3b3b3] hover:text-white transition-colors w-full"
          >
            <ChevronLeft size={16} />
            Về trang chủ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
