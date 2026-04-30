import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { FastAverageColor } from 'fast-average-color';
import { Heart, Share2, MoreHorizontal, Disc, Mic2, Activity, Calendar, Radio, Headphones, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';
import { useUIStore } from '../../stores/ui.store';

// --- Sub-components ---

const NebulaBackground = ({ color }: { color: string }) => (
  <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#060608]" />
    <motion.div
      animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0], x: [-80, 80, -80], y: [-40, 40, -40] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      className="absolute top-[-25%] left-[-15%] w-[90%] h-[90%] rounded-full blur-[140px] opacity-25"
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
    />
    <motion.div
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, -60, 0], x: [80, -80, 80], y: [40, -40, 40] }}
      transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      className="absolute bottom-[-25%] right-[-15%] w-[75%] h-[75%] rounded-full blur-[120px] opacity-15"
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
    />
    {/* Stars */}
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [1, 1.8, 1] }}
          transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, boxShadow: '0 0 6px white' }}
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
  </div>
);

const CircularVisualizer = ({ isPlaying, color }: { isPlaying: boolean; color: string }) => (
  <div className="absolute inset-[-60px] -z-10 flex items-center justify-center">
    <div className="relative w-full h-full">
      {[...Array(64)].map((_, i) => {
        // Group bars into "beats" so nearby bars move together — feels more musical
        const groupPhase = Math.floor(i / 8) * 0.25;
        const individualOffset = (i % 8) * 0.04;
        const baseDuration = 1.6 + (i % 5) * 0.3; // 1.6s – 2.8s range (slow, breath-like)
        const maxHeight = 12 + (i % 16) * 3;       // 12–57px — gentle peaks, not spiky
        return (
          <motion.div
            key={i}
            initial={{ height: 5, opacity: 0.1 }}
            animate={isPlaying ? {
              height: [5, maxHeight, 5],
              opacity: [0.2, 0.7, 0.2],
            } : { height: 4, opacity: 0.07 }}
            transition={isPlaying ? {
              repeat: Infinity,
              duration: baseDuration,
              ease: [0.45, 0, 0.55, 1],   // smooth S-curve — feels organic
              delay: groupPhase + individualOffset,
            } : { duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-1/2 left-1/2 w-[3px] rounded-full origin-bottom"
            style={{
              backgroundColor: color,
              transform: `rotate(${i * (360 / 64)}deg) translateY(-240px)`,
              boxShadow: isPlaying ? `0 0 10px ${color}88` : 'none',
            }}
          />
        );
      })}
      <motion.div
        animate={isPlaying ? { rotate: 360, opacity: 0.6 } : { opacity: 0.2 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-white/10"
      />
      <motion.div
        animate={isPlaying ? { rotate: -360, opacity: 0.35 } : { opacity: 0.1 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[20px] rounded-full border border-dotted border-white/[0.07]"
      />
    </div>
  </div>
);

// A single horizontal waveform bar row — used in the "Live Waveform" strip
const WaveformStrip = ({ isPlaying, color }: { isPlaying: boolean; color: string }) => (
  <div className="flex items-center gap-[3px] h-10">
    {[...Array(28)].map((_, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? {
          scaleY: [0.2, 0.5 + Math.random() * 0.5, 0.2],
          opacity: [0.5, 1, 0.5],
        } : { scaleY: 0.2, opacity: 0.3 }}
        transition={isPlaying ? {
          repeat: Infinity,
          duration: 0.35 + Math.random() * 0.4,
          ease: 'easeInOut',
          delay: i * 0.02,
        } : { duration: 0.5 }}
        className="w-[3px] h-full rounded-full origin-center"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

export const TrackPage = () => {
  const { id } = useParams();
  const [dominantColor, setDominantColor] = useState('#1a1a2e');
  const { setContextAndPlay, currentTrack, isPlaying } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const { isNowPlayingVisible, isQueueVisible, isFriendActivityVisible } = useUIStore();
  const isRightSidebarOpen = isNowPlayingVisible || isQueueVisible || isFriendActivityVisible;

  useInteractionTracker('SONG', id);

  const { data: song, isLoading: loading } = useQuery({
    queryKey: ['track', id],
    queryFn: async () => {
      const res = await api.get(`/songs/${id}`) as any;
      return res.data;
    }
  });

  useEffect(() => {
    if (!song?.coverUrl) return;
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = song.coverUrl + (song.coverUrl.includes('?') ? '&' : '?') + 'corsbuster=' + Date.now();
    img.onload = () => {
      try { setDominantColor(fac.getColor(img).hex); }
      catch (e) { console.error(e); }
      finally { fac.destroy(); }
    };
  }, [song]);

  const isCurrentPlaying = currentTrack?.id === song?.id;
  const isActivePlaying = isCurrentPlaying && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.id === song.id) return; // Let playerbar handle toggle
    setContextAndPlay([{
      id: song.id, title: song.title,
      artistName: song.artist.stageName, artistId: song.artistId,
      coverUrl: song.coverUrl, audioUrl: song.audioUrl320 || song.audioUrl128,
      canvasUrl: song.canvasUrl, duration: song.duration, hasLyrics: !!song.lyrics,
    }], 0, `track:${song.id}`);
  };

  if (loading) return (
    <div className="flex-1 w-full min-h-screen bg-[#060608] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <Disc size={40} className="text-white/20" />
      </motion.div>
    </div>
  );

  if (!song) return <div className="p-20 text-center text-white font-outfit">Không tìm thấy bài hát</div>;

  return (
    <div className="flex-1 w-full min-h-full bg-[#060608] text-white flex flex-col relative font-outfit overflow-x-hidden">
      <NebulaBackground color={dominantColor} />

      {/* Scrolling ghost title behind everything */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[22vw] font-display italic font-black text-white/[0.018] whitespace-nowrap leading-none"
        >
          {song.title} {song.title}
        </motion.div>
      </div>

      <div className={cn(
        'flex-1 px-6 md:px-14 py-8 pt-28 pb-40 flex flex-col items-center justify-center gap-12 mx-auto w-full z-10 transition-all duration-500',
        isRightSidebarOpen
          ? 'xl:flex-col xl:gap-10 max-w-[1000px]'
          : 'xl:flex-row xl:gap-20 max-w-[1400px]'
      )}>

        {/* ── LEFT: ARTWORK + CIRCULAR VISUALIZER ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative group shrink-0"
          onClick={handlePlay}
        >
          <CircularVisualizer isPlaying={isActivePlaying} color={dominantColor} />

          {/* Aura glow */}
          <div
            className="absolute inset-0 blur-[90px] opacity-45 animate-aura scale-125 transition-colors duration-1000"
            style={{ backgroundColor: dominantColor }}
          />

          {/* Cover image – smaller & constrained */}
          <div className={cn(
            'relative rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-float-slow transition-all duration-700 cursor-pointer',
            isRightSidebarOpen
              ? 'w-[260px] h-[260px] md:w-[300px] md:h-[300px]'
              : 'w-[260px] h-[260px] md:w-[340px] md:h-[340px] xl:w-[400px] xl:h-[400px]'
          )}>
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-[32px]" />

            {/* Hover state – subtle play indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Headphones size={24} className="text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: EDITORIAL INFO PANEL ── */}
        <div className="flex flex-col gap-10 max-w-2xl w-full">

          {/* ─ Top badge row ─ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.35em] uppercase"
              style={{ background: `${dominantColor}22`, border: `1px solid ${dominantColor}55`, color: dominantColor }}
            >
              <Radio size={10} />
              Now Listening
            </div>
            {isActivePlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Live
              </motion.div>
            )}
          </motion.div>

          {/* ─ Title block ─ */}
          <div className="relative">
            {/* Ghost number */}
            <div
              className="absolute -top-8 -left-4 text-[100px] font-black italic select-none pointer-events-none leading-none"
              style={{ color: `${dominantColor}10` }}
            >
              #01
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'font-display italic font-medium leading-[0.88] tracking-tighter text-luxury relative z-10 transition-all duration-500',
                isRightSidebarOpen ? 'text-5xl md:text-6xl' : 'text-5xl md:text-7xl xl:text-[88px]'
              )}
            >
              {song.title}
            </motion.h1>
          </div>

          {/* ─ Artist pill ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to={`/artist/${song.artistId}`}
              className="group inline-flex items-center gap-3 p-1 pr-5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 shrink-0">
                <img
                  src={song.artist.avatarUrl || song.coverUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={song.artist.stageName}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-white group-hover:underline underline-offset-2">{song.artist.stageName}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Artist</span>
              </div>
              {/* Verified */}
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-1 shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </div>
            </Link>
          </motion.div>

          {/* ─ Live Waveform ─ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold">
              <span className="flex items-center gap-2">
                <Sparkles size={10} />
                Waveform
              </span>
              <span style={{ color: isActivePlaying ? dominantColor : undefined }}>
                {isActivePlaying ? 'Playing' : 'Paused'}
              </span>
            </div>
            <WaveformStrip isPlaying={isActivePlaying} color={dominantColor} />
          </motion.div>

          {/* ─ Metadata cards ─ */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Mic2, label: 'Genre', value: song.genre?.name || 'Ambient' },
              { icon: Activity, label: 'Tempo', value: '124 BPM' },
              { icon: Calendar, label: 'Year', value: new Date(song.createdAt).getFullYear() },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.7 }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col gap-1.5 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-1.5 text-white/40 group-hover:text-white/70 transition-colors">
                  <Icon size={13} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]">{label}</span>
                </div>
                <span className="text-base font-medium text-white/90">{value}</span>
                {/* Color accent on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${dominantColor}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>

          {/* ─ Action bar ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-3"
          >
            {/* Like pill */}
            <button
              onClick={() => toggleLike(song.id, song.title)}
              className={cn(
                'relative group flex items-center gap-2.5 h-14 px-8 rounded-full border transition-all duration-500 overflow-hidden text-sm font-bold tracking-[0.15em] uppercase',
                isLiked(song.id)
                  ? 'bg-[#1db954]/15 text-[#1db954] border-[#1db954]/30'
                  : 'bg-white/[0.04] text-white/50 border-white/[0.08] hover:text-white hover:bg-white/[0.08] hover:border-white/20'
              )}
            >
              <Heart size={17} className={isLiked(song.id) ? 'fill-current' : ''} />
              <span>{isLiked(song.id) ? 'Saved' : 'Save'}</span>
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
            </button>

            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-105">
              <Share2 size={18} />
            </button>

            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-105">
              <MoreHorizontal size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#060608] to-transparent z-20 pointer-events-none" />
    </div>
  );
};
