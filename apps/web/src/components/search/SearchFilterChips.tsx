import { cn } from '../../lib/utils';

interface SearchFilterChipsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'songs', name: 'Bài hát' },
  { id: 'artists', name: 'Nghệ sĩ' },
  { id: 'albums', name: 'Album' },
  { id: 'playlists', name: 'Playlist' },
  { id: 'profiles', name: 'Người dùng' },
];

export const SearchFilterChips = ({ activeTab, onTabChange }: SearchFilterChipsProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
            activeTab === tab.id 
              ? "bg-white text-black" 
              : "bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]"
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};
