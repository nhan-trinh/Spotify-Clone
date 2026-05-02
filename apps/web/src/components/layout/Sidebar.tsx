import { Home, Search, Library, Plus, Heart, Music2, CheckCircle2, LayoutDashboard, ShieldCheck, Loader2, Pin, PinOff } from 'lucide-react';
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

// ── Placed outside component: stable reference, no recreation on each render ──
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

  // Context menu for playlist items
  const { menu, openPlaylistMenu, closePlaylistMenu } = usePlaylistContextMenu();
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; playlist: any }>({ isOpen: false, playlist: null });

  // Library area context menu
  const [libraryMenu, setLibraryMenu] = useState<{ x: number; y: number } | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  // Pinned items
  const { pinnedItems, togglePin, isPinned } = usePinnedItems();

  const isArtist = user?.role === 'ARTIST';
  const isAdmin = user?.role === 'ADMIN';

  // Fetch sidebar data
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

  // ----- Sort playlists -----
  const sortedPlaylists = useMemo(() => {
    const list = [...playlists];
    if (sortMode === 'name') {
      return list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }
    if (sortMode === 'oldest') {
      // API returns newest-first by default → reverse gives oldest-first
      return list.reverse();
    }
    // 'recent' — keep API order (newest first)
    return list;
  }, [playlists, sortMode]);

  // ----- Handlers -----
  const handleCreatePlaylist = useCallback(async () => {
    setCreating(true);
    const playlist = await createPlaylist('Playlist mới');
    setCreating(false);
    if (playlist) navigate(`/playlist/${playlist.id}`);
  }, [createPlaylist, navigate]);

  const handleCreateFromLiked = useCallback(async () => {
    const playlist = await createPlaylist('Bài hát đã thích của tôi');
    if (!playlist) return;
    // Use likedSongs already in state — avoids a redundant API call
    try {
      await Promise.all(likedSongs.map((s: any) =>
        api.post(`/playlists/${playlist.id}/songs`, { songId: s.id }).catch(() => {})
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
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Tìm kiếm', path: '/search', icon: Search },
  ];

  const hasItems = likedSongs.length > 0 || followedArtists.length > 0 || playlists.length > 0;


  return (
    <nav className={twMerge('flex flex-col gap-2 h-full', className)}>
      {/* Top Nav */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-4 text-sm font-bold transition-colors',
                isActive ? 'text-white' : 'text-[#B3B3B3] hover:text-white'
              )}
            >
              <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}

        {(isArtist || isAdmin) && (
          <Link
            to="/artist-dashboard"
            className={clsx(
              'flex items-center gap-4 text-sm font-bold transition-colors',
              location.pathname.startsWith('/artist-dashboard') ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'
            )}
          >
            <LayoutDashboard className="h-6 w-6" />
            Artist Hub
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className={clsx(
              'flex items-center gap-4 text-sm font-bold transition-colors',
              location.pathname.startsWith('/admin') ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'
            )}
          >
            <ShieldCheck className="h-6 w-6" />
            Admin
          </Link>
        )}
      </div>

      {/* Library Box */}
      <div 
        className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden"
        onContextMenu={isAuthenticated ? openLibraryMenu : undefined}
      >
        {/* Library Header */}
        <div className="p-4 flex items-center justify-between text-[#B3B3B3] font-bold shadow-sm select-none">
          <Link to="/library" className="flex items-center gap-4 hover:text-white transition-colors duration-200">
            <Library className="h-6 w-6" />
            Thư viện
          </Link>
          {isAuthenticated && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCreatePlaylist(); }}
              disabled={creating}
              title="Tạo playlist mới"
              className="hover:text-white transition-colors rounded-full p-1 hover:bg-[#282828] disabled:opacity-50"
            >
              {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
          {!isAuthenticated || !hasItems ? (
            <>
              <div className="p-4 bg-[#242424] rounded-lg mt-2 mb-4 text-sm">
                <p className="font-bold text-white mb-2">Tạo playlist đầu tiên của bạn</p>
                <p className="text-[#B3B3B3] mb-4">Rất dễ, chúng tôi sẽ giúp bạn</p>
                <button
                  onClick={handleCreatePlaylist}
                  className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform text-sm"
                >
                  Tạo danh sách phát
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">

              {/* ── PINNED SECTION ── */}
              {pinnedItems.length > 0 && (
                <div className="mb-1">
                  <p className="px-2 py-1 text-[11px] font-semibold text-[#b3b3b3] uppercase tracking-wider flex items-center gap-1.5">
                    <Pin size={10} className="fill-current" /> Đã ghim
                  </p>
                  {pinnedItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Link to={`/playlist/${item.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded bg-[#282828] flex items-center justify-center flex-shrink-0 shadow overflow-hidden">
                          {item.coverUrl
                            ? <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                            : <Music2 className="w-5 h-5 text-[#b3b3b3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          <p className="text-xs text-[#1db954] truncate flex items-center gap-1">
                            <Pin size={10} className="fill-current" /> Đã ghim
                          </p>
                        </div>
                      </Link>
                      {/* Unpin button */}
                      <button
                        onClick={(e) => { e.preventDefault(); togglePin(item); }}
                        title="Bỏ ghim"
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#b3b3b3] hover:text-white transition-all"
                      >
                        <PinOff size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="my-1 mx-2 border-t border-white/5" />
                </div>
              )}

              {/* ── LIKED SONGS ── */}
              {likedSongs.length > 0 && (
                <Link
                  to="/library"
                  className={clsx(
                    'flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer group',
                    location.pathname === '/library' && 'bg-[#282828]'
                  )}
                >
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-[#7b52b8] to-[#2d0f6e] flex items-center justify-center flex-shrink-0 shadow">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">Bài hát đã thích</p>
                    <p className="text-xs text-[#B3B3B3] truncate">
                      Danh sách phát • {likedSongs.length} bài hát
                    </p>
                  </div>
                </Link>
              )}

              {/* ── USER PLAYLISTS (sorted) ── */}
              {sortedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group relative"
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    openPlaylistMenu(e, { ...playlist, ownerId: playlist.ownerId, isPublic: playlist.isPublic });
                  }}
                >
                  <Link
                    to={`/playlist/${playlist.id}`}
                    className={clsx(
                      'flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer',
                      location.pathname === `/playlist/${playlist.id}` && 'bg-[#282828]'
                    )}
                  >
                    <div className="w-12 h-12 rounded bg-[#282828] flex items-center justify-center flex-shrink-0 shadow overflow-hidden">
                      {playlist.coverUrl
                        ? <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
                        : <Music2 className="w-5 h-5 text-[#b3b3b3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{playlist.title}</p>
                      <p className="text-xs text-[#B3B3B3] truncate flex items-center gap-1">
                        Danh sách phát
                        {isPinned(playlist.id) && <Pin size={10} className="fill-[#1db954] text-[#1db954]" />}
                      </p>
                    </div>
                  </Link>
                  {/* Pin button appears on hover */}
                  <button
                    onClick={(e) => { e.preventDefault(); togglePin(asPin(playlist)); }}
                    title={isPinned(playlist.id) ? 'Bỏ ghim' : 'Ghim lên đầu'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-[#b3b3b3] hover:text-white transition-all rounded"
                  >
                    {isPinned(playlist.id)
                      ? <PinOff size={14} className="text-[#1db954]" />
                      : <Pin size={14} />}
                  </button>
                </div>
              ))}

              {/* ── FOLLOWED ARTISTS ── */}
              {followedArtists.map((artist: any) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <img
                    src={artist.avatarUrl || 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=100&h=100'}
                    alt={artist.stageName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-white truncate">{artist.stageName}</p>
                      {artist.isVerified && <CheckCircle2 size={12} className="text-[#1DB954] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[#B3B3B3]">Nghệ sĩ</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Playlist item context menu */}
      {menu && (
        <PlaylistContextMenu
          playlist={menu.playlist}
          position={menu.position}
          onClose={closePlaylistMenu}
          onRename={() => handleRenamePlaylist(menu.playlist)}
        />
      )}

      {/* Rename modal */}
      {renameModal.isOpen && renameModal.playlist && (
        <RenamePlaylistModal
          isOpen={renameModal.isOpen}
          playlistId={renameModal.playlist.id}
          initialTitle={renameModal.playlist.title}
          onClose={() => setRenameModal({ isOpen: false, playlist: null })}
        />
      )}

      {/* Library area context menu */}
      {libraryMenu && (
        <LibraryContextMenu
          position={libraryMenu}
          onClose={() => setLibraryMenu(null)}
          onCreatePlaylist={handleCreatePlaylist}
          onCreateFromLiked={handleCreateFromLiked}
          onSort={setSortMode}
          currentSort={sortMode}
        />
      )}
    </nav>
  );
};
