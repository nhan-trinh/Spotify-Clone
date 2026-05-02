import { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/player.store';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { formatTime, cn } from '../../lib/utils';

const TooltipWrap = ({ children, content }: { children: React.ReactNode, content: string }) => (
  <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content 
          className="bg-[#282828] text-white text-[12px] px-2 py-[6px] shadow-xl rounded font-medium z-[100]" 
          sideOffset={8}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const PlaybackControls = () => {
  const { 
    isPlaying, progress, duration, togglePlay, nextTrack, prevTrack, seek, currentTrack,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat
  } = usePlayerStore();

  const [localProgress, setLocalProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const handleValueChange = (value: number[]) => {
    setIsDragging(true);
    setLocalProgress(value[0]);
  };

  const handleValueCommit = (value: number[]) => {
    seek(value[0]);
    setIsDragging(false);
  };

  const isDisable = !currentTrack;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Nút bấm điều khiển - Geometric Minimalism */}
      <div className="flex items-center gap-8 mb-4">
        
        <button 
          onClick={toggleShuffle}
          className={cn(
            "transition-all p-1", 
            isShuffle ? "text-[#1db954]" : "text-[#444] hover:text-white"
          )} 
          disabled={isDisable}
        >
          <Shuffle size={16} />
        </button>

        <button onClick={prevTrack} className="text-[#666] hover:text-white transition-all p-1" disabled={isDisable}>
          <SkipBack size={22} className="fill-current" />
        </button>
        
        <button 
          onClick={togglePlay} 
          className={cn(
            "w-12 h-12 flex items-center justify-center bg-white text-black transition-all",
            "hover:bg-[#1db954] hover:text-black active:scale-95"
          )}
          disabled={isDisable}
        >
          {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
        </button>

        <button onClick={nextTrack} className="text-[#666] hover:text-white transition-all p-1" disabled={isDisable}>
          <SkipForward size={22} className="fill-current" />
        </button>

        <button 
          onClick={toggleRepeat}
          className={cn(
            "transition-all p-1", 
            repeatMode !== 'off' ? "text-[#1db954]" : "text-[#444] hover:text-white"
          )} 
          disabled={isDisable}
        >
          {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
        </button>

      </div>


      {/* Thanh Progress - Brutalist Line */}
      <div className="flex items-center w-full gap-4 text-[10px] font-mono font-bold tracking-tighter text-[#444]">
        <span className="min-w-[40px] text-right">{formatTime(localProgress)}</span>
        
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-4 group cursor-pointer"
          value={[localProgress]}
          max={duration || 100}
          step={1}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          disabled={isDisable}
        >
          <Slider.Track className="bg-[#222] relative grow h-[4px] overflow-hidden">
            <Slider.Range className="absolute bg-[#1db954] h-full" />
          </Slider.Track>
          <Slider.Thumb className="hidden group-hover:block w-[10px] h-[10px] bg-white outline-none" />
        </Slider.Root>

        <span className="min-w-[40px] text-left">{formatTime(duration)}</span>
      </div>
    </div>
  );
};
