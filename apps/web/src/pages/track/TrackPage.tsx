import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { Heart, Disc, Mic2, Activity, Calendar, Radio, Headphones } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';

export const TrackPage = () => {
  const { id } = useParams();
  const { setContextAndPlay, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();

  useInteractionTracker('SONG', id);

  const { data: song, isLoading: loading } = useQuery({
    queryKey: ['track', id],
    queryFn: async () => {
      const res = await api.get(`/songs/${id}`) as any;
      return res.data;
    }
  });

  // Fetch top songs to determine rank
  const { data: topSongs } = useQuery({
    queryKey: ['top-songs-rank'],
    queryFn: async () => {
      const res = await api.get('/search?q=top-songs&limit=50') as any;
      return res.data.songs || [];
    }
  });

  const songRank = topSongs ? topSongs.findIndex((s: any) => s.id === id) + 1 : 0;
  const rankDisplay = songRank > 0 ? `#${songRank.toString().padStart(3, '0')}` : '#++';

  const isCurrentPlaying = currentTrack?.id === song?.id;
  const isActivePlaying = isCurrentPlaying && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.id === song.id) {
      togglePlay();
      return;
    }
    setContextAndPlay([{
      id: song.id, title: song.title,
      artistName: song.artist.stageName, artistId: song.artistId,
      coverUrl: song.coverUrl, audioUrl: song.audioUrl320 || song.audioUrl128,
      canvasUrl: song.canvasUrl, duration: song.duration, hasLyrics: !!song.lyrics,
    }], 0, `track:${song.id}`);
  };

  if (loading) return (
    <div className="flex-1 w-full min-h-screen bg-black flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <Disc size={64} className="text-[#1db954]" strokeWidth={1} />
      </motion.div>
    </div>
  );

  if (!song) return <div className="p-20 text-center text-white font-black uppercase tracking-widest">Signal Lost // 404</div>;

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M+';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K+';
    return count.toString();
  };

  return (
    <div className="flex-1 w-full min-h-full bg-black text-white flex flex-col relative overflow-x-hidden group/page selection:bg-[#1db954] selection:text-black">
      {/* 1. Texture Layer (Grain) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 2. Giant Background Typography (Asymmetric) */}
      <div className="fixed -right-20 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center rotate-90 whitespace-nowrap z-0">
        <span className="text-[280px] font-black text-white/[0.02] tracking-tighter uppercase leading-none">
          {song.title}
        </span>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
        {/* ── LEFT SECTION: ARTWORK & PRIMARY INFO ── */}
        <div className="w-full lg:w-[45%] border-r-2 border-white/10 p-8 lg:p-16 flex flex-col justify-between">
           <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between mb-20">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-[#1db954] uppercase tracking-[0.5em]">Digital Archive</span>
                  <span className="text-[9px] font-black text-[#444] uppercase tracking-[0.3em] mt-2">Ref: {song.id.slice(0, 8)} // Ver 2.4.0</span>
                </div>
                <div className="text-[32px] font-black italic text-white/5 opacity-0 group-hover/page:opacity-100 transition-opacity">
                  {rankDisplay}
                </div>
              </div>

              {/* Artwork Block */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group/cover mb-16"
              >
                <div className="relative aspect-square w-full max-w-[500px] shadow-[30px_30px_0px_rgba(29,185,84,0.05)] border-2 border-white/10 overflow-hidden">
                  <img 
                    src={song.coverUrl} 
                    className="w-full h-full object-cover grayscale group-hover/cover:grayscale-0 transition-all duration-[1.5s] scale-110 group-hover/cover:scale-100" 
                    alt="" 
                  />
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#1db954]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#1db954]" />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-all duration-500 backdrop-blur-sm cursor-pointer" onClick={handlePlay}>
                     <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform">
                        <Headphones size={40} className="text-white" strokeWidth={3} />
                     </div>
                  </div>
                </div>
              </motion.div>

              {/* Title Block */}
              <div className="space-y-6 max-w-full">
                <motion.h1 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.8, 
                    ease: [0.23, 1, 0.32, 1] 
                  }}
                  className="text-[clamp(36px,6vw,84px)] font-black uppercase leading-[1.05] tracking-tight text-white break-words line-clamp-3 selection:bg-[#1db954] selection:text-black transition-all duration-300"
                  title={song.title}
                >
                  {song.title}
                </motion.h1>
                <div className="flex items-center gap-6">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: 60 }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="h-[4px] bg-[#1db954]" 
                   />
                   <Link to={`/artist/${song.artistId}`} className="text-[16px] lg:text-[20px] font-black text-[#666] uppercase tracking-[0.2em] hover:text-[#1db954] transition-all hover:tracking-[0.3em] duration-500">
                     {song.artist.stageName}
                   </Link>
                </div>
              </div>
           </div>

           {/* Stats Footer */}
           <div className="mt-20 grid grid-cols-2 gap-8 border-t-2 border-white/10 pt-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#222] uppercase tracking-[0.4em] mb-2">Total Streams</span>
                <span className="text-[24px] font-black text-white leading-none">
                  {formatPlayCount(song.playCount || 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#222] uppercase tracking-[0.4em] mb-2">Visual Content</span>
                <span className="text-[24px] font-black text-[#1db954] leading-none uppercase">{song.canvasUrl ? 'Operational' : 'Missing'}</span>
              </div>
           </div>
        </div>

        {/* ── RIGHT SECTION: TECHNICAL SPECS & CREDITS ── */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col gap-16">
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-6">
             <button 
               onClick={handlePlay}
               className="px-12 py-5 bg-[#1db954] text-black text-[14px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
             >
               {isActivePlaying ? 'Interrupt stream' : 'Initialize Play'}
             </button>
             <button 
               onClick={() => toggleLike(song.id, song.title)}
               className={cn(
                 "p-5 border-2 transition-all",
                 isLiked(song.id) ? "border-[#1db954] text-[#1db954] bg-[#1db954]/5" : "border-white/10 text-[#444] hover:text-white hover:border-white"
               )}
             >
               <Heart size={24} className={isLiked(song.id) ? "fill-current" : ""} strokeWidth={3} />
             </button>
             <div className="flex-1 h-[2px] bg-white/5" />
          </div>

          {/* Technical Grid */}
          <section>
             <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
                Technical Specifications
                <div className="flex-1 h-[1px] bg-white/5" />
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Sample Rate', value: '192.0 kHz / 24-bit', icon: Activity },
                  { label: 'Codec', value: 'FLAC / Lossless', icon: Mic2 },
                  { label: 'Release Date', value: new Date(song.createdAt).toLocaleDateString('vi-VN'), icon: Calendar },
                  { label: 'Genre Spectrum', value: song.genre?.name || 'Unknown', icon: Radio },
                ].map((item, i) => (
                  <div key={i} className="p-8 border-2 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group/stat relative overflow-hidden">
                    <item.icon size={20} className="text-[#222] group-hover/stat:text-[#1db954] mb-6 transition-colors" />
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] font-black text-[#333] uppercase tracking-[0.3em]">{item.label}</span>
                       <span className="text-[16px] font-black text-white uppercase tracking-tight">{item.value}</span>
                    </div>
                    {/* Industrial line */}
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/5 group-hover/stat:bg-[#1db954] transition-colors" />
                  </div>
                ))}
             </div>
          </section>

          {/* Artist Profile - Brutalist Card */}
          <section>
             <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
                Creative Entity
                <div className="flex-1 h-[1px] bg-white/5" />
             </h3>
             <Link to={`/artist/${song.artistId}`} className="group/artist block">
                <div className="flex flex-col md:flex-row border-2 border-white/10 hover:border-[#1db954] transition-all overflow-hidden bg-white/[0.01]">
                   <div className="w-full md:w-[300px] aspect-square overflow-hidden border-r-2 border-white/10">
                      <img 
                        src={song.artist.avatarUrl || song.coverUrl} 
                        className="w-full h-full object-cover grayscale group-hover/artist:grayscale-0 transition-all duration-[2s] group-hover/artist:scale-105" 
                        alt="" 
                      />
                   </div>
                   <div className="flex-1 p-10 flex flex-col justify-between relative overflow-hidden">
                      {/* Background decor */}
                      <div className="absolute right-[-20px] top-[-20px] text-[120px] font-black text-white/[0.02] italic select-none">ID</div>
                      
                      <div>
                         <div className="flex items-center gap-3 mb-4">
                            <h4 className="text-[32px] font-black text-white uppercase tracking-tighter leading-none">{song.artist.stageName}</h4>
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                               <svg viewBox="0 0 24 24" className="w-2 h-2 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                            </div>
                         </div>
                         <p className="text-[12px] text-[#666] font-bold leading-relaxed uppercase tracking-tight line-clamp-3 mb-8 max-w-[500px]">
                           {song.artist.bio || "No biography data found in primary archives. This entity operates within the rhythmic spectrum of the modern era."}
                         </p>
                      </div>

                      <div className="flex items-center gap-10">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-[#222] uppercase tracking-[0.3em] mb-1">Status</span>
                            <span className="text-[12px] font-black text-[#1db954] uppercase tracking-widest italic">Operational</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-[#222] uppercase tracking-[0.3em] mb-1">Affiliation</span>
                            <span className="text-[12px] font-black text-white uppercase tracking-widest">RingBeat Network</span>
                         </div>
                      </div>
                   </div>
                </div>
             </Link>
          </section>

          {/* Credits Strip */}
          <section className="pb-32">
             <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
                Production Log
                <div className="flex-1 h-[1px] bg-white/5" />
             </h3>
             <div className="space-y-4">
                {[
                  { role: 'Primary Architect', name: song.artist.stageName },
                  { role: 'Label / Distributor', name: 'RingBeat Music Group' },
                  { role: 'Audio Mastering', name: 'Precision Labs' }
                ].map((credit, i) => (
                  <div key={i} className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group/credit">
                    <span className="text-[11px] font-black text-[#222] uppercase tracking-[0.3em] group-hover/credit:text-[#1db954]">{credit.role}</span>
                    <span className="text-[14px] font-black text-white uppercase tracking-tight">{credit.name}</span>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>

      {/* ─ BOTTOM NAVIGATION OVERLAY (Industrial) ─ */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-none z-50">
          <div className="flex items-center gap-6 pointer-events-auto">
             <div className="w-16 h-[2px] bg-white/20" />
             <span className="text-[9px] font-black text-[#222] uppercase tracking-[0.5em]">System Ready // Signal Detected</span>
          </div>
          <div className="text-[20px] font-black text-white/5 italic pointer-events-none">SYS_V4_TRK</div>
      </div>
    </div>
  );
};
