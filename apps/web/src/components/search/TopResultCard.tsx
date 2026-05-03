import { Play, Pause, Activity, Cpu, Zap, BadgeCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../stores/player.store';
import { motion } from 'framer-motion';

interface TopResultCardProps {
  result: {
    id: string;
    title?: string;
    stageName?: string;
    coverUrl?: string;
    avatarUrl?: string;
    type: 'artist' | 'song' | 'album' | 'playlist';
    isVerified?: boolean;
    audioUrl?: string;
    artistName?: string;
    artistId?: string;
    duration?: number;
  };
}

export const TopResultCard = ({ result }: TopResultCardProps) => {
  const navigate = useNavigate();
  const { setContextAndPlay, currentContextId, isPlaying, togglePlay } = usePlayerStore();
  
  const title = result.title || result.stageName || 'Unknown';
  const imageUrl = result.coverUrl || result.avatarUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=400&h=400';
  const typeLabel = result.type.toUpperCase();

  const isThisPlaying = currentContextId === result.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.type === 'song') {
      const songData = {
        id: result.id,
        title: result.title!,
        artistName: result.artistName!,
        artistId: result.artistId!,
        coverUrl: result.coverUrl!,
        audioUrl: result.audioUrl!,
        duration: result.duration!
      };
      setContextAndPlay([songData], 0, result.id);
    } else if (currentContextId === result.id) {
      togglePlay();
    }
  };

  const handleClick = () => {
    if (result.type === 'artist') navigate(`/artist/${result.id}`);
    else if (result.type === 'album') navigate(`/album/${result.id}`);
    else if (result.type === 'playlist') navigate(`/playlist/${result.id}`);
    else if (result.type === 'song') navigate(`/track/${result.id}`);
  };

  return (
    <motion.div 
      onClick={handleClick}
      whileHover={{ scale: 0.99 }}
      className="bg-[#050505] p-8 border border-white/10 hover:bg-white transition-all duration-500 cursor-pointer group relative flex flex-col gap-8 h-full overflow-hidden"
    >
      {/* Technical Labels */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-0.5 pointer-events-none mix-blend-difference">
        <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.4em]">PRIMARY_SOURCE_REF_{result.id.slice(0, 6)}</span>
        <span className="text-[6px] font-black text-[#1db954] uppercase tracking-[0.2em]">TYPE: {typeLabel}</span>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Artwork Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
        <div className={cn(
           "w-full h-full border border-white/10 overflow-hidden bg-black relative",
           result.type === 'artist' ? "rounded-full p-2" : "rounded-none"
        )}>
          <img 
            src={imageUrl} 
            alt={title} 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              "grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
            )}
          />
        </div>
        {/* Verification Icon for Artists */}
        {result.isVerified && (
           <div className="absolute bottom-2 right-2 bg-black border border-white/10 p-1.5 z-20">
              <BadgeCheck size={14} className="text-[#1db954]" />
           </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-3 relative z-20">
        <div className="flex items-center gap-4">
           <div className="h-[2px] w-8 bg-[#1db954] transition-all group-hover:w-12 group-hover:bg-black" />
           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 group-hover:text-black/40 italic">Signal_Origin</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white group-hover:text-black uppercase tracking-tighter italic leading-[0.8] truncate max-w-full">
          {title}
        </h1>
        <div className="flex items-center gap-6 mt-2">
           <div className="flex flex-col gap-1">
              <span className="text-[7px] font-black text-white/20 group-hover:text-black/20 uppercase tracking-widest">Protocol</span>
              <span className="text-[10px] font-black text-[#1db954] group-hover:text-black uppercase tracking-widest">{typeLabel}_UNIT</span>
           </div>
           <div className="h-6 w-[1px] bg-white/10 group-hover:bg-black/10" />
           <div className="flex flex-col gap-1">
              <span className="text-[7px] font-black text-white/20 group-hover:text-black/20 uppercase tracking-widest">Status</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                isThisPlaying ? "text-[#1db954] group-hover:text-black" : "text-white/40 group-hover:text-black/40"
              )}>
                {isThisPlaying ? <Activity size={10} className="animate-pulse" /> : <div className="w-1.5 h-1.5 bg-[#1db954] rounded-full" />}
                {isThisPlaying ? 'LIVE_STREAMING' : 'IDLE_UNIT'}
              </span>
           </div>
        </div>
      </div>

      {/* Brutalist Play Block */}
      <button 
        onClick={handlePlay}
        className={cn(
          "absolute bottom-0 right-0 w-20 h-20 flex items-center justify-center bg-[#1db954] text-black transition-all duration-500 z-30 shadow-[-10px_-10px_0px_rgba(0,0,0,0.3)] group-hover:shadow-none",
          (isThisPlaying) ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0"
        )}
      >
        {isThisPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
      </button>

      {/* Background Tech Icons */}
      <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-10 transition-opacity">
         <Cpu size={16} className="text-black" />
         <Zap size={16} className="text-black" />
      </div>
    </motion.div>
  );
};
