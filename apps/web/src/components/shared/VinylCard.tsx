import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VinylCardProps {
  item: any;
  type: 'song' | 'album' | 'playlist';
  className?: string;
}

export const VinylCard = ({ item, type, className }: VinylCardProps) => {
  const imageUrl = item.coverUrl || 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A33BE2E/image-size/large?v=v2&px=999';
  const title = item.title;
  const subtitle = type === 'song' ? item.artistName : type === 'album' ? `Album • ${new Date(item.releaseDate || Date.now()).getFullYear()}` : 'Playlist';
  const link = type === 'song' ? `/track/${item.id}` : type === 'album' ? `/album/${item.id}` : `/playlist/${item.id}`;

  return (
    <Link to={link} className={cn("group relative flex flex-col p-4 bg-[#181818] hover:bg-[#282828] rounded-xl transition-all duration-300 overflow-hidden cursor-pointer", className)}>
      
      <div className="relative w-full aspect-square mb-4">
        {/* The Vinyl Disc (Slides out on hover) */}
        <div className="absolute inset-y-1 right-0 aspect-square rounded-full bg-[#050505] shadow-2xl flex items-center justify-center translate-x-0 group-hover:translate-x-[40%] group-hover:rotate-180 transition-all duration-700 ease-out z-0 border border-[#222]">
          {/* Vinyl grooves */}
          <div className="w-[90%] h-[90%] rounded-full border border-white/5 flex items-center justify-center">
             <div className="w-[75%] h-[75%] rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-[35%] h-[35%] rounded-full overflow-hidden bg-[#1DB954] border-2 border-black animate-spin-slow">
                   <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-90" />
                </div>
             </div>
          </div>
        </div>
        
        {/* The Sleeve (Cover) */}
        <div className="relative z-10 w-full h-full rounded-md shadow-lg overflow-hidden border border-white/5 transform group-hover:-translate-x-2 transition-transform duration-700 ease-out bg-[#121212]">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <button 
               className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center text-black translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:scale-105 hover:bg-[#1ed760]"
               onClick={(e) => {
                 // Prevent navigation when clicking play directly
                 e.preventDefault();
                 e.stopPropagation();
                 // Here you could trigger play functionality via a store
               }}
             >
               <Play size={24} fill="black" className="ml-1" />
             </button>
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-white font-bold text-base truncate">{title}</h3>
        <p className="text-[#B3B3B3] text-sm truncate mt-1">{subtitle}</p>
      </div>
    </Link>
  );
};
