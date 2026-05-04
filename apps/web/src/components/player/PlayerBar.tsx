import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { useUIStore } from '../../stores/ui.store';
import { PlaybackControls } from './PlaybackControls';
import { VolumeControl } from './VolumeControl';
import { Heart, Mic2, ListMusic, Maximize2, PlaySquare, Zap, Activity } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export const PlayerBar = () => {
  const { currentTrack, initPlayer } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const { 
    isNowPlayingVisible, 
    toggleNowPlaying, 
    setNowPlayingVisible, 
    isQueueVisible, 
    toggleQueue, 
    isFullscreen, 
    toggleFullscreen 
  } = useUIStore();

  useEffect(() => {
    if (currentTrack) {
      setNowPlayingVisible(true);
    }
  }, [currentTrack?.id, setNowPlayingVisible]);

  useEffect(() => {
    initPlayer();
  }, [initPlayer]);

  return (
    <div className="w-full h-full flex items-center justify-between bg-black px-4 lg:px-8 border-t border-white/10 relative overflow-hidden">
      {/* ── Noise Texture Overlay ── */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 bg-noise" />

      {/* 1. Track Info (Bên trái) - Editorial Manifest */}
      <div className="flex w-[30%] min-w-[280px] items-center gap-5 z-10">
        {currentTrack && (
          <>
            <div className="relative group overflow-hidden">
              <Link to={`/track/${currentTrack.id}`} className="block relative transition-transform duration-500 shadow-[8px_8px_0px_rgba(29,185,84,0.05)]">
                <img src={currentTrack.coverUrl} alt="Cover" className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all duration-700 object-cover" />
                <div className="absolute inset-0 border border-white/10 group-hover:border-[#1DB954]/40 transition-colors" />
              </Link>
            </div>

            <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[7px] font-black text-[#1DB954] uppercase tracking-[0.2em]">Active_Signal</span>
                  <div className="w-4 h-[1px] bg-white/10" />
               </div>
              <Link
                to={`/track/${currentTrack.id}`}
                className="text-white text-[16px] font-black leading-none tracking-tighter uppercase hover:text-[#1DB954] transition-colors truncate italic"
              >
                {currentTrack.title}
              </Link>
              <Link
                to={`/artist/${currentTrack.artistId}`}
                className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1 hover:text-white transition-colors truncate"
              >
                {currentTrack.artistName}
              </Link>
            </div>

            <button
              onClick={() => currentTrack && toggleLike(currentTrack.id, currentTrack.title)}
              className={cn(
                "flex-shrink-0 ml-4 transition-all duration-300",
                isLiked(currentTrack.id) ? "text-[#1DB954]" : "text-white/10 hover:text-white"
              )}
            >
              <Heart size={16} className={isLiked(currentTrack.id) ? 'fill-[#1DB954]' : ''} />
            </button>
          </>
        )}
      </div>

      {/* 2. Playback Controls (Ở giữa) - Industrial Controller */}
      <div className="flex-1 max-w-[700px] h-full flex flex-col justify-center px-8 z-10 relative">
        <PlaybackControls />
      </div>

      {/* 3. Extra Controls (Bên phải) - System Status */}
      <div className="flex w-[30%] min-w-[320px] items-center justify-end gap-1 z-10">
        <div className="flex items-center">
          <Tooltip.Provider delayDuration={200}>
            {[
              { id: 'info', icon: <PlaySquare size={16} />, active: isNowPlayingVisible, onClick: toggleNowPlaying, label: "STREAM_INFO" },
              { id: 'queue', icon: <ListMusic size={16} />, active: isQueueVisible, onClick: toggleQueue, label: "SIGNAL_QUEUE" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "p-3 flex flex-col items-center gap-1 transition-all group",
                  item.active ? "text-[#1DB954]" : "text-white/20 hover:text-white"
                )}
              >
                {item.icon}
                <span className="text-[6px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
              </button>
            ))}

            {currentTrack?.hasLyrics && (
              <Link
                to={`/lyrics/${currentTrack.id}`}
                className={cn(
                  "p-3 flex flex-col items-center gap-1 transition-all group",
                  window.location.pathname === `/lyrics/${currentTrack.id}` ? "text-[#1db954]" : "text-white/20 hover:text-white"
                )}
              >
                <Mic2 size={16} />
                <span className="text-[6px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">LYRICS</span>
              </Link>
            )}
          </Tooltip.Provider>
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-3" />

        <div className="flex flex-col gap-1 items-end mr-4">
           <span className="text-[6px] font-black text-white/20 tracking-widest uppercase">Output_Level</span>
           <VolumeControl />
        </div>

        <button
          className={cn(
            "p-3 transition-all",
            isFullscreen ? "text-[#1DB954]" : "text-white/20 hover:text-white"
          )}
          onClick={toggleFullscreen}
        >
          <Maximize2 size={16} />
        </button>

        {/* Technical Corner Decor */}
        <div className="hidden xl:flex items-center gap-3 ml-4 opacity-10">
           <Zap size={10} />
           <Activity size={10} />
        </div>
      </div>

    </div>
  );
};
