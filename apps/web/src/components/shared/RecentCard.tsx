import { usePlayerStore } from '../../stores/player.store';
import { Play, Pause } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface RecentCardProps {
  id: string;
  title: string;
  coverUrl: string;
  songs?: any[];
}

export const RecentCard = ({ id, title, coverUrl, songs = [] }: RecentCardProps) => {
  const { setQueueAndPlay, currentContextId, isPlaying, togglePlay } = usePlayerStore();
  const [isHovered, setIsHovered] = useState(false);

  const isThisPlaying = currentContextId === id && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (songs.length === 0) return;
    if (currentContextId === id) {
      togglePlay();
    } else {
      setQueueAndPlay(songs, 0, id);
    }
  };

  return (
    <div 
      data-id={id}
      className="bg-white/10 hover:bg-white/20 flex items-center rounded overflow-hidden transition-colors cursor-pointer group pr-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={coverUrl} alt={title} className="w-12 h-12 md:w-16 md:h-16 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]" />
      
      <div className="flex-1 px-4 truncate">
        <h3 className="text-white font-bold text-[15px] truncate">{title}</h3>
      </div>
      
      {/* Nút play nhỏ hơn xíu */}
      <button 
        onClick={handlePlayClick}
        className={cn(
          "w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-[#1db954] text-black shadow-xl hover:scale-105 hover:bg-[#1ed760] transition-all duration-300",
          (isHovered || isThisPlaying) ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {isThisPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
      </button>
    </div>
  );
};
