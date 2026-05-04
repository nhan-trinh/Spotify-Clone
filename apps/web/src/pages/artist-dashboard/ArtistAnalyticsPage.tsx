import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Music, TrendingUp, Users, Play, Activity, Zap, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const StatCard = ({ label, value, icon: Icon, index }: any) => (
  <div className="bg-black border border-white/10 p-8 relative group overflow-hidden">
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-[#1DB954] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
    
    <div className="relative z-10 flex flex-col gap-6">
       <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
             <span className="text-[8px] font-black text-[#1DB954] uppercase tracking-[0.4em]">{index}</span>
             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">{label}</span>
          </div>
          <Icon size={16} className="text-white/10 group-hover:text-[#1DB954] transition-colors" />
       </div>
       
       <div className="flex items-end gap-2">
          <p className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">{value}</p>
          <div className="w-2 h-2 bg-[#1DB954] mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
    </div>

    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />
  </div>
);

export const ArtistAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, songsRes] = await Promise.all([
          api.get('/artists/me/analytics') as any,
          api.get('/artists/me/songs') as any,
        ]);
        setAnalytics(analyticsRes.data);
        setSongs(songsRes.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Lỗi khi tải analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = analytics ? [
    { label: 'Total_Archive_Songs', value: analytics.totalBaseSongs || '0', icon: Music, index: 'ARG_01' },
    { label: 'Cumulative_Streams', value: analytics.totalPlays || '0', icon: Play, index: 'ARG_02' },
    { label: 'Entity_Followers', value: analytics.totalFollowers || '0', icon: Users, index: 'ARG_03' },
    { label: 'Peak_Performance', value: songs[0]?.playCount || '0', icon: TrendingUp, index: 'ARG_04' },
  ] : [];

  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col gap-6 border-b border-white/10 pb-12">
         <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#1DB954]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1DB954]">Module_Analytics_v4.2</span>
         </div>
         <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter italic leading-[0.8]">
            Dashboard_Overview
         </h1>
         <p className="max-w-xl text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">
            Visualizing telemetry data across primary broadcast nodes. Statistical integrity verified for current session.
         </p>
      </header>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 h-40 animate-pulse" />
          ))
        ) : (
          stats.map((stat) => <StatCard key={stat.label} {...stat} />)
        )}
      </div>

      {/* ── SONG LIST MANIFEST ── */}
      <section>
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[10px] font-black text-[#1DB954]">01</span>
           <h2 className="text-2xl font-black uppercase tracking-tighter italic">Signal_Archive_Manifest</h2>
           <div className="flex-1 h-[1px] bg-white/5" />
           <Activity size={14} className="text-white/20" />
        </div>

        <div className="border border-white/10 bg-black overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 bg-noise" />
          
          <table className="w-full text-left relative z-10 border-collapse">
            <thead>
               <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/30">#</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/30">Data_Entity</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/30">Stream_Load</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Status_Node</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="h-16 px-6 bg-white/[0.01]" />
                  </tr>
                ))
              ) : songs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No_Signals_Detected_In_Library</p>
                  </td>
                </tr>
              ) : (
                songs.map((song, i) => (
                  <tr key={song.id} className="group hover:bg-[#1DB954]/5 transition-colors">
                    <td className="px-6 py-4 text-[10px] font-black text-white/20 tabular-nums">
                       {(i + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-white/10 overflow-hidden bg-black flex-shrink-0">
                             {song.coverUrl && (
                               <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                             )}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[12px] font-black uppercase tracking-tighter text-white truncate max-w-[200px]">{song.title}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-white/20">UUID: {song.id.slice(0, 8)}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-widest tabular-nums">{song.playCount?.toLocaleString() || 0}</span>
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-[#1DB954]">Load_Units</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={cn(
                          "inline-block px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all",
                          song.status === 'APPROVED' ? 'border-[#1DB954]/20 text-[#1DB954] bg-[#1DB954]/5' :
                          song.status === 'PENDING' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5' :
                          'border-red-500/20 text-red-400 bg-red-500/5'
                       )}>
                          {song.status === 'APPROVED' ? 'SYNC_COMPLETE' : song.status === 'PENDING' ? 'SYNC_PENDING' : 'SYNC_FAILED'}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Technical Footer Indicator */}
      <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-10">
         <span className="text-[8px] font-black uppercase tracking-[0.5em]">RingBeat // Analytics_End_Session</span>
         <div className="flex gap-4">
            <Zap size={12} />
            <Activity size={12} />
         </div>
      </footer>

    </div>
  );
};