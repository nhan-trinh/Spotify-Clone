import { useEffect, useRef } from 'react';
import { Plus, Heart, ArrowUpDown, SortAsc, Clock, Calendar, LucideProps } from 'lucide-react';

export type SortMode = 'recent' | 'name' | 'oldest';

interface LibraryContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onCreatePlaylist: () => void;
  onCreateFromLiked: () => void;
  onSort: (mode: SortMode) => void;
  currentSort: SortMode;
}

// ── Icon components instead of JSX at module level ──
const IconClock = (props: LucideProps) => <Clock {...props} />;
const IconSortAsc = (props: LucideProps) => <SortAsc {...props} />;
const IconCalendar = (props: LucideProps) => <Calendar {...props} />;

const SORT_OPTIONS: { label: string; mode: SortMode; Icon: React.FC<LucideProps> }[] = [
  { label: 'Gần đây nhất', mode: 'recent',  Icon: IconClock },
  { label: 'Theo tên (A-Z)', mode: 'name',  Icon: IconSortAsc },
  { label: 'Cũ nhất trước', mode: 'oldest', Icon: IconCalendar },
];

export const LibraryContextMenu = ({
  position, onClose, onCreatePlaylist, onCreateFromLiked, onSort, currentSort,
}: LibraryContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
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

  // ── Use visualViewport for accurate viewport on mobile (virtual keyboard) ──
  // Fall back to window dims if visualViewport not supported
  const vvWidth  = window.visualViewport?.width  ?? window.innerWidth;
  const vvHeight = window.visualViewport?.height ?? window.innerHeight;

  // ── Use actual rendered height instead of magic number 240 ──
  const menuHeight = ref.current?.offsetHeight ?? 260;
  const menuWidth  = ref.current?.offsetWidth  ?? 208;

  const adjustedX = Math.min(position.x, vvWidth  - menuWidth  - 8);
  const adjustedY = Math.min(position.y, vvHeight - menuHeight - 8);

  return (
    <div
      ref={ref}
      style={{ left: Math.max(8, adjustedX), top: Math.max(8, adjustedY) }}
      className="fixed z-[9999] w-52 bg-[#282828] rounded-md shadow-2xl border border-white/10 py-1 text-sm text-white"
    >
      {/* Create actions */}
      <button
        onClick={() => { onCreatePlaylist(); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors text-left"
      >
        <Plus size={15} className="text-[#b3b3b3]" />
        Tạo Playlist mới
      </button>
      <button
        onClick={() => { onCreateFromLiked(); onClose(); }}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors text-left"
      >
        <Heart size={15} className="text-[#b3b3b3]" />
        Tạo từ bài đã thích
      </button>

      {/* Divider */}
      <div className="my-1 border-t border-white/10" />

      {/* Sort options */}
      <div className="px-3 pt-1 pb-0.5">
        <span className="text-[11px] font-semibold text-[#b3b3b3] uppercase tracking-wider flex items-center gap-1.5">
          <ArrowUpDown size={11} /> Sắp xếp theo
        </span>
      </div>
      {SORT_OPTIONS.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          onClick={() => { onSort(mode); onClose(); }}
          className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors text-left ${
            currentSort === mode ? 'text-[#1db954]' : ''
          }`}
        >
          <Icon size={14} className={currentSort === mode ? 'text-[#1db954]' : 'text-[#b3b3b3]'} />
          {label}
          {currentSort === mode && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1db954]" />
          )}
        </button>
      ))}
    </div>
  );
};
