import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Share2, Globe, Lock, AlertTriangle } from 'lucide-react';
import { useLibraryStore } from '../../stores/library.store';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Playlist {
  id: string;
  title: string;
  coverUrl?: string | null;
  isPublic?: boolean;
  ownerId: string;
}

interface PlaylistContextMenuProps {
  playlist: Playlist;
  position: { x: number; y: number };
  onClose: () => void;
  onRename?: () => void;
}

export const PlaylistContextMenu = ({
  playlist,
  position,
  onClose,
  onRename,
}: PlaylistContextMenuProps) => {
  const { deletePlaylist, updatePlaylist } = useLibraryStore();
  const { user } = useAuthStore();
  const { openReportModal } = useUIStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = playlist.ownerId === user?.id;

  const adjustedPos = {
    x: Math.min(position.x, window.innerWidth - 240),
    y: Math.min(position.y, window.innerHeight - 300),
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleDelete = async () => {
    if (confirm(`Sếp có chắc chắn muốn xóa playlist "${playlist.title}" không?`)) {
      await deletePlaylist(playlist.id);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      ref={menuRef}
      style={{ position: 'fixed', top: adjustedPos.y, left: adjustedPos.x, zIndex: 9999 }}
      className="bg-black border border-white/20 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] w-60 py-0 overflow-hidden isolate select-none"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      <div className="relative z-10">
        <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
           <p className="text-white font-black uppercase tracking-tighter truncate text-[11px]">{playlist.title}</p>
           <p className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-0.5">Playlist_Archive</p>
        </div>

        <div className="py-2">
           {isOwner && (
             <MenuItem 
               icon={<Edit2 size={14} />} 
               label="Rename Archive" 
               index="01"
               onClick={() => { if (onRename) onRename(); onClose(); }} 
             />
           )}
           <MenuItem 
             icon={<Share2 size={14} />} 
             label="Copy Archive Link" 
             index="LNK"
             onClick={() => { 
               navigator.clipboard.writeText(`${window.location.origin}/playlist/${playlist.id}`);
               toast.success('Link copied to clipboard');
               onClose(); 
             }} 
           />
        </div>

        <div className="border-t border-white/10" />

        <div className="py-2">
           {isOwner && (
             <MenuItem 
               icon={playlist.isPublic ? <Lock size={14} /> : <Globe size={14} />} 
               label={playlist.isPublic ? "Set Private" : "Set Public"} 
               index="MOD"
               onClick={async () => {
                 await updatePlaylist(playlist.id, { isPublic: !playlist.isPublic });
                 onClose();
               }} 
             />
           )}
           {!isOwner && user && (
             <MenuItem 
               icon={<AlertTriangle size={14} />} 
               label="Flag_Archive" 
               index="RPT"
               onClick={() => {
                 openReportModal(playlist.id, 'PLAYLIST', playlist.title);
                 onClose();
               }} 
             />
           )}
        </div>

        {isOwner && (
          <>
            <div className="border-t border-white/10" />
            <div className="py-1 bg-white/[0.01]">
               <MenuItem 
                 icon={<Trash2 size={14} />} 
                 label="Purge Archive" 
                 index="DEL"
                 onClick={handleDelete}
                 danger 
               />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const MenuItem = ({
  icon, label, onClick, danger, index
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  index: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#1db954] hover:text-black transition-all group/item ${
      danger ? 'text-red-500' : 'text-white'
    }`}
  >
    <div className="flex items-center gap-3">
       <span className={cn("transition-colors group-hover/item:text-black text-white/40")}>
          {icon}
       </span>
       <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
    <span className="text-[8px] font-black italic opacity-20 group-hover/item:opacity-100 group-hover/item:text-black">{index}</span>
  </button>
);

export const usePlaylistContextMenu = () => {
  const [menu, setMenu] = useState<{ playlist: Playlist; position: { x: number; y: number } } | null>(null);

  const openPlaylistMenu = (e: React.MouseEvent, playlist: Playlist) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ playlist, position: { x: e.clientX, y: e.clientY } });
  };

  const closePlaylistMenu = () => setMenu(null);

  return { menu, openPlaylistMenu, closePlaylistMenu };
};
