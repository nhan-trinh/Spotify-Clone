import { useEffect, useRef } from 'react';
import { Plus, Heart, ArrowUpDown, SortAsc, Clock, Calendar, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';

export type SortMode = 'recent' | 'name' | 'oldest';

interface LibraryContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onCreatePlaylist: () => void;
  onCreateFromLiked: () => void;
  onSort: (mode: SortMode) => void;
  currentSort: SortMode;
}

const IconClock = (props: LucideProps) => <Clock {...props} />;
const IconSortAsc = (props: LucideProps) => <SortAsc {...props} />;
const IconCalendar = (props: LucideProps) => <Calendar {...props} />;

const SORT_OPTIONS: { label: string; mode: SortMode; Icon: React.FC<LucideProps>; index: string }[] = [
  { label: 'Gần đây nhất', mode: 'recent',  Icon: IconClock, index: 'REC' },
  { label: 'Theo tên (A-Z)', mode: 'name',  Icon: IconSortAsc, index: 'A-Z' },
  { label: 'Cũ nhất trước', mode: 'oldest', Icon: IconCalendar, index: 'OLD' },
];

export const LibraryContextMenu = ({
  position, onClose, onCreatePlaylist, onCreateFromLiked, onSort, currentSort,
}: LibraryContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const vvWidth  = window.visualViewport?.width  ?? window.innerWidth;
  const vvHeight = window.visualViewport?.height ?? window.innerHeight;
  const menuHeight = ref.current?.offsetHeight ?? 280;
  const menuWidth  = ref.current?.offsetWidth  ?? 240;

  const adjustedX = Math.min(position.x, vvWidth  - menuWidth  - 16);
  const adjustedY = Math.min(position.y, vvHeight - menuHeight - 16);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      ref={ref}
      style={{ left: Math.max(16, adjustedX), top: Math.max(16, adjustedY) }}
      className="fixed z-[9999] w-60 bg-black border border-white/20 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] overflow-hidden isolate"
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
           <span className="text-[9px] font-black text-[#1db954] uppercase tracking-[0.4em]">Context_Module</span>
           <div className="w-1.5 h-1.5 bg-[#1db954]" />
        </div>

        {/* Action Set */}
        <div className="py-2">
           <div className="px-4 py-1">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Action_Set</span>
           </div>
           <button
             onClick={() => { onCreatePlaylist(); onClose(); }}
             className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1db954] hover:text-black transition-all group/item"
           >
             <div className="flex items-center gap-3">
                <Plus size={14} className="text-[#1db954] group-hover/item:text-black" />
                <span className="text-[11px] font-black uppercase tracking-widest">New Playlist</span>
             </div>
             <span className="text-[8px] font-black opacity-20 group-hover/item:opacity-100">01</span>
           </button>
           <button
             onClick={() => { onCreateFromLiked(); onClose(); }}
             className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1db954] hover:text-black transition-all group/item"
           >
             <div className="flex items-center gap-3">
                <Heart size={14} className="text-[#1db954] group-hover/item:text-black" />
                <span className="text-[11px] font-black uppercase tracking-widest">From Liked</span>
             </div>
             <span className="text-[8px] font-black opacity-20 group-hover/item:opacity-100">02</span>
           </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Sort Order */}
        <div className="py-2 bg-white/[0.02]">
           <div className="px-4 py-1 flex items-center gap-2">
              <ArrowUpDown size={10} className="text-white/30" />
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Sort_Parameter</span>
           </div>
           {SORT_OPTIONS.map(({ mode, label, Icon, index }) => {
             const isActive = currentSort === mode;
             return (
               <button
                 key={mode}
                 onClick={() => { onSort(mode); onClose(); }}
                 className={`w-full flex items-center justify-between px-4 py-2.5 transition-all group/sort ${
                   isActive ? 'bg-white/5 text-[#1db954]' : 'hover:bg-white/10 text-white/70'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <Icon size={12} className={isActive ? 'text-[#1db954]' : 'opacity-40 group-hover/sort:opacity-100'} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
                 </div>
                 <span className={`text-[8px] font-black italic ${isActive ? 'text-[#1db954]' : 'opacity-20'}`}>
                    {index}
                 </span>
               </button>
             );
           })}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2 bg-black border-t border-white/10 flex items-center justify-between">
           <span className="text-[7px] font-black text-white/10 uppercase tracking-widest italic">Core_Archive_v4</span>
           <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/10" />
              <div className="w-1 h-1 bg-white/10" />
              <div className="w-1 h-1 bg-white/20" />
           </div>
        </div>
      </div>
    </motion.div>
  );
};
