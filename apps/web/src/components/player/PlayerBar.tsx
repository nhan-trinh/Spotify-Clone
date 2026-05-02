import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { useUIStore } from '../../stores/ui.store';
import { PlaybackControls } from './PlaybackControls';
import { VolumeControl } from './VolumeControl';
import { Heart, Mic2, ListMusic, Maximize2, PlaySquare } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export const PlayerBar = () => {
  const { currentTrack, isPlaying, initPlayer } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const { isNowPlayingVisible, toggleNowPlaying, setNowPlayingVisible, isQueueVisible, toggleQueue, isFullscreen, toggleFullscreen } = useUIStore();

  // Tự động mở Sidebar khi phát nhạc mới
  useEffect(() => {
    if (currentTrack) {
      setNowPlayingVisible(true);
    }
  }, [currentTrack?.id, setNowPlayingVisible]);
  
  // Khởi tạo player khi reload (nếu đã có track trong storage)
  useEffect(() => {
    initPlayer();
  }, [initPlayer]);

  return (
    <div className="w-full h-full flex items-center justify-between bg-black">
      
      {/* 1. Track Info (Bên trái) - Editorial Style */}
      <div className="flex w-[30%] min-w-[250px] items-center gap-6 group">
        {currentTrack && (
          <>
            <div className="relative flex-shrink-0 overflow-hidden">
              <Link to={`/track/${currentTrack.id}`} className="block relative transition-transform duration-500 group-hover:scale-105 shadow-[10px_10px_0px_rgba(29,185,84,0.1)]">
                <img src={currentTrack.coverUrl} alt="Cover" className="w-14 h-14 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10 group-hover:border-[#1DB954]/50 transition-colors" />
              </Link>
            </div>
            
            <div className="flex flex-col min-w-0">
              <Link 
                to={`/track/${currentTrack.id}`} 
                className="text-white text-[18px] font-black leading-none tracking-tighter uppercase hover:text-[#1DB954] transition-colors line-clamp-1"
              >
                {currentTrack.title}
              </Link>
              <Link 
                to={`/artist/${currentTrack.artistId}`} 
                className="text-[#666] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 hover:text-white transition-colors line-clamp-1"
              >
                {currentTrack.artistName}
              </Link>
            </div>

            <button
              onClick={() => currentTrack && toggleLike(currentTrack.id, currentTrack.title)}
              className={cn(
                "flex-shrink-0 ml-4 transition-all duration-300",
                isLiked(currentTrack.id) ? "text-[#1DB954]" : "text-[#333] hover:text-white"
              )}
            >
              <Heart size={20} className={isLiked(currentTrack.id) ? 'fill-[#1DB954]' : ''} />
            </button>
          </>
        )}
      </div>

      {/* 2. Playback Controls (Ở giữa) - Swiss Minimalism */}
      <div className="flex-1 max-w-[600px] h-full flex flex-col justify-center border-x border-white/5 px-10">
        <PlaybackControls />
      </div>

      {/* 3. Extra Controls (Bên phải) - Functionalism */}
      <div className="flex w-[30%] min-w-[300px] items-center justify-end gap-2">
        <div className="flex items-center">
          <Tooltip.Provider delayDuration={200}>
            {[
              { icon: <PlaySquare size={18} />, active: isNowPlayingVisible, onClick: toggleNowPlaying, tooltip: "INFO" },
              { icon: <ListMusic size={18} />, active: isQueueVisible, onClick: toggleQueue, tooltip: "QUEUE" },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={item.onClick}
                className={cn(
                  "p-3 transition-all font-bold text-[10px] tracking-widest",
                  item.active ? "text-[#1DB954] bg-[#1DB954]/5" : "text-[#444] hover:text-white"
                )}
              >
                {item.icon}
              </button>
            ))}
            
            {currentTrack?.hasLyrics && (
              <Link 
                to={`/lyrics/${currentTrack.id}`}
                className={cn(
                  "p-3 transition-all",
                  window.location.pathname === `/lyrics/${currentTrack.id}` ? "text-[#1db954]" : "text-[#444] hover:text-white"
                )}
              >
                <Mic2 size={18} />
              </Link>
            )}
          </Tooltip.Provider>
        </div>

        <div className="w-[1px] h-8 bg-white/5 mx-2" />

        <VolumeControl />

        <button 
          className={cn(
            "p-3 transition-all",
            isFullscreen ? "text-[#1DB954]" : "text-[#444] hover:text-white"
          )} 
          onClick={toggleFullscreen}
        >
          <Maximize2 size={18} />
        </button>
      </div>

    </div>
  );
};
