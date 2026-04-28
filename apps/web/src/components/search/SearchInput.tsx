import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { usePlayerStore } from '../../stores/player.store';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setContextAndPlay } = usePlayerStore();

  const isSearchPage = location.pathname === '/search';

  const handleClear = () => {
    setQuery('');
    setSuggestions(null);
    setShowPopup(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!isSearchPage) {
      setQuery('');
      setSuggestions(null);
      setShowPopup(false);
    }
  }, [isSearchPage]);

  // Handle Fetching Suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim() !== '') {
        try {
          const res = await api.get(`/search?q=${encodeURIComponent(query)}`) as any;
          setSuggestions(res.data);
          setShowPopup(true);
        } catch (error) {
           console.error(error);
        }
      } else {
        setSuggestions(null);
        setShowPopup(false);
      }
    }, 300); // 300ms debounce cho popup
    return () => clearTimeout(handler);
  }, [query]);

  // Hàm thực hiện tìm kiếm (cập nhật URL)
  const handleSearch = (searchTerm: string) => {
    const searchParams = new URLSearchParams(location.search);
    if (searchTerm.trim() !== '') {
      searchParams.set('q', searchTerm.trim());
    } else {
      searchParams.delete('q');
    }
    navigate({ search: searchParams.toString() }, { replace: true });
    setShowPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  if (!isSearchPage) {
    return null;
  }

  const handleSuggestionClick = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative group">
      <div className="flex h-12 w-full min-w-[364px] max-w-[364px] items-center rounded-full bg-[#242424] px-3 border border-transparent hover:border-[#333] transition-colors focus-within:border-white">
        <Search className="h-5 w-5 text-[#B3B3B3] group-focus-within:text-white" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Bạn muốn nghe gì?"
          className="h-full w-full bg-transparent px-2 text-[15px] text-white placeholder-[#B3B3B3] outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(query) setShowPopup(true) }}
          onBlur={() => setTimeout(() => setShowPopup(false), 200)}
        />
        {query && (
          <button onClick={handleClear} className="text-[#B3B3B3] hover:text-white pr-1">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestion Popup */}
      {showPopup && suggestions && (suggestions.songs?.length > 0 || suggestions.artists?.length > 0) && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[400px] bg-[#242424] rounded-xl shadow-[0_16px_24px_rgba(0,0,0,0.5)] z-50 p-2 border border-[#333] max-h-[500px] overflow-y-auto custom-scrollbar">
          
          {/* Gợi ý text từ bài hát (Autocomplete text) */}
          {suggestions.songs?.slice(0, 3).map((song: any) => (
            <div key={`text-${song.id}`} 
                 onMouseDown={(e) => { 
                   e.preventDefault(); // Ngăn chặn blur input ngay lập tức
                   setQuery(song.title.toLowerCase()); 
                   handleSearch(song.title.toLowerCase()); 
                 }}
                 className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer group/item">
              <Search className="h-4 w-4 text-[#B3B3B3]" />
              <span className="text-white text-[15px] font-bold group-hover/item:underline">{song.title.toLowerCase()}</span>
            </div>
          ))}

          {/* Ngăn cách */}
          {(suggestions.artists?.length > 0 || suggestions.songs?.length > 0) && (
             <div className="h-[1px] bg-[#333] my-2 mx-2"></div>
          )}

          {/* Gợi ý Nghệ Sĩ */}
          {suggestions.artists?.slice(0, 2).map((artist: any) => (
            <Link key={`artist-${artist.id}`} to={`/artist/${artist.id}`} 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick();
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer">
              <img src={artist.avatarUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3'} alt={artist.stageName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-white text-[15px]">{artist.stageName}</span>
                <span className="text-[#B3B3B3] text-[13px]">Nghệ sĩ</span>
              </div>
            </Link>
          ))}

          {/* Gợi ý Bài Hát */}
          {suggestions.songs?.map((song: any) => (
            <div key={`song-${song.id}`} onMouseDown={(e) => {
              e.preventDefault();
              setContextAndPlay([{
                id: song.id,
                title: song.title,
                artistName: song.artistName,
                artistId: song.artistId,
                coverUrl: song.coverUrl,
                audioUrl: song.audioUrl,
                duration: song.duration
              }], 0, song.id);
              handleSuggestionClick();
            }} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer">
              <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded shadow object-cover" />
              <div className="flex flex-col">
                <span className="text-white text-[15px]">{song.title}</span>
                <span className="text-[#B3B3B3] text-[13px]">Bài hát • {song.artistName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
