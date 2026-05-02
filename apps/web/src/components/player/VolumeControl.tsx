import { usePlayerStore } from '../../stores/player.store';
import { Volume2, VolumeX } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

export const VolumeControl = () => {
  const { volume, setVolume } = usePlayerStore();

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    if (volume === 0) setVolume(0.5);
    else setVolume(0);
  };

  return (
    <div className="flex items-center gap-4 w-full max-w-[150px] justify-end">
      <button 
        onClick={toggleMute} 
        className="text-[#444] hover:text-white transition-all"
      >
        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-[100px] h-4 group cursor-pointer"
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
      >
        <Slider.Track className="bg-[#222] relative grow h-[3px] overflow-hidden">
          <Slider.Range className="absolute bg-white group-hover:bg-[#1db954] h-full" />
        </Slider.Track>
        <Slider.Thumb className="hidden group-hover:block w-[8px] h-[8px] bg-white outline-none" />
      </Slider.Root>
    </div>
  );
};
