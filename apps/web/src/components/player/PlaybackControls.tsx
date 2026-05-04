import { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/player.store';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { formatTime, cn } from '../../lib/utils';

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
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {/* ── Progress Manifest ── */}
      <div className="flex items-center w-full gap-3 text-[8px] font-black tracking-[0.2em] text-white/20 uppercase">
        <span className="min-w-[40px] text-right tabular-nums">{formatTime(localProgress)}</span>

        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-3 group cursor-pointer"
          value={[localProgress]}
          max={duration || 100}
          step={1}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          disabled={isDisable}
        >
          <Slider.Track className="bg-white/5 relative grow h-[1px] overflow-hidden">
            <Slider.Range className="absolute bg-[#1db954] h-full" />
          </Slider.Track>
          <Slider.Thumb className="hidden group-hover:block w-1.5 h-1.5 bg-white outline-none rounded-none shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </Slider.Root>

        <span className="min-w-[40px] text-left tabular-nums">{formatTime(duration)}</span>
      </div>

      {/* ── Controller Keys ── */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleShuffle}
          className={cn(
            "transition-all p-2 border border-transparent",
            isShuffle ? "text-[#1db954]" : "text-white/20 hover:text-white"
          )}
          disabled={isDisable}
        >
          <Shuffle size={14} />
        </button>

        <button 
          onClick={prevTrack} 
          className="text-white/40 hover:text-white transition-all p-2" 
          disabled={isDisable}
        >
          <SkipBack size={18} className="fill-current" />
        </button>

        <button
          onClick={togglePlay}
          className={cn(
            "w-10 h-10 flex items-center justify-center bg-white text-black transition-all relative group",
            "hover:bg-[#1db954] active:translate-x-0.5 active:translate-y-0.5"
          )}
          disabled={isDisable}
        >
          {/* Shadow Block Effect */}
          <div className="absolute inset-0 border border-black/10 z-10" />
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
        </button>

        <button 
          onClick={nextTrack} 
          className="text-white/40 hover:text-white transition-all p-2" 
          disabled={isDisable}
        >
          <SkipForward size={18} className="fill-current" />
        </button>

        <button
          onClick={toggleRepeat}
          className={cn(
            "transition-all p-2",
            repeatMode !== 'off' ? "text-[#1db954]" : "text-white/20 hover:text-white"
          )}
          disabled={isDisable}
        >
          {repeatMode === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
        </button>
      </div>
    </div>
  );
};
