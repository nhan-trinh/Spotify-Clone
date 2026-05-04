import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useEffect, useState } from 'react';
import { BarChart2, Music, Disc3, Settings, ChevronLeft, Mic2, Loader2, Activity, Shield, Cpu, Zap, Globe } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Overview', path: '/artist-dashboard', icon: BarChart2, end: true, index: '01' },
  { label: 'Archive_Songs', path: '/artist-dashboard/songs', icon: Music, index: '02' },
  { label: 'Archive_Albums', path: '/artist-dashboard/albums', icon: Disc3, index: '03' },
  { label: 'System_Config', path: '/artist-dashboard/settings', icon: Settings, index: '04' },
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden isolate">
      {/* Noise Layer */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      {/* Scanlines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="bg-black border border-white/10 p-12 w-full max-w-xl relative z-10 shadow-[40px_40px_0px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 border border-[#1DB954] flex items-center justify-center bg-[#1DB954]/5">
            <Mic2 size={32} className="text-[#1DB954]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.5em]">Auth_Protocol_v4</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Entity_Initialization</h2>
          </div>
        </div>

        <p className="text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic mb-12">
          New artist entity detected. Manual synchronization of identity descriptors is required to activate the broadcast module.
        </p>

        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black text-[#1DB954]">ARG_01</span>
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Alias_Descriptor</label>
          </div>
          <input
            className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest"
            placeholder="INPUT_STAGE_NAME"
            value={stageName}
            onChange={e => setStageName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetup()}
            autoFocus
          />
        </div>

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full py-5 bg-[#1DB954] text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all disabled:opacity-30 relative group overflow-hidden"
        >
          {loading ? 'INITIALIZING...' : 'ACTIVATE_PROFILE_HUB'}
          <div className="absolute top-0 right-0 p-1 opacity-20"><Zap size={10} /></div>
        </button>

        {/* Technical Decor */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border border-white/20" />
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
    if (user && user.role !== 'ARTIST' && user.role !== 'ADMIN') {
      navigate('/', { replace: true });
      return;
    }
    const checkProfile = async () => {
      try {
        await api.get('/artists/me/analytics');
        setProfileStatus('ok');
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.data?.message?.includes('không phải')) {
          setProfileStatus('missing');
        } else {
          toast.error('Token hết hạn, vui lòng đăng xuất và đăng nhập lại', { duration: 5000 });
          setProfileStatus('missing');
        }
      }
    };
    if (user) checkProfile();
  }, [user, navigate]);

  if (profileStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#1DB954]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing_Control_Node</span>
        </div>
      </div>
    );
  }

  if (profileStatus === 'missing') {
    return <SetupWizard onComplete={() => setProfileStatus('ok')} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-black overflow-hidden text-white font-sans relative isolate">
      {/* Global Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] flex-shrink-0 bg-black flex flex-col border-r border-white/10 z-20 relative">

          <div className="p-8 border-b border-white/10 bg-white/[0.02]">
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1DB954]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1DB954]">Control_Node_v4.2</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Artist_Hub</h1>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black">
                <Mic2 size={16} className="text-white/40" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest truncate">{user?.name}</p>
                <p className="text-[8px] text-[#1DB954] font-black uppercase tracking-widest truncate">Status: ACTIVE</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
            <div className="px-4 mb-4">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Primary_Modules</span>
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-4 py-4 transition-all group relative",
                    isActive
                      ? "bg-[#1DB954] text-black"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <item.icon size={16} className={cn("transition-colors", "group-hover:scale-110")} />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                </div>
                <span className="text-[8px] font-black italic opacity-20 group-hover:opacity-100">{item.index}</span>

                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-1 h-full bg-black opacity-0 group-[.active]:opacity-10" />
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-white/10 bg-black/50">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center justify-between w-full px-4 py-4 border border-white/10 text-white/40 hover:border-white hover:text-white transition-all overflow-hidden relative"
            >
              <div className="flex items-center gap-3 relative z-10">
                <ChevronLeft size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit_Module</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
            </button>

            <div className="mt-6 flex justify-between items-center opacity-10 px-1">
              <TechnicalIndicator icon={Activity} />
              <TechnicalIndicator icon={Shield} />
              <TechnicalIndicator icon={Cpu} />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-black relative">
          {/* Top Status Bar */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-12 bg-white/[0.01] z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#1DB954] animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">System_Status: READY</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Globe size={10} className="text-white/10" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Registry: LOCAL_NODE_ARCHIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
              <span className="tabular-nums">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              <span className="w-[1px] h-3 bg-white/10" />
              <span>ID: {user?.id.slice(0, 8)}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto relative no-scrollbar bg-black p-8 lg:p-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const TechnicalIndicator = ({ icon: Icon }: { icon: any }) => (
  <div className="p-2 border border-white/10">
    <Icon size={12} />
  </div>
);
