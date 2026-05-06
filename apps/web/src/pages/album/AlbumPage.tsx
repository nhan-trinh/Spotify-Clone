import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { Play, Pause, Heart, MoreHorizontal, Clock, BadgeCheck, Activity, Database, Zap, Cpu, Shuffle } from 'lucide-react';
import { formatTime, cn } from '../../lib/utils';
import { SongContextMenu, useContextMenu } from '../../components/shared/SongContextMenu';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';
import { motion } from 'framer-motion';

export const AlbumPage = () => {
  const { id } = useParams();

  const { data: album, isLoading: loading } = useQuery({
    queryKey: ['album', id],
    queryFn: async () => {
      const res = await api.get(`/albums/${id}`) as any;
      return res.data;
    },
    enabled: !!id,
  });

  const { setContextAndPlay, currentContextId, currentTrack, isPlaying, togglePlay, isShuffle, toggleShuffle } = usePlayerStore();
  const { isLiked, toggleLike, isFollowingAlbum, toggleFollowAlbum } = useLibraryStore();
  const albumFollowed = id ? isFollowingAlbum(id) : false;
  const { menu: trackMenu, openMenu: openTrackMenu, closeMenu: closeTrackMenu } = useContextMenu();

  useInteractionTracker('ALBUM', id);

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

  if (!album) {
    return <div className="p-32 text-center font-black uppercase tracking-[0.5em] text-white/20">Album_Unit_Not_Found</div>;
  }

  const trackList = album.songs.map((song: any) => ({
    id: song.id, title: song.title, artistName: album.artist.stageName, artistId: album.artist.id,
    coverUrl: song.coverUrl || album.coverUrl, audioUrl: song.audioUrl320 || song.audioUrl128 || '',
    canvasUrl: song.canvasUrl, duration: song.duration, hasLyrics: !!song.lyrics,
  }));

  const isThisPlaying = currentContextId === id && isPlaying;

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

  const releaseYear = album.releaseDate ? new Date(album.releaseDate).getFullYear() : null;
  const totalDuration = album.songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  return (
    <div className="flex-1 w-full min-h-full bg-black overflow-y-auto no-scrollbar relative isolate selection:bg-[#1db954] selection:text-black text-white">
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      {/* Giant Background Label (Editorial Style) */}
      <div className="fixed -left-48 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap z-0">
        <span className="text-[220px] font-black text-white/[0.02] tracking-tighter uppercase leading-none italic">
          {album.title}
        </span>
      </div>

      <div className="px-8 lg:px-16 pt-24 pb-32 relative z-10 w-full max-w-screen-2xl mx-auto">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row items-end gap-10 border-b border-white/10 pb-16"
        >
          <div className="relative group w-64 h-64 border border-white/10 overflow-hidden bg-[#050505] shadow-[30px_30px_80px_rgba(0,0,0,0.8)]">
            <img
              src={album.coverUrl}
              alt={album.title}
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none mix-blend-difference">
              <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">RELEASE_ID_{album.id.slice(0, 6)}</span>
              <span className="text-[6px] font-black text-[#1db954] uppercase tracking-[0.2em]">ALBUM_MANIFEST_V4</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-[#1db954]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">Discography_Unit</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic truncate max-w-full">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <Link to={`/artist/${album.artist.id}`} className="flex items-center gap-2 group cursor-pointer">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                  <img src={album.artist.avatarUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#1db954] transition-colors">{album.artist.stageName}</span>
                  {album.artist.isVerified && <BadgeCheck size={12} className="text-[#1db954]" />}
                </div>
              </Link>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Database size={12} />
                <span>{album.songs.length} Tracks</span>
              </div>
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Zap size={12} />
                <span>Year: {releaseYear}</span>
              </div>
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Clock size={12} />
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-6 mb-16">
          <button
            onClick={handleMainPlay}
            disabled={trackList.length === 0}
            className="group relative flex items-center gap-4 px-10 py-5 bg-[#1db954] text-black transition-all hover:bg-white overflow-hidden shadow-[10px_10px_0px_rgba(29,185,84,0.2)] disabled:opacity-20"
          >
            <div className="relative z-10 flex items-center gap-3">
              {isThisPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black" />}
              <span className="text-sm font-black uppercase tracking-widest italic">{isThisPlaying ? "Halt_Manifest" : "Initiate_Manifest"}</span>
            </div>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-4 border transition-all duration-300 relative group/btn",
                isShuffle ? "bg-[#1db954] text-black border-[#1db954]" : "border-white/10 text-white/40 hover:border-white hover:text-white"
              )}
              title="Shuffle_Toggle"
            >
              <Shuffle size={20} className={isShuffle ? "drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" : ""} />
            </button>
          </div>

          <div className="w-[1px] h-8 bg-white/10 mx-2" />

          <button
            onClick={() => id && toggleFollowAlbum(id, album.title)}
            className={cn(
              "p-4 border transition-all duration-500",
              albumFollowed ? "bg-white text-black border-white" : "border-white/20 text-white hover:border-white"
            )}
          >
            <Heart size={24} className={albumFollowed ? "fill-black" : ""} />
          </button>

          <button className="p-4 border border-white/20 text-white hover:border-white transition-all">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* ── MANIFEST ── */}
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-[40px_1fr_120px_60px] gap-6 px-6 py-4 border-b border-white/10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
            <span>#_ID</span>
            <span>Archive_Signature</span>
            <span className="hidden md:block">Playback_Count</span>
            <span className="text-right">Dur.</span>
          </div>

          <div className="flex flex-col">
            {trackList.map((track: any, index: number) => {
              const isRowPlaying = currentContextId === id && currentTrack?.id === track.id;

              return (
                <motion.div
                  key={track.id}
                  onClick={() => handleTrackPlay(index)}
                  onContextMenu={(e) => openTrackMenu(e, { ...track, artistName: album.artist.stageName })}
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
                        "text-[8px] font-black uppercase tracking-[0.2em] mt-1 transition-colors",
                        isRowPlaying ? "text-white/40" : "text-white/10 group-hover:text-black/20"
                      )}>TRACK_UNIT_0{(index + 1).toString()}</p>
                    </div>
                  </div>

                  <span className={cn("hidden md:block text-[9px] font-black uppercase tracking-widest", isRowPlaying ? "text-white/40" : "text-white/20 group-hover:text-black/40")}>
                    {album.songs[index]?.playCount?.toLocaleString() || '0'} UNITS
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
                      onClick={(e) => { e.stopPropagation(); openTrackMenu(e, { ...track, artistName: album.artist.stageName }); }}
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
        <footer className="mt-32 pt-12 border-t border-white/10 opacity-20 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1db954]">Discography_Metadata_Service</span>
            <p className="text-[8px] font-black uppercase tracking-widest text-white mt-2 max-w-sm leading-relaxed">
              © {releaseYear} {album.artist.stageName}. ALL RIGHTS RESERVED.
              UNAUTHORIZED TRANSMISSION OF THIS SONIC UNIT IS SUBJECT TO SYSTEM OVERRIDE.
            </p>
          </div>
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Manifest_Version</span>
              <span className="text-[10px] font-black uppercase tracking-widest">ALBM_4.0_STABLE</span>
            </div>
            <div className="flex gap-4">
              <Cpu size={16} />
              <Zap size={16} />
            </div>
          </div>
        </footer>
      </div>

      {/* ── CONTEXT MENU ── */}
      {trackMenu && (
        <SongContextMenu
          song={trackMenu.song} position={trackMenu.position} onClose={closeTrackMenu}
          onPlay={() => {
            const idx = album.songs.findIndex((s: any) => s.id === trackMenu.song.id);
            if (idx !== -1) handleTrackPlay(idx);
          }}
        />
      )}
    </div>
  );
};