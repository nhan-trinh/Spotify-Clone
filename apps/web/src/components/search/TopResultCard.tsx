import { Play, Pause } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../stores/player.store';

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
  const typeLabel = result.type === 'artist' ? 'Nghệ sĩ' : 
                    result.type === 'song' ? 'Bài hát' :
                    result.type === 'album' ? 'Album' : 'Playlist';

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
    // TODO: Fetch songs for artist/album if needed, for now just basic support
  };

  const handleClick = () => {
    if (result.type === 'artist') navigate(`/artist/${result.id}`);
    else if (result.type === 'album') navigate(`/album/${result.id}`);
    else if (result.type === 'playlist') navigate(`/playlist/${result.id}`);
    else if (result.type === 'song') navigate(`/track/${result.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-[#181818] hover:bg-[#282828] p-5 rounded-lg transition-all cursor-pointer group relative flex flex-col gap-5 h-full"
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <img 
          src={imageUrl} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
            result.type === 'artist' ? "rounded-full" : "rounded-md"
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tighter truncate">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-[#121212] text-xs font-bold text-white px-3 py-1 rounded-full uppercase tracking-wider">
            {typeLabel}
          </span>
          {result.isVerified && (
            <span className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Nút Play thần thánh */}
      <button 
        onClick={handlePlay}
        className={cn(
          "absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full bg-[#1db954] text-black shadow-2xl hover:scale-105 hover:bg-[#1ed760] transition-all duration-300",
          (isThisPlaying) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
        )}
      >
        {isThisPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
      </button>
    </div>
  );
};
