import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { Play, Pause, MoreHorizontal, BadgeCheck, Heart, Activity, Database, Zap, Cpu } from 'lucide-react';
import { SongContextMenu, useContextMenu } from '../../components/shared/SongContextMenu';
import { formatTime, cn } from '../../lib/utils';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';
import { motion, AnimatePresence } from 'framer-motion';

export const ArtistPage = () => {
  const { id } = useParams();

  const { data: artist, isLoading: loading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      const res = await api.get(`/artists/${id}`) as any;
      return res.data;
    },
    enabled: !!id,
  });

  const { setContextAndPlay, currentContextId, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { isFollowing, toggleFollow, isLiked, toggleLike } = useLibraryStore();
  const { menu: trackMenu, openMenu: openTrackMenu, closeMenu: closeTrackMenu } = useContextMenu();
  
  useInteractionTracker('ARTIST', id);

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-full bg-black p-8 lg:p-16 flex flex-col gap-12">
        <div className="h-64 bg-white/5 animate-pulse border border-white/10" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!artist) {
    return <div className="p-32 text-center font-black uppercase tracking-[0.5em] text-white/20">Architect_Profile_Not_Found</div>;
  }

  const isThisPlaying = currentContextId === id && isPlaying;
  const trackList = artist.songs.map((item: any) => ({
    id: item.song.id, title: item.song.title, artistName: item.song.artist.stageName, artistId: item.song.artistId,
    coverUrl: item.song.coverUrl, audioUrl: item.song.audioUrl320 || item.song.audioUrl128,
    canvasUrl: item.song.canvasUrl, duration: item.song.duration, hasLyrics: !!item.song.lyrics,
  }));

  const handleMainPlay = () => {
    if (trackList.length === 0) return;
    if (currentContextId === id) {
      togglePlay();
    } else {
      setContextAndPlay(trackList, 0, id);
    }
  };

  const handleTrackPlay = (index: number) => {
    if (currentContextId === id && currentTrack?.id === trackList[index].id) {
      togglePlay();
    } else {
      setContextAndPlay(trackList, index, id);
    }
  };

  return (
    <div className="flex-1 w-full min-h-full bg-black overflow-y-auto no-scrollbar relative isolate selection:bg-[#1db954] selection:text-black text-white">
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      <div className="px-8 lg:px-16 pt-24 pb-32 relative z-10 w-full max-w-screen-2xl mx-auto">
        
        {/* ── HEADER ── */}
        <motion.header 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row items-end gap-10 border-b border-white/10 pb-16"
        >
          <div className="relative group w-64 h-64 border border-white/10 rounded-full overflow-hidden bg-[#050505] shadow-[30px_30px_80px_rgba(0,0,0,0.8)] flex-shrink-0">
            <img
              src={artist.avatarUrl}
              alt={artist.stageName}
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference">
               <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.5em] whitespace-nowrap">ARCHITECT_PROFILE_V4</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
             <div className="flex items-center gap-3">
                {artist.isVerified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#1db954]/10 border border-[#1db954]/20">
                    <BadgeCheck size={12} className="text-[#1db954]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#1db954]">Verified_Architect</span>
                  </div>
                )}
                <div className="h-[1px] flex-1 bg-white/10" />
             </div>
             
             <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic truncate max-w-full">
               {artist.stageName}
             </h1>

             <div className="flex flex-wrap items-center gap-8 mt-6">
                <div className="flex flex-col gap-1">
                   <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Signal_Followers</span>
                   <span className="text-2xl font-black italic tracking-tighter">{artist.followersCount?.toLocaleString()} UNITS</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col gap-1">
                   <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Archive_Units</span>
                   <span className="text-2xl font-black italic tracking-tighter">{artist.songs.length} DATA_SETS</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col gap-1">
                   <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Status</span>
                   <span className="text-2xl font-black italic tracking-tighter text-[#1db954]">NOMINAL</span>
                </div>
             </div>
          </div>
        </motion.header>

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-8 mb-16">
          <button
            onClick={handleMainPlay}
            disabled={trackList.length === 0}
            className="group relative flex items-center gap-4 px-10 py-5 bg-[#1db954] text-black transition-all hover:bg-white overflow-hidden shadow-[10px_10px_0px_rgba(29,185,84,0.2)] disabled:opacity-20"
          >
            <div className="relative z-10 flex items-center gap-3">
               {isThisPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black" />}
               <span className="text-sm font-black uppercase tracking-widest italic">{isThisPlaying ? "Halt_Signals" : "Initiate_Signals"}</span>
            </div>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
          </button>

          <button
            onClick={() => id && toggleFollow(id, artist.stageName)}
            className={cn(
              "px-8 py-5 border text-xs font-black uppercase tracking-widest transition-all duration-500",
              isFollowing(id || '') ? "bg-white text-black border-white" : "border-white/20 text-white hover:border-white"
            )}
          >
            {isFollowing(id || '') ? 'Following_Architect' : 'Follow_Architect'}
          </button>

          <button className="p-5 border border-white/20 text-white hover:border-white transition-all">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* ── POPULAR MANIFEST ── */}
        <div className="mt-16">
           <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Popular_Signals</h2>
              <div className="h-[1px] flex-1 bg-white/5" />
           </div>

           <div className="flex flex-col gap-1 w-full lg:w-4/5">
              <div className="grid grid-cols-[40px_1fr_120px_60px] gap-6 px-6 py-4 border-b border-white/10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                <span>#_ID</span>
                <span>Sonic_Transmission</span>
                <span className="hidden md:block">Unit_Lvl</span>
                <span className="text-right">Dur.</span>
              </div>

              {artist.songs.map((item: any, index: number) => {
                const track = item.song;
                const isRowPlaying = currentContextId === id && currentTrack?.id === track.id;

                return (
                  <motion.div
                    key={item.songId}
                    onClick={() => handleTrackPlay(index)}
                    onContextMenu={(e) => openTrackMenu(e, { ...track, artistName: artist.stageName })}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "group grid grid-cols-[40px_1fr_120px_60px] gap-6 items-center px-6 py-4 border-b border-white/5 transition-all cursor-pointer relative overflow-hidden",
                      isRowPlaying ? "bg-[#1db954]/10" : "hover:bg-white text-white hover:text-black"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] font-black italic transition-colors text-center",
                      isRowPlaying ? "text-[#1db954]" : "text-white/20 group-hover:text-black/40"
                    )}>
                      {isRowPlaying ? <Activity size={12} className="animate-pulse mx-auto" /> : (index + 1).toString().padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-5 min-w-0">
                      <div className="w-10 h-10 border border-white/10 overflow-hidden flex-shrink-0 relative">
                         <img src={track.coverUrl} className={cn("w-full h-full object-cover grayscale transition-all duration-700", !isRowPlaying && "group-hover:grayscale-0 group-hover:scale-110")} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-black uppercase tracking-tighter truncate leading-none">
                          {track.title}
                        </p>
                        <p className={cn(
                          "text-[8px] font-black uppercase tracking-widest mt-1 opacity-20",
                          isRowPlaying ? "text-white" : "group-hover:text-black"
                        )}>SIG_{track.id.slice(0,8)}</p>
                      </div>
                    </div>

                    <span className={cn("hidden md:block text-[9px] font-black uppercase tracking-widest", isRowPlaying ? "text-white/40" : "text-white/20 group-hover:text-black/40")}>
                      {track.playCount.toLocaleString()} UNITS
                    </span>

                    <div className="flex items-center justify-end gap-6">
                       <button
                         onClick={(e) => { e.stopPropagation(); toggleLike(track.id, track.title); }}
                         className={cn(
                           "transition-all duration-300",
                           isLiked(track.id) ? "text-[#1db954]" : "text-white/20 group-hover:text-black/20 hover:text-[#1db954]"
                         )}
                       >
                         <Heart size={14} className={isLiked(track.id) ? "fill-[#1db954]" : ""} />
                       </button>
                       <span className={cn("text-[10px] font-black italic", isRowPlaying ? "text-[#1db954]" : "text-white/20 group-hover:text-black/40")}>{formatTime(track.duration)}</span>
                       <button
                         onClick={(e) => { e.stopPropagation(); openTrackMenu(e, { ...track, artistName: artist.stageName }); }}
                         className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                       >
                         <MoreHorizontal size={14} />
                       </button>
                    </div>

                    {/* Hover Progress Tab */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#1db954] translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  </motion.div>
                );
              })}
           </div>
        </div>

        {/* ── FOOTER STATUS ── */}
        <footer className="mt-32 pt-12 border-t border-white/10 opacity-20 flex justify-between items-center">
           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1db954]">Architect_Sync_Success</span>
              <span className="text-[7px] font-black uppercase tracking-widest text-white">RingBeat Data Centers // Cluster: Global-Primary</span>
           </div>
           <div className="flex gap-8">
              <Cpu size={14} />
              <Zap size={14} />
           </div>
        </footer>
      </div>

      {/* ── CONTEXT MENU ── */}
      {trackMenu && (
        <SongContextMenu 
          song={trackMenu.song} position={trackMenu.position} onClose={closeTrackMenu}
          onPlay={() => {
            const idx = artist.songs.findIndex((s: any) => s.song.id === trackMenu.song.id);
            if (idx !== -1) handleTrackPlay(idx);
          }}
        />
      )}
    </div>
  );
};
