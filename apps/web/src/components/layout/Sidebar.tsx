import { Home, Search, Library, Plus, Heart, Music2, Loader2, Pin, PinOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLibraryStore } from '../../stores/library.store';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/auth.store';
import { PlaylistContextMenu, usePlaylistContextMenu } from '../shared/PlaylistContextMenu';
import { RenamePlaylistModal } from '../shared/RenamePlaylistModal';
import { LibraryContextMenu, SortMode } from './LibraryContextMenu';
import { usePinnedItems, PinnedItem } from '../../hooks/usePinnedItems';
import { motion, AnimatePresence } from 'framer-motion';

const asPin = (p: { id: string; title: string; coverUrl?: string | null }): PinnedItem => ({
  id: p.id, type: 'playlist', title: p.title, coverUrl: p.coverUrl,
});

export const Sidebar = ({ className }: { className?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { isHydrated, libraryVersion, playlists, createPlaylist, fetchPlaylists } = useLibraryStore();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  const { menu, openPlaylistMenu, closePlaylistMenu } = usePlaylistContextMenu();
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; playlist: any }>({ isOpen: false, playlist: null });
  const [libraryMenu, setLibraryMenu] = useState<{ x: number; y: number } | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const { pinnedItems, togglePin, isPinned } = usePinnedItems();

  const isArtist = user?.role === 'ARTIST';
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAuthenticated || !isHydrated) return;
    const fetchSidebarData = async () => {
      try {
        const res = await api.get('/users/library') as any;
        setLikedSongs(res.data?.likedSongs || []);
        setFollowedArtists(res.data?.followedArtists || []);
      } catch { }
    };
    fetchSidebarData();
  }, [isAuthenticated, isHydrated, libraryVersion]);

  const sortedPlaylists = useMemo(() => {
    const list = [...playlists];
    if (sortMode === 'name') return list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    if (sortMode === 'oldest') return list.reverse();
    return list;
  }, [playlists, sortMode]);

  const handleCreatePlaylist = useCallback(async () => {
    setCreating(true);
    const playlist = await createPlaylist('Playlist mới');
    setCreating(false);
    if (playlist) navigate(`/playlist/${playlist.id}`);
  }, [createPlaylist, navigate]);

  const handleCreateFromLiked = useCallback(async () => {
    const playlist = await createPlaylist('Bài hát đã thích của tôi');
    if (!playlist) return;
    try {
      await Promise.all(likedSongs.map((s: any) =>
        api.post(`/playlists/${playlist.id}/songs`, { songId: s.id }).catch(() => { })
      ));
      await fetchPlaylists();
      navigate(`/playlist/${playlist.id}`);
    } catch { }
  }, [createPlaylist, fetchPlaylists, likedSongs, navigate]);

  const handleRenamePlaylist = useCallback((playlist: any) => {
    setRenameModal({ isOpen: true, playlist });
  }, []);

  const openLibraryMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setLibraryMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home, index: '01' },
    { label: 'Tìm kiếm', path: '/search', icon: Search, index: '02' },
  ];

  const hasItems = likedSongs.length > 0 || followedArtists.length > 0 || playlists.length > 0;

  return (
    <nav className={twMerge('flex flex-col h-full bg-black border-r border-white/10 relative overflow-hidden group/sidebar select-none', className)}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      {/* ── TOP: BRANDING ── */}
      <div className="p-8 pb-6 relative z-10 border-b border-white/10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic select-none">
            Ring<span className="text-[#1db954]">Beat</span>
          </h1>
          <div className="flex items-center gap-2 mt-3 opacity-30">
            <div className="w-1.5 h-1.5 bg-[#1db954]" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white">Archive_Core // v4.0.1</span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: NAVIGATION ── */}
      <div className="p-8 py-10 flex flex-col gap-6 relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'group flex items-center gap-6 transition-all duration-300 relative',
                isActive ? 'text-white' : 'text-[#333] hover:text-white'
              )}
            >
              <span className="text-[10px] font-black italic opacity-40">{item.index}</span>
              <span className="text-xl font-black uppercase tracking-widest leading-none group-hover:translate-x-2 transition-transform">
                {item.label}
              </span>
              {isActive && (
                <motion.div layoutId="nav-indicator" className="absolute -left-8 w-1 h-full bg-[#1db954]" />
              )}
            </Link>
          );
        })}

        {(isArtist || isAdmin) && (
          <Link
            to="/artist-dashboard"
            className={clsx(
              'group flex items-center gap-6 transition-all duration-300 relative',
              location.pathname.startsWith('/artist-dashboard') ? 'text-[#1db954]' : 'text-[#333] hover:text-white'
            )}
          >
            <span className="text-[10px] font-black italic opacity-40">03</span>
            <span className="text-xl font-black uppercase tracking-widest leading-none group-hover:translate-x-2 transition-transform">
              Artist Hub
            </span>
          </Link>
        )}
      </div>

      {/* ── LIBRARY SECTION ── */}
      <div
        className="flex-1 flex flex-col overflow-hidden relative z-10 border-t border-white/10"
        onContextMenu={isAuthenticated ? openLibraryMenu : undefined}
      >
        <div className="p-8 py-6 flex items-center justify-between text-[#222] group-hover/sidebar:text-[#555] transition-colors font-black uppercase tracking-[0.4em] select-none text-[9px]">
          <div className="flex items-center gap-3">
            <Library size={12} />
            <span>Archive</span>
          </div>
          {isAuthenticated && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCreatePlaylist(); }}
              disabled={creating}
              className="hover:text-white transition-colors p-1"
            >
              {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 no-scrollbar">
          {!isAuthenticated || !hasItems ? (
            <div className="p-6 border border-white/5 bg-[#050505] text-sm group/init">
              <p className="font-black text-white uppercase tracking-tighter mb-1 text-xs">Archive_Empty</p>
              <p className="text-[#333] uppercase text-[8px] tracking-[0.2em] mb-6 leading-relaxed">No data units found in local storage cache.</p>
              <button
                onClick={handleCreatePlaylist}
                className="w-full py-4 border border-[#1db954] text-[#1db954] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#1db954] hover:text-black transition-all"
              >
                Init_Playlist
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Pinned */}
              <AnimatePresence>
                {pinnedItems.length > 0 && (
                  <div className="space-y-4">
                    {pinnedItems.map((item) => (
                      <div key={item.id} className="group flex items-center gap-4 relative">
                        <Link
                          to={`/playlist/${item.id}`}
                          className="flex-1 flex items-center gap-4 hover:translate-x-1 transition-transform"
                        >
                          <div className="w-12 h-12 bg-[#111] border border-white/10 relative flex-shrink-0">
                            {item.coverUrl ? (
                              <img src={item.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Music2 size={14} className="text-[#222]" /></div>
                            )}
                            <div className="absolute -top-1 -right-1 bg-[#1db954] text-black p-0.5"><Pin size={8} className="fill-current" /></div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-black text-white uppercase tracking-tighter truncate">{item.title}</p>
                            <p className="text-[8px] font-black text-[#1db954] uppercase tracking-widest">Pinned_Data</p>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); togglePin(item); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-[#444] hover:text-[#1db954] transition-all"
                        >
                          <PinOff size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="border-t border-white/5 mx-2" />
                  </div>
                )}
              </AnimatePresence>

              {/* Liked Songs */}
              {likedSongs.length > 0 && (
                <Link to="/library" className="group flex items-center gap-4 hover:translate-x-1 transition-transform">
                  <div className="w-12 h-12 bg-[#1db954] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <Heart size={18} className="text-black fill-black relative z-10" />
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-white/10"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-black text-white uppercase tracking-tighter truncate">Liked_Materials</p>
                    <p className="text-[8px] font-black text-[#444] uppercase tracking-widest">{likedSongs.length} Units</p>
                  </div>
                </Link>
              )}

              {/* Playlists */}
              {sortedPlaylists.map((playlist) => {
                const isItemPinned = isPinned(playlist.id);
                return (
                  <div key={playlist.id} className="group flex items-center gap-4 relative">
                    <div
                      className="flex-1 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer"
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        openPlaylistMenu(e, { ...playlist, ownerId: playlist.ownerId, isPublic: playlist.isPublic });
                      }}
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <div className="w-12 h-12 bg-[#111] border border-white/10 flex-shrink-0 overflow-hidden relative">
                        {playlist.coverUrl ? (
                          <img src={playlist.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Music2 size={14} className="text-[#222]" /></div>
                        )}
                        {isItemPinned && (
                          <div className="absolute top-0 right-0 p-1 bg-[#1db954] text-black"><Pin size={6} className="fill-current" /></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={clsx("text-[13px] font-black uppercase tracking-tighter truncate transition-colors", location.pathname === `/playlist/${playlist.id}` ? "text-[#1db954]" : "text-white")}>
                          {playlist.title}
                        </p>
                        <p className="text-[8px] font-black text-[#333] uppercase tracking-widest">Collection_File</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.preventDefault(); togglePin(asPin(playlist)); }}
                      className={clsx(
                        "opacity-0 group-hover:opacity-100 p-2 transition-all",
                        isItemPinned ? "text-[#1db954]" : "text-[#333] hover:text-white"
                      )}
                    >
                      {isItemPinned ? <PinOff size={12} /> : <Pin size={12} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


      {/* Context Menus & Modals */}
      {menu && <PlaylistContextMenu playlist={menu.playlist} position={menu.position} onClose={closePlaylistMenu} onRename={() => handleRenamePlaylist(menu.playlist)} />}
      {renameModal.isOpen && renameModal.playlist && <RenamePlaylistModal isOpen={renameModal.isOpen} playlistId={renameModal.playlist.id} initialTitle={renameModal.playlist.title} onClose={() => setRenameModal({ isOpen: false, playlist: null })} />}
      {libraryMenu && <LibraryContextMenu position={libraryMenu} onClose={() => setLibraryMenu(null)} onCreatePlaylist={handleCreatePlaylist} onCreateFromLiked={handleCreateFromLiked} onSort={setSortMode} currentSort={sortMode} />}
    </nav>
  );
};