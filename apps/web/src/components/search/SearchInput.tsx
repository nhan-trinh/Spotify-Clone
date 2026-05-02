import { Search, X, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useRecentSearch } from '../../hooks/useRecentSearch';
import { cn } from '../../lib/utils';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addItem, removeItem, clearAll } = useRecentSearch();

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
        // Khi xóa hết query thì popup vẫn hiện nếu có recent search
        if (inputRef.current === document.activeElement) {
          setShowPopup(true);
        }
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('q', trimmed);
    navigate({ search: searchParams.toString() }, { replace: true });

    // Add to recent search (type query)
    addItem({
      id: `query-${trimmed}`,
      type: 'query',
      title: trimmed,
    });

    setShowPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-white font-bold">{part}</span>
          ) : (
            <span key={i} className="text-[#B3B3B3]">{part}</span>
          )
        )}
      </span>
    );
  };

  if (!isSearchPage) {
    return null;
  }

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
          onFocus={() => setShowPopup(true)}
          onBlur={() => setTimeout(() => setShowPopup(false), 200)}
        />
        {query && (
          <button onClick={handleClear} className="text-[#B3B3B3] hover:text-white pr-1">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestion & Recent Search Popup */}
      {showPopup && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[420px] bg-[#282828] rounded-lg shadow-[0_16px_24px_rgba(0,0,0,0.5)] z-50 p-2 border border-[#333] max-h-[520px] overflow-y-auto custom-scrollbar">

          {/* --- CASE 1: EMPTY QUERY -> SHOW RECENT SEARCHES --- */}
          {!query.trim() && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-white font-bold text-sm">Tìm kiếm gần đây</span>
                {recentSearches.length > 0 && (
                  <button onClick={(e) => { e.preventDefault(); clearAll(); }} className="text-[#B3B3B3] hover:text-white text-xs font-bold">Xóa tất cả</button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <div className="px-3 py-4 text-[#B3B3B3] text-sm italic">Bạn chưa tìm kiếm gì gần đây.</div>
              ) : (
                recentSearches.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="group flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer relative">
                    <div className="flex-1 flex items-center gap-3 overflow-hidden"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (item.type === 'query') {
                          setQuery(item.title);
                          handleSearch(item.title);
                        } else if (item.type === 'artist') {
                          navigate(`/artist/${item.id}`);
                          setShowPopup(false);
                        } else if (item.type === 'song') {
                          // Play song logic would go here if we had all the data, 
                          // but for history we might just navigate or search
                          setQuery(item.title);
                          handleSearch(item.title);
                        }
                      }}>
                      {item.type === 'query' ? (
                        <Clock className="h-5 w-5 text-[#B3B3B3] shrink-0" />
                      ) : (
                        <img src={item.coverUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3'} className={cn("w-10 h-10 object-cover shrink-0", item.type === 'artist' ? 'rounded-full' : 'rounded')} alt="" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-white text-[15px] truncate">{item.title}</span>
                        {item.subtitle && <span className="text-[#B3B3B3] text-[12px] truncate">{item.subtitle}</span>}
                      </div>
                    </div>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); removeItem(item.id, item.type); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#B3B3B3] hover:text-white transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- CASE 2: HAS QUERY -> SHOW AUTOCOMPLETE SUGGESTIONS --- */}
          {query.trim() && suggestions && (
            <div className="flex flex-col">
              {/* Text Suggestions (Search terms) */}
              {suggestions.songs?.slice(0, 3).map((song: any) => (
                <div key={`text-${song.id}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(song.title.toLowerCase());
                    handleSearch(song.title.toLowerCase());
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer group/item">
                  <Search className="h-4 w-4 text-[#B3B3B3]" />
                  <span className="text-[15px] truncate">
                    {highlightText(song.title.toLowerCase(), query.toLowerCase())}
                  </span>
                </div>
              ))}

              {(suggestions.artists?.length > 0 || suggestions.songs?.length > 0) && (
                <div className="h-[1px] bg-[#333] my-2 mx-2"></div>
              )}

              {/* Artists Suggestions */}
              {suggestions.artists?.slice(0, 2).map((artist: any) => (
                <div key={`artist-${artist.id}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(artist.stageName);
                    handleSearch(artist.stageName);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer">
                  <img src={artist.avatarUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3'} alt={artist.stageName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[15px] truncate">
                      {highlightText(artist.stageName, query)}
                    </span>
                    <span className="text-[#B3B3B3] text-[13px]">Nghệ sĩ</span>
                  </div>
                </div>
              ))}

              {/* Songs Suggestions */}
              {suggestions.songs?.map((song: any) => (
                <div key={`song-${song.id}`} onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(song.title);
                  handleSearch(song.title);
                }} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer">
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded shadow object-cover" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[15px] truncate">
                      {highlightText(song.title, query)}
                    </span>
                    <span className="text-[#B3B3B3] text-[13px] truncate">Bài hát • {song.artistName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

