import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { Heart, Mic2, Activity, Calendar, Radio, Headphones, Zap, Globe, Cpu, Shield, Share2, MoreHorizontal, Info, Terminal, Play, BadgeCheck, Pause, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';
import { SongContextMenu, useContextMenu } from '../../components/shared/SongContextMenu';

// ─── Decoration Components ──────────────────────────────────────────────────
const Crosshair = ({ className }: { className?: string }) => (
  <div className={`absolute w-4 h-4 text-[#1db954]/20 pointer-events-none ${className}`}>
    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current" />
    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current" />
  </div>
);

const TechnicalIndicator = ({ label, index }: { label: string; index: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[6px] font-black text-[#1db954]">{index}</span>
    <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20">{label}</span>
  </div>
);

const LedStatus = ({ active, color = "#1db954" }: { active?: boolean; color?: string }) => (
  <div className="flex items-center gap-1.5">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full transition-all duration-300",
        active ? "shadow-[0_0_8px_rgba(29,185,84,0.8)]" : "bg-white/5 shadow-none"
      )}
      style={{ backgroundColor: active ? color : undefined }}
    />
    <span className={cn("text-[6px] font-black uppercase tracking-widest", active ? "text-white" : "text-white/10")}>
      {active ? "Active" : "Standby"}
    </span>
  </div>
);

export const TrackPage = () => {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  // Parallax effects
  const watermarkX = useTransform(scrollY, [0, 1000], [0, -200]);

  const { setContextAndPlay, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const { menu: trackMenu, openMenu: openTrackMenu, closeMenu: closeTrackMenu } = useContextMenu();

  useInteractionTracker('SONG', id);

  const { data: song, isLoading: loading } = useQuery({
    queryKey: ['track', id],
    queryFn: async () => {
      const res = await api.get(`/songs/${id}`) as any;
      return res.data;
    }
  });

  const { data: topSongs } = useQuery({
    queryKey: ['top-songs-rank'],
    queryFn: async () => {
      const res = await api.get('/search?q=top-songs&limit=50') as any;
      return res.data.songs || [];
    }
  });

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-full bg-black p-8 lg:p-16 flex flex-col gap-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#1db954_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="h-96 bg-white/5 animate-pulse border border-white/10" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-white/5 animate-pulse border border-white/10" />
          <div className="h-32 bg-white/5 animate-pulse border border-white/10" />
        </div>
      </div>
    );
  }

  if (!song) return null;

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
      id: song.id, title: song.title, artistName: song.artist.stageName, artistId: song.artistId,
      coverUrl: song.coverUrl, audioUrl: song.audioUrl320 || song.audioUrl128,
      canvasUrl: song.canvasUrl, duration: song.duration, hasLyrics: !!song.lyrics,
    }], 0, song.id);
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M+';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K+';
    return count.toString();
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full min-h-full bg-black text-white flex flex-col relative overflow-y-auto overflow-x-hidden group/page selection:bg-[#1db954] selection:text-black no-scrollbar"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 bg-[radial-gradient(#1db954_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      {/* Giant Background Watermark (Kinetic Parallax) */}
      <motion.div
        style={{ x: watermarkX }}
        className="fixed -left-40 bottom-1/4 select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap z-0"
      >
        <span className="text-[clamp(120px,20vw,240px)] font-black text-white/[0.015] tracking-tighter uppercase leading-none italic">
          {song.title} // {song.title}
        </span>
      </motion.div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* ── LEFT COLUMN: PRIMARY IDENTITY ── */}
        <div className="w-full lg:w-[45%] border-r border-white/10 p-8 lg:p-16 flex flex-col relative">
          <Crosshair className="top-8 left-8" />
          <Crosshair className="bottom-8 right-8" />

          <div className="flex-1 flex flex-col">
            <div className="flex flex-col gap-12">
              <header className="flex items-center justify-between pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Zap size={12} className="text-[#1db954]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">Core_Signal_v4</span>
                  </div>
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] italic">Registry_Point: {song.id.slice(0, 12)}</span>
                </div>
                <div className="text-4xl font-black italic text-white/5 tabular-nums">
                  {rankDisplay}
                </div>
              </header>

              {/* Cover Art with Glitch Overlay */}
              <div className="relative w-full max-w-[420px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square border border-white/10 group/cover overflow-hidden bg-[#050505] shadow-[30px_30px_60px_rgba(0,0,0,0.6)]"
                >
                  <img
                    src={song.coverUrl}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-[2s]",
                      isActivePlaying ? "scale-100 grayscale-0" : "scale-110 grayscale group-hover/cover:grayscale-0"
                    )}
                    alt=""
                  />

                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-scanline" />

                  {/* Mechanical Ring Decor */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-6 border border-white/5 rounded-full pointer-events-none group-hover/cover:border-[#1db954]/20 transition-colors duration-1000"
                  />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 p-3 border-t-2 border-l-2 border-[#1db954]/40" />
                  <div className="absolute bottom-0 right-0 p-3 border-b-2 border-r-2 border-[#1db954]/40" />

                  {/* Interaction Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-all duration-500 backdrop-blur-sm cursor-pointer"
                    onClick={handlePlay}
                  >
                    <div className="w-20 h-20 border-2 border-white flex items-center justify-center group/playbtn">
                      {isActivePlaying ? (
                        <div className="flex gap-1.5 items-end h-8">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [12, 32, 16] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1.5 bg-white"
                            />
                          ))}
                        </div>
                      ) : (
                        <Headphones size={32} className="text-white group-hover/playbtn:scale-110 transition-transform" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Spectrum Decor */}
                <div className="absolute -bottom-4 -left-4 -right-4 h-[1px] bg-white/10 flex items-center justify-center gap-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-[1px] h-2 bg-white/20" />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Artist Block - Pushed down a bit or kept near cover */}
            <div className="space-y-8 mt-12">
              <div className="flex flex-col gap-4">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tighter italic text-white"
                >
                  {song.title}
                </motion.h1>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-[#1db954] uppercase tracking-[0.4em]">AUTH_NODE:</span>
                  <Link to={`/artist/${song.artistId}`} className="text-xl lg:text-2xl font-black text-white/40 uppercase tracking-widest hover:text-[#1db954] transition-all italic underline-offset-8 decoration-2 decoration-[#1db954]/20 hover:decoration-[#1db954]">
                    {song.artist.stageName}
                  </Link>
                </div>
              </div>

              <p className="max-w-md text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed italic">
                All audio transmissions are synchronized across the global RingBeat broadcast network. Data manifest verified at {new Date(song.createdAt).getFullYear()} cycle.
              </p>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="mt-12 pt-10 border-t border-white/10 flex justify-between items-end">
            <div className="space-y-4">
              <TechnicalIndicator label="Stream_Index" index="01" />
              <div className="flex flex-col">
                <span className="text-[28px] font-black text-white tabular-nums leading-none tracking-tighter">
                  {formatPlayCount(song.playCount || 0)}
                </span>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Verified_Playbacks</span>
              </div>
            </div>
            <div className="flex gap-6 opacity-20">
              <Shield size={14} />
              <Globe size={14} />
              <Cpu size={14} />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TECHNICAL MANIFEST ── */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col gap-20 bg-white/[0.01]">

          {/* ── MECHANICAL ACTION DASHBOARD ── */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[7px] font-black text-[#1db954] uppercase tracking-widest leading-none">Transmission_Control</span>
                  <LedStatus active={isActivePlaying} />
                </div>
              </div>
              <div className="flex gap-2 items-center opacity-40">
                <Terminal size={10} />
                <span className="text-[6px] font-black uppercase tracking-[0.3em]">Core_Engine: v4.2.8</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* UNIT 01: PRIMARY PLAYBACK ENGINE */}
              <div className="md:col-span-8 group/unit relative">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-3 opacity-30 group-hover/unit:opacity-100 transition-opacity">
                    <span className="text-[6px] font-black text-white px-1 border border-white/20">MOD_01</span>
                    <span className="text-[7px] font-black uppercase tracking-[0.3em]">Playback_Protocol_v4</span>
                  </div>
                  <span className="text-[6px] font-black text-white/10 uppercase tracking-widest">ID: PB_E_99</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlay}
                  className={cn(
                    "w-full h-36 flex items-center justify-center transition-all duration-500 relative overflow-hidden border border-white/5 bg-white/[0.01] shadow-[10px_10px_30px_rgba(0,0,0,0.5)]",
                    isActivePlaying ? "bg-white text-black border-white" : "bg-[#1db954] text-black hover:bg-white"
                  )}
                >
                  {/* Mechanical Corner Ornaments */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/10" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/10" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isActivePlaying ? 'halt' : 'init'}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-8 relative z-10"
                    >
                      {isActivePlaying ? (
                        <Pause size={36} className="fill-current" />
                      ) : (
                        <Play size={36} className="fill-current" />
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                          {isActivePlaying ? "Terminate_Stream" : "Initiate_Protocol"}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 mt-1">Ready_for_Transmission</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Industrial Scanning bar */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />
                </motion.button>
              </div>

              {/* UNIT 02: INTERACTION HUB */}
              <div className="md:col-span-4 flex flex-col group/unit">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-3 opacity-30 group-hover/unit:opacity-100 transition-opacity">
                    <span className="text-[6px] font-black text-white px-1 border border-white/20">MOD_02</span>
                    <span className="text-[7px] font-black uppercase tracking-[0.3em]">Interaction_Node</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 h-36">
                  <button
                    onClick={() => toggleLike(song.id, song.title)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 border border-white/5 transition-all hover:border-[#1db954]/40 bg-white/[0.01] group/btn shadow-[10px_10px_30px_rgba(0,0,0,0.5)]",
                      isLiked(song.id) ? "bg-[#1db954]/10 text-[#1db954] border-[#1db954]/30" : "text-white/20 hover:text-white"
                    )}
                  >
                    <Heart size={24} className={cn("transition-transform group-hover/btn:scale-110", isLiked(song.id) && "fill-current")} />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em]">Storage_Unit</span>
                  </button>
                  <button
                    onClick={(e) => openTrackMenu(e, { ...song, artistName: song.artist?.stageName })}
                    className="flex flex-col items-center justify-center gap-3 border border-white/5 text-white/20 hover:text-white hover:border-white/20 bg-white/[0.01] transition-all group/btn shadow-[10px_10px_30px_rgba(0,0,0,0.5)]"
                  >
                    <MoreHorizontal size={24} className="transition-transform group-hover/btn:scale-110" />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em]">Options_Set</span>
                  </button>
                </div>
              </div>

              {/* UNIT 03: TELEMETRY DATA MANIFEST */}
              <div className="md:col-span-12 group/unit">
                <div className="flex items-center gap-3 mb-3 px-1 opacity-30 group-hover/unit:opacity-100 transition-opacity">
                  <span className="text-[6px] font-black text-white px-1 border border-white/20">MOD_03</span>
                  <span className="text-[7px] font-black uppercase tracking-[0.3em]">Telemetry_Data_Manifest</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Signal_Type', value: 'PCM_MASTER', color: 'text-[#1db954]', icon: Zap, index: '01' },
                    { label: 'Unit_Length', value: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`, icon: Info, index: '02' },
                    { label: 'Broadcast', value: 'DISTRIBUTE', icon: Share2, index: '03' },
                    { label: 'Registry', value: `IDX_${song.id.slice(0, 4)}`, icon: Database, index: '04' },
                  ].map((item, i) => (
                    <div key={i} className="group/data relative overflow-hidden border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-default shadow-[5px_5px_15px_rgba(0,0,0,0.3)] min-h-[100px] flex flex-col">
                      {/* Technical Header Strip */}
                      <div className="flex items-center justify-between p-3 border-b border-white/[0.03]">
                        <div className="flex items-center gap-2">
                          <span className="text-[5px] font-black text-[#1db954]">{item.index}</span>
                          <span className="text-[6px] font-black text-white/20 uppercase tracking-[0.2em]">{item.label}</span>
                        </div>
                        <item.icon size={8} className="text-white/10 group-hover/data:text-[#1db954] transition-colors" />
                      </div>

                      {/* Centered Value */}
                      <div className="flex-1 flex items-center justify-center p-4">
                        <span className={cn("text-base font-black italic tracking-tighter uppercase leading-none", item.color || "text-white")}>
                          {item.value}
                        </span>
                      </div>

                      {/* Mechanical corner decor */}
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-white/10 group-hover/data:border-[#1db954]/40 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Technical Specs Grid */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[8px] font-black text-[#1db954] uppercase tracking-widest px-2 py-1 border border-[#1db954]/20">MANIFEST_INDEX: 02</span>
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Technical_Readout</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { label: 'Signal Quality', value: 'Lossless / 24-bit', icon: Activity, index: 'S_01' },
                { label: 'Transmission', value: '192.0 kHz Sample', icon: Radio, index: 'T_02' },
                { label: 'Creation Cycle', value: new Date(song.createdAt).toLocaleDateString('vi-VN'), icon: Calendar, index: 'C_03' },
                { label: 'Spectrum Genre', value: song.genre?.name || 'Unknown', icon: Mic2, index: 'G_04' },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-black hover:bg-white/[0.02] transition-all group/stat relative">
                  <div className="flex items-center justify-between mb-8">
                    <item.icon size={16} className="text-[#1db954] opacity-20 group-hover/stat:opacity-100 transition-opacity" />
                    <span className="text-[8px] font-black text-white/10">{item.index}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">{item.label}</span>
                    <span className="text-xl font-black text-white uppercase tracking-tight italic">{item.value}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1db954] group-hover/stat:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </section>

          {/* Creator Node */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[8px] font-black text-[#1db954] uppercase tracking-widest px-2 py-1 border border-[#1db954]/20">MANIFEST_INDEX: 03</span>
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Creative_Entity</h3>
            </div>

            <Link to={`/artist/${song.artistId}`} className="group/artist block relative border border-white/5 bg-black p-8 hover:bg-white/[0.01] transition-all overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] text-[150px] font-black text-white/[0.02] italic pointer-events-none select-none">NODE</div>

              <div className="flex flex-col md:flex-row gap-10 relative z-10">
                <div className="w-full md:w-48 aspect-square border border-white/10 overflow-hidden relative shadow-[20px_20px_40px_rgba(0,0,0,0.5)]">
                  <img
                    src={song.artist.avatarUrl || song.coverUrl}
                    className="w-full h-full object-cover grayscale group-hover/artist:grayscale-0 transition-all duration-[2s] group-hover/artist:scale-105"
                    alt=""
                  />
                  <div className="absolute inset-0 opacity-10 bg-noise" />
                  <div className="absolute inset-0 border border-white/5 group-hover/artist:border-[#1db954]/40 transition-colors" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic transition-all group-hover/artist:text-[#1db954]">{song.artist.stageName}</h4>
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <BadgeCheck size={12} className="text-white" />
                      </div>
                    </div>
                    <p className="text-[11px] text-white/40 font-black uppercase tracking-tight leading-relaxed italic line-clamp-3 max-w-md">
                      {song.artist.bio || "Primary creative entity within the RingBeat network. No further telemetry available for this node."}
                    </p>
                  </div>

                  <div className="flex gap-10 mt-8">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1db954] animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Operational</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Entity_Class</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified_Artist</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* System Footer Strip */}
          <div className="mt-auto pt-10 border-t border-white/5 opacity-10">
            <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-[0.5em]">
              <span>System_Registry_Broadcast</span>
              <span>Signal_Point_STABLE_4.2.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-none z-50">
        <div className="flex items-center gap-6 pointer-events-auto opacity-20 hover:opacity-100 transition-opacity">
          <div className="w-12 h-[1px] bg-[#1db954]" />
          <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">RingBeat Signal Detected</span>
        </div>
        <span className="text-[14px] font-black text-white/5 italic">MANIFEST_TRK_v4</span>
      </div>

      {/* ── CONTEXT MENU ── */}
      {trackMenu && (
        <SongContextMenu
          song={trackMenu.song} position={trackMenu.position} onClose={closeTrackMenu}
          onPlay={() => handlePlay()}
        />
      )}
    </div>
  );
};
