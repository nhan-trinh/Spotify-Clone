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
            "transition-all hover:scale-110",
            isShuffle ? "text-[#1db954] drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" : "text-white/40 hover:text-white"
          )}
          title="Shuffle"
        >
          <Shuffle size={18} />
        </button>

        <button onClick={prevTrack} className="text-white/60 hover:text-white transition-all hover:scale-110" disabled={isDisable}>
          <SkipBack size={24} fill="currentColor" />
        </button>

        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          disabled={isDisable}
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
        </button>

        <button onClick={nextTrack} className="text-white/60 hover:text-white transition-all hover:scale-110" disabled={isDisable}>
          <SkipForward size={24} fill="currentColor" />
        </button>

        <button
          onClick={toggleRepeat}
          className={cn(
            "transition-all hover:scale-110 relative",
            repeatMode !== 'off' ? "text-[#1db954] drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" : "text-white/40 hover:text-white"
          )}
          title={`Repeat ${repeatMode}`}
          disabled={isDisable}
        >
          {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          {repeatMode !== 'off' && (
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1db954] rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
