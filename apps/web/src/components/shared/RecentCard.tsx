import { usePlayerStore } from '../../stores/player.store';
import { Play, Pause, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RecentCardProps {
  id: string;
  title: string;
  coverUrl: string;
  songs?: any[];
  type?: 'artist' | 'album' | 'playlist' | 'song';
}

export const RecentCard = ({ id, title, coverUrl, songs = [], type = 'playlist' }: RecentCardProps) => {
  const { setContextAndPlay, currentContextId, isPlaying, togglePlay } = usePlayerStore();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isThisPlaying = currentContextId === id && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (songs.length === 0) return;
    if (currentContextId === id) {
      togglePlay();
    } else {
      setContextAndPlay(songs, 0, id);
    }
  };

  const handleCardClick = () => {
    if (type === 'artist') {
      navigate(`/artist/${id}`);
    } else if (type === 'album') {
      navigate(`/album/${id}`);
    } else if (type === 'song') {
      if (songs.length > 0) {
        setContextAndPlay(songs, 0, id);
      } else {
        navigate(`/track/${id}`);
      }
    } else {
      navigate(`/playlist/${id}`);
    }
  };

  return (
    <motion.div 
      whileHover={{ x: 4 }}
      onClick={handleCardClick}
      className="bg-black border border-white/10 flex items-center overflow-hidden transition-all cursor-pointer group relative h-16 md:h-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index Decoration */}
      <div className="absolute top-1 left-1 z-20 mix-blend-difference pointer-events-none">
         <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">ID_{id.slice(0,4)}</span>
      </div>

      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-r border-white/10 overflow-hidden relative">
        <img 
          src={coverUrl} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isHovered ? "grayscale-0 scale-110" : "grayscale opacity-50",
            type === 'artist' ? "p-2" : "p-0"
          )} 
        />
        {isThisPlaying && (
           <div className="absolute inset-0 bg-[#1db954]/20 flex items-center justify-center">
              <Activity size={16} className="text-[#1db954] animate-pulse" />
           </div>
        )}
      </div>
      
      <div className="flex-1 px-5 flex flex-col justify-center gap-1 overflow-hidden">
        <h3 className={cn(
          "font-black uppercase tracking-tighter truncate transition-colors",
          isThisPlaying ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"
        )}>
          {title}
        </h3>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">{type}_UNIT</span>
      </div>
      
      {/* Sharp Play Button */}
      <button 
        onClick={handlePlayClick}
        className={cn(
          "w-12 h-full flex items-center justify-center bg-[#1db954] text-black transition-all duration-300",
          (isHovered || isThisPlaying) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {isThisPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
      </button>
    </motion.div>
  );
};
