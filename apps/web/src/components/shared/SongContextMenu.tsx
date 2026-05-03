import { useState, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { Heart, ListPlus, Trash2, PlayCircle, AlertTriangle, Link as LinkIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLibraryStore } from '../../stores/library.store';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { usePlayerStore, Track } from '../../stores/player.store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Song {
  id: string;
  title: string;
  artistName?: string;
  coverUrl?: string | null;
  audioUrl?: string;
  duration?: number;
}

interface SongContextMenuProps {
  song: Song;
  position: { x: number; y: number };
  onClose: () => void;
  onPlay?: () => void;
  onRemoveFromPlaylist?: () => void;
}

export const SongContextMenu = memo(({
  song,
  position,
  onClose,
  onPlay,
  onRemoveFromPlaylist,
}: SongContextMenuProps) => {
  const { isAuthenticated } = useAuthStore();
  const { isLiked, toggleLike, playlists, addSongToPlaylist, createPlaylist } = useLibraryStore();
  const { openReportModal } = useUIStore();
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const { addToManualQueue } = usePlayerStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const liked = isLiked(song.id);

  const MENU_WIDTH = 240;

  // Tính toán vị trí TỨC THÌ ngay khi render
  const adjustedX = Math.min(position.x, window.innerWidth - MENU_WIDTH - 10);
  const adjustedY = Math.min(position.y, window.innerHeight - 420);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleAddToNewPlaylist = async () => {
    if (!newPlaylistTitle.trim()) return;
    setCreatingPlaylist(true);
    const playlist = await createPlaylist(newPlaylistTitle.trim());
    if (playlist) {
      await addSongToPlaylist(playlist.id, song.id, song.title);
    }
    setCreatingPlaylist(false);
    setNewPlaylistTitle('');
    onClose();
  };

  const isNearRightEdge = position.x + MENU_WIDTH * 2 > window.innerWidth;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      ref={menuRef}
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        zIndex: 99999
      }}
      className="bg-black border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-[240px] py-0 overflow-visible isolate select-none"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      <div className="relative z-10">
        {/* Header Metadata */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/30">Target_Signal_Acquired</span>
          </div>
          <p className="text-white font-black uppercase tracking-tighter truncate text-[12px]">{song.title}</p>
          {song.artistName && <p className="text-[#1DB954] text-[8px] font-black uppercase tracking-widest truncate">{song.artistName}</p>}
        </div>

        {/* Playback Module */}
        <div className="py-2">
          {onPlay && (
            <MenuItem icon={<PlayCircle size={14} />} label="Execute_Playback" onClick={() => { onPlay(); onClose(); }} index="01" />
          )}
          <MenuItem
            icon={<ListPlus size={14} />}
            label="Append_To_Queue"
            index="02"
            onClick={() => {
              addToManualQueue(song as Track, true);
              toast.success('Signal buffered in queue');
              onClose();
            }}
          />
        </div>

        <div className="border-t border-white/10" />

        {/* Library Module */}
        <div className="py-2">
          {isAuthenticated && (
            <MenuItem
              icon={<Heart size={14} className={liked ? 'fill-[#1DB954] text-[#1DB954]' : ''} />}
              label={liked ? 'Dearchive_Signal' : 'Archive_To_Liked'}
              index="03"
              onClick={() => { toggleLike(song.id, song.title); onClose(); }}
              active={liked}
            />
          )}
          {isAuthenticated && (
            <div
              className="relative"
              onMouseEnter={() => setShowPlaylistSubmenu(true)}
              onMouseLeave={() => setShowPlaylistSubmenu(false)}
            >
              <MenuItem
                icon={<ListPlus size={14} />}
                label="Redirect_To_Archive"
                index="04"
                hasSubmenu
                submenuSide={isNearRightEdge ? 'left' : 'right'}
                onClick={() => setShowPlaylistSubmenu(v => !v)}
              />

              <AnimatePresence>
                {showPlaylistSubmenu && (
                  <motion.div
                    initial={{ opacity: 0, x: isNearRightEdge ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isNearRightEdge ? 10 : -10 }}
                    transition={{ duration: 0.1 }}
                    className={cn(
                      "absolute top-[-8px] bg-[#050505] border border-white/20 shadow-[30px_30px_80px_rgba(0,0,0,1)] w-[240px] py-0",
                      isNearRightEdge ? "right-[calc(100%-1px)]" : "left-[calc(100%-1px)]"
                    )}
                  >
                    <div className="px-5 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Select_Archive_Set</span>
                      <div className="w-1.5 h-1.5 bg-[#1DB954] rounded-full" />
                    </div>

                    <div className="p-4 border-b border-white/10 bg-white/[0.01]">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 bg-[#111] border border-white/10 text-white text-[9px] px-3 py-2 outline-none focus:border-[#1DB954] font-black uppercase tracking-tighter placeholder:text-white/10"
                          placeholder="NEW_SET_ID..."
                          value={newPlaylistTitle}
                          onChange={e => setNewPlaylistTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddToNewPlaylist(); e.stopPropagation(); }}
                          autoFocus
                        />
                        <button
                          onClick={handleAddToNewPlaylist}
                          disabled={!newPlaylistTitle.trim() || creatingPlaylist}
                          className="px-3 bg-[#1DB954] text-black text-[9px] font-black uppercase hover:bg-white transition-colors disabled:opacity-20"
                        >
                          SET
                        </button>
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                      {playlists.length === 0 ? (
                        <p className="text-[8px] font-black text-white/10 px-5 py-4 uppercase tracking-[0.3em] text-center italic">No_Archives_Located</p>
                      ) : (
                        playlists.map(p => (
                          <button
                            key={p.id}
                            onClick={() => { addSongToPlaylist(p.id, song.id, song.title); onClose(); }}
                            className="w-full text-left px-5 py-3 text-[10px] font-black text-white/40 hover:bg-white hover:text-black transition-all uppercase tracking-tighter truncate flex items-center justify-between group/archive"
                          >
                            <span>{p.title}</span>
                            <ChevronRight size={10} className="opacity-0 group-hover/archive:opacity-100 transition-opacity" />
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="border-t border-white/10" />

        {/* Global Module */}
        <div className="py-2 bg-white/[0.02]">
          <MenuItem
            icon={<LinkIcon size={14} />}
            label="Extract_Signal_Link"
            index="LNK"
            onClick={() => {
              const url = `${window.location.origin}/track/${song.id}`;
              navigator.clipboard.writeText(url);
              toast.success('Protocol link decrypted to clipboard');
              onClose();
            }}
          />
          {isAuthenticated && (
            <MenuItem
              icon={<AlertTriangle size={14} />}
              label="Flag_Archive"
              index="RPT"
              onClick={() => {
                openReportModal(song.id, 'SONG', song.title);
                onClose();
              }}
            />
          )}
          {onRemoveFromPlaylist && (
            <MenuItem
              icon={<Trash2 size={14} />}
              label="Purge_From_Manifest"
              index="DEL"
              onClick={() => { onRemoveFromPlaylist(); onClose(); }}
              danger
            />
          )}
        </div>
      </div>
    </motion.div>,
    document.body
  );
});

SongContextMenu.displayName = 'SongContextMenu';

const MenuItem = ({
  icon, label, onClick, active, danger, hasSubmenu, index, submenuSide = 'right'
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  hasSubmenu?: boolean;
  index: string;
  submenuSide?: 'left' | 'right';
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-5 py-3.5 transition-all group/item border-l-2 border-transparent",
      danger ? "text-red-500 hover:bg-red-500 hover:text-white" :
        active ? "text-[#1DB954] hover:bg-[#1DB954] hover:text-black" :
          "text-white/80 hover:bg-white hover:text-black hover:border-black"
    )}
  >
    <div className="flex items-center gap-3">
      <span className={cn("transition-colors", active ? "text-[#1DB954]" : "text-white/30 group-hover/item:text-inherit")}>
        {icon}
      </span>
      <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[8px] font-black italic opacity-20 group-hover/item:opacity-100">{index}</span>
      {hasSubmenu && (
        submenuSide === 'right' ? <ChevronRight size={10} className="opacity-40 group-hover/item:opacity-100" /> : <ChevronLeft size={10} className="opacity-40 group-hover/item:opacity-100" />
      )}
    </div>
  </button>
);

// ─── Hook useContextMenu ──────────────────────────────────────────────────────
export const useContextMenu = () => {
  const [menu, setMenu] = useState<{ song: Song; position: { x: number; y: number } } | null>(null);

  const openMenu = (e: React.MouseEvent | MouseEvent, song: Song) => {
    e.preventDefault();
    e.stopPropagation();

    requestAnimationFrame(() => {
      setMenu({ song, position: { x: (e as any).clientX, y: (e as any).clientY } });
    });
  };

  const closeMenu = () => setMenu(null);

  return { menu, openMenu, closeMenu };
};
