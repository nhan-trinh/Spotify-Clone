import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface SearchFilterChipsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'all', name: 'All_Manifests', index: '01' },
  { id: 'songs', name: 'Sonic_Units', index: '02' },
  { id: 'artists', name: 'Lead_Architects', index: '03' },
  { id: 'albums', name: 'Discography_Sets', index: '04' },
  { id: 'playlists', name: 'Archive_Streams', index: '05' },
  { id: 'profiles', name: 'User_Entities', index: '06' },
];

export const SearchFilterChips = ({ activeTab, onTabChange }: SearchFilterChipsProps) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "group relative px-6 py-2.5 transition-all duration-300 border",
            activeTab === tab.id 
              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
              : "bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white"
          )}
        >
          <div className="flex items-center gap-4 relative z-10">
             <span className={cn(
                "text-[9px] font-black italic tracking-normal transition-colors",
                activeTab === tab.id ? "text-black/40" : "text-[#1db954]"
             )}>{tab.index}</span>
             <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{tab.name}</span>
          </div>
          {activeTab === tab.id && (
            <motion.div layoutId="search-tab-glitch" className="absolute inset-0 bg-white z-0" />
          )}
        </button>
      ))}
    </div>
  );
};
