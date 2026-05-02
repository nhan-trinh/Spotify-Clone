import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { Music2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { parseLRC, SyncedLyricLine } from '../../lib/lrc-parser';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';

export const LyricsPage = () => {
  const { id } = useParams();
  const [parsedLyrics, setParsedLyrics] = useState<SyncedLyricLine[]>([]);
  const { currentTrack, progress, isPlaying, setContextAndPlay, togglePlay } = usePlayerStore();
  const activeLyricRef = useRef<HTMLParagraphElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useInteractionTracker('SONG', id);

  const { data: song, isLoading } = useQuery({
    queryKey: ['lyrics', id],
    queryFn: async () => {
      const res = await api.get(`/songs/${id}`) as any;
      return res.data;
    }
  });

  useEffect(() => {
    if (!song) return;
    if (song.lyrics) {
      setParsedLyrics(parseLRC(song.lyrics));
    } else {
      setParsedLyrics([]);
    }
  }, [song]);

  const isCurrentPlaying = currentTrack?.id === song?.id;
  const isActivePlaying = isCurrentPlaying && isPlaying;

  // Tính toán activeIndex chính xác hơn
  const activeIndex = parsedLyrics.findLastIndex(line => progress >= line.time);

  useEffect(() => {
    if (activeIndex !== -1 && activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const handlePlay = () => {
    if (currentTrack?.id === song?.id) {
      togglePlay();
    } else if (song) {
      const track = {
        id: song.id, title: song.title,
        artistName: song.artist.stageName, artistId: song.artistId,
        coverUrl: song.coverUrl, audioUrl: song.audioUrl320 || song.audioUrl128,
        canvasUrl: song.canvasUrl, duration: song.duration, hasLyrics: !!song.lyrics
      };
      setContextAndPlay([track], 0, `track:${song.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-black overflow-hidden animate-pulse">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-6">
          <div className="w-3/4 h-16 bg-white/5 rounded-none opacity-20" />
          <div className="w-full h-20 bg-white/5 rounded-none opacity-40" />
          <div className="w-2/3 h-16 bg-white/5 rounded-none opacity-20" />
        </div>
      </div>
    );
  }

  if (!song) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest">Signal Lost // 404</div>;

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden isolate bg-black group/lyrics selection:bg-[#1db954] selection:text-black">
      {/* 1. Texture Layer (Grain) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 2. Giant Background Typography (Asymmetric) - Consistent with TrackPage */}
      <div className="fixed -right-20 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center rotate-90 whitespace-nowrap z-0">
        <span className="text-[280px] font-black text-white/[0.02] tracking-tighter uppercase leading-none">
          {song.title}
        </span>
      </div>

      {/* 3. Floating Technical Metadata */}
      <div className="absolute inset-0 pointer-events-none z-10 p-12 hidden lg:block">
         <div className="h-full w-full border-2 border-white/5 relative">
            <div className="absolute top-0 left-0 -translate-y-full pb-4">
               <span className="text-[10px] font-black text-[#1db954] uppercase tracking-[0.4em]">Deciphering Stream // 4.0</span>
            </div>
            <div className="absolute bottom-0 right-0 translate-y-full pt-4">
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">RingBeat Signal Archive</span>
            </div>
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#1db954]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#1db954]" />
         </div>
      </div>

      {/* 3. Header: Asymmetric Industrial Layout */}
      <div className="absolute top-0 left-0 w-full px-12 py-10 z-30 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="w-20 h-20 rounded-none overflow-hidden border-2 border-white/10 shadow-[20px_20px_0px_rgba(29,185,84,0.05)]">
            <img src={song.coverUrl} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[1s]" alt="Cover" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-2">{song.title}</h2>
            <div className="flex items-center gap-4">
               <div className="w-8 h-[2px] bg-[#1db954]" />
               <p className="text-[#666] text-sm font-black uppercase tracking-[0.3em]">{song.artist.stageName}</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] mb-1">Status: Transmitting</span>
           <span className="text-[14px] font-black text-[#1db954] uppercase tracking-tighter italic">LRC_DECODER_ACTIVE</span>
        </div>
      </div>

      {/* 4. Lyrics Container: Kinetic Typography */}
      <div className="flex-1 w-full flex flex-col items-center justify-start z-20 overflow-hidden">
        {parsedLyrics.length > 0 ? (
          <div
            ref={lyricsContainerRef}
            className="w-full max-w-5xl h-full overflow-y-auto text-left space-y-12 md:space-y-16 px-12 md:px-24 py-[40vh] relative scroll-smooth no-scrollbar"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            }}
          >
            {parsedLyrics.map((line, index) => {
              const isActive = index === activeIndex;
              const isPassed = index < activeIndex;

              return (
                <div key={index} className="relative group/line">
                   <motion.div 
                     initial={false}
                     animate={isActive ? { width: '100%' } : { width: '0%' }}
                     className="absolute -top-4 left-0 h-[1px] bg-white/10"
                   />
                   <p
                     ref={isActive ? activeLyricRef : null}
                     className={cn(
                       "text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter transition-all duration-700 relative",
                       isActive
                         ? "text-white opacity-100 translate-x-4 skew-x-[-2deg]"
                         : isPassed
                           ? "text-white/20 opacity-20 -translate-x-2 grayscale"
                           : "text-white/10 opacity-10 group-hover/line:opacity-40 transition-opacity cursor-pointer"
                     )}
                     onClick={() => {
                       if (isCurrentPlaying) {
                         usePlayerStore.getState().seek(line.time);
                       } else {
                         handlePlay();
                       }
                     }}
                   >
                     {/* Industrial Scanline for active line */}
                     {isActive && (
                        <motion.span 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1db954]/20 to-transparent -skew-x-12 z-0"
                        />
                     )}
                     <span className="relative z-10">{line.text || '---'}</span>
                   </p>
                   {isActive && (
                      <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-[10px] font-black text-[#1db954] rotate-90 whitespace-nowrap tracking-widest animate-pulse">
                         SYNC_ACTIVE
                      </div>
                   )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-12">
               <Music2 size={128} className="text-white/5 animate-spin-slow" strokeWidth={0.5} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-[2px] bg-[#1db954] rotate-45" />
               </div>
            </div>
            <p className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">No Signal // Data Missing</p>
            <p className="text-[10px] font-black text-[#666] uppercase tracking-[0.5em]">LRC content not found in primary archives</p>
          </div>
        )}
      </div>

      {/* 5. Bottom Navigation Strip (Industrial) */}
      <div className="absolute bottom-0 left-0 right-0 p-12 flex items-center justify-between pointer-events-none z-30">
          <div className="flex items-center gap-6 pointer-events-auto">
             <div className="w-12 h-12 border-2 border-white/10 flex items-center justify-center group-hover/lyrics:border-[#1db954] transition-colors cursor-pointer" onClick={handlePlay}>
                <div className={cn("w-3 h-3 bg-white", isActivePlaying && "animate-pulse bg-[#1db954]")} />
             </div>
             <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Synchronized // Real-time Decoder</span>
          </div>
          <div className="flex flex-col items-end opacity-20">
             <span className="text-[18px] font-black italic">LYR_v4</span>
             <span className="text-[7px] font-black uppercase tracking-[0.2em]">High Fidelity Lyrics System</span>
          </div>
      </div>
    </div>
  );
};
