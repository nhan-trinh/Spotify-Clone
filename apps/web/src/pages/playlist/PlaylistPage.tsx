import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { queryClient } from '../../lib/query-client';
import { usePlayerStore } from '../../stores/player.store';
import { useLibraryStore } from '../../stores/library.store';
import { useAuthStore } from '../../stores/auth.store';
import { Play, Pause, Heart, MoreHorizontal, Camera, X, Loader2, UserPlus, Activity, Database, Zap, Cpu, Shuffle } from 'lucide-react';
import { formatTime, cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { SongContextMenu, useContextMenu } from '../../components/shared/SongContextMenu';
import { PlaylistContextMenu, usePlaylistContextMenu } from '../../components/shared/PlaylistContextMenu';
import { CollaboratorModal } from '../../components/playlist/CollaboratorModal';
import { toast } from 'sonner';
import { useInteractionTracker } from '../../hooks/useInteractionTracker';
import { motion, AnimatePresence } from 'framer-motion';

export const PlaylistPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', coverUrl: '', isCollaborative: false });
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);

  const { user } = useAuthStore();
  const { setContextAndPlay, currentContextId, currentTrack, isPlaying, togglePlay, isShuffle, toggleShuffle } = usePlayerStore();
  const { isLiked, toggleLike, isFollowingPlaylist, toggleFollowPlaylist, removeSongFromPlaylist } = useLibraryStore();
  const playlistFollowed = id ? isFollowingPlaylist(id) : false;
  const { menu: trackMenu, openMenu: openTrackMenu, closeMenu: closeTrackMenu } = useContextMenu();
  const { menu: playlistMenu, openPlaylistMenu, closePlaylistMenu } = usePlaylistContextMenu();

  useInteractionTracker('PLAYLIST', id);

  const { data: playlist, isLoading: loading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const res = await api.get(`/playlists/${id}`) as any;
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!playlist) return;
    setEditForm({
      title: playlist.title || '',
      description: playlist.description || '',
      coverUrl: playlist.coverUrl || '',
      isCollaborative: playlist.isCollaborative || false,
    });
  }, [playlist]);

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-full bg-black p-8 lg:p-16 flex flex-col gap-12">
        <div className="h-64 bg-white/5 animate-pulse border border-white/10" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />
        <Database size={64} className="text-white/10 mb-8" />
        <div className="text-white/20 font-black uppercase tracking-[0.5em] mb-12">Archive_Not_Found</div>
        <Link to="/" className="px-10 py-4 border border-white/20 hover:border-white text-[11px] font-black uppercase tracking-widest transition-all italic relative group overflow-hidden">
          <span className="relative z-10">Return_to_Dashboard</span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
        </Link>
      </div>
    );
  }

  const isThisPlaying = currentContextId === id && isPlaying;
  const trackList = playlist.songs.map((ps: any) => ({
    id: ps.song.id, title: ps.song.title, artistName: ps.song.artist.stageName, artistId: ps.song.artistId,
    coverUrl: ps.song.coverUrl, audioUrl: ps.song.audioUrl320 || ps.song.audioUrl128 || '',
    canvasUrl: ps.song.canvasUrl, duration: ps.song.duration, hasLyrics: !!ps.song.lyrics,
  }));

  const handleMainPlay = () => {
    if (trackList.length === 0) return;
    if (currentContextId === id) {
      togglePlay();
    } else {
      setContextAndPlay(trackList, 0, id);
    }
  };

  const handleTrackPlay = (index: number) => {
    if (currentContextId === id && currentTrack?.id === trackList[index].id) {
      togglePlay();
    } else {
      setContextAndPlay(trackList, index, id);
    }
  };

  const handleUpdatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Dùng destructuring để bóc tách coverUrl ra khỏi các trường còn lại
      const { coverUrl, ...rest } = editForm;
      // Chỉ gửi coverUrl nếu nó thực sự có dữ liệu (URL hợp lệ)
      const payload = coverUrl ? { ...rest, coverUrl } : rest;
      
      await api.patch(`/playlists/${id}`, payload);
      queryClient.invalidateQueries({ queryKey: ['playlist', id] });
      setIsEditing(false);
      toast.success('Archive updated successfully');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update archive');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('cover', file);
      const res = await api.patch(`/playlists/${id}/cover`, formData) as any;
      setEditForm((prev: any) => ({ ...prev, coverUrl: res.data.coverUrl }));
      queryClient.invalidateQueries({ queryKey: ['playlist', id] });
    } catch (e) {
      toast.error('Cover upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const isOwner = playlist.ownerId === user?.id;
  const isCollaborator = playlist.collaborators?.some((c: any) => c.userId === user?.id);
  const canManageItems = isOwner || isCollaborator;

  const handleRemoveFromPlaylist = async (songId: string) => {
    if (!id) return;
    try {
      await removeSongFromPlaylist(id, songId);
      queryClient.invalidateQueries({ queryKey: ['playlist', id] });
      toast.success('Registry Entry Removed');
    } catch (err) {
      console.error(err);
      toast.error('Removal protocol failed');
    }
  };

  return (
    <div className="flex-1 w-full min-h-full bg-black overflow-y-auto no-scrollbar relative isolate selection:bg-[#1db954] selection:text-black text-white">
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      {/* Giant Background Label (Editorial Style) */}
      <div className="fixed -left-48 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap z-0">
        <span className="text-[220px] font-black text-white/[0.02] tracking-tighter uppercase leading-none italic">
          {playlist.title}
        </span>
      </div>

      <div className="px-8 lg:px-16 pt-24 pb-32 relative z-10 w-full max-w-screen-2xl mx-auto">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row items-end gap-10 border-b border-white/10 pb-16"
        >
          <div
            className={cn(
              "relative group w-64 h-64 border border-white/10 overflow-hidden bg-[#050505] shadow-[30px_30px_80px_rgba(0,0,0,0.8)]",
              isOwner && "cursor-pointer"
            )}
            onClick={() => isOwner && setIsEditing(true)}
          >
            <img
              src={playlist.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=300'}
              alt={playlist.title}
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none mix-blend-difference">
              <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">ARCHIVE_REF_{playlist.id.slice(0, 6)}</span>
              <span className="text-[6px] font-black text-[#1db954] uppercase tracking-[0.2em]">{playlist.isPublic ? "PUBLIC_SIGNAL" : "ENCRYPTED_SIGNAL"}</span>
            </div>
            {isOwner && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                <Camera size={40} className="text-[#1db954] mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Update_Image</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-[#1db954]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">Playlist_Archive</span>
            </div>

            <h1
              className={cn(
                "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic truncate max-w-full",
                isOwner && "cursor-pointer hover:text-[#1db954] transition-colors"
              )}
              onClick={() => isOwner && setIsEditing(true)}
            >
              {playlist.title}
            </h1>

            {playlist.description && (
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-2 max-w-2xl leading-relaxed italic border-l-2 border-white/10 pl-4">
                {playlist.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                  <img src={playlist.owner?.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#1db954] transition-colors">{playlist.owner?.name}</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Database size={12} />
                <span>{playlist.songs.length} Entries</span>
              </div>
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Zap size={12} />
                <span>Total_Duration: {formatTime(playlist.songs.reduce((acc: number, s: any) => acc + (s.song?.duration || 0), 0))}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-6 mb-16">
          <button
            onClick={handleMainPlay}
            className="group relative flex items-center gap-4 px-10 py-5 bg-[#1db954] text-black transition-all hover:bg-white overflow-hidden shadow-[10px_10px_0px_rgba(29,185,84,0.2)]"
          >
            <div className="relative z-10 flex items-center gap-3">
              {isThisPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black" />}
              <span className="text-sm font-black uppercase tracking-widest italic">{isThisPlaying ? "Halt_Stream" : "Initiate_Stream"}</span>
            </div>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-4 border transition-all duration-300 relative group/btn",
                isShuffle ? "bg-[#1db954] text-black border-[#1db954]" : "border-white/10 text-white/40 hover:border-white hover:text-white"
              )}
              title="Shuffle_Toggle"
            >
              <Shuffle size={20} className={isShuffle ? "drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" : ""} />
            </button>
          </div>

          <div className="w-[1px] h-8 bg-white/10 mx-2" />

          <button
            onClick={() => id && toggleFollowPlaylist(id, playlist.title)}
            className={cn(
              "p-4 border transition-all duration-500",
              playlistFollowed ? "bg-white text-black border-white" : "border-white/20 text-white hover:border-white"
            )}
          >
            <Heart size={24} className={playlistFollowed ? "fill-black" : ""} />
          </button>

          <button
            onClick={(e) => openPlaylistMenu(e, { ...playlist, ownerId: playlist.ownerId })}
            className="p-4 border border-white/20 text-white hover:border-white transition-all"
          >
            <MoreHorizontal size={24} />
          </button>

          {isOwner && playlist.isCollaborative && (
            <button
              onClick={() => setShowCollaborators(true)}
              className="ml-auto flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-[#1db954] text-white hover:text-[#1db954] text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <UserPlus size={16} />
              Grant_Access
            </button>
          )}
        </div>

        {/* ── MANIFEST ── */}
        <div className="flex flex-col gap-1">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_120px_120px_60px] gap-6 px-6 py-4 border-b border-white/10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
            <span>#_ID</span>
            <span>Archive_Signature</span>
            <span className="hidden md:block">Playback_Count</span>
            <span className={cn("hidden lg:block", !playlist.isCollaborative && "invisible")}>Origin_User</span>
            <span className="text-right">Dur.</span>
          </div>

          <div className="flex flex-col">
            {playlist.songs.map((item: any, index: number) => {
              const track = item.song;
              const isRowPlaying = currentContextId === id && currentTrack?.id === track.id;

              return (
                <motion.div
                  key={item.songId}
                  onClick={() => handleTrackPlay(index)}
                  onContextMenu={(e) => openTrackMenu(e, { ...track, artistName: track.artist?.stageName || 'Unknown_Artist' })}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "group grid grid-cols-[40px_1fr_120px_120px_60px] gap-6 items-center px-6 py-4 border-b border-white/5 transition-all cursor-pointer relative overflow-hidden",
                    isRowPlaying ? "bg-[#1db954]/10" : "hover:bg-white text-white hover:text-black"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-black italic transition-colors text-center",
                    isRowPlaying ? "text-[#1db954]" : "text-white/20 group-hover:text-black/40"
                  )}>
                    {isRowPlaying ? <Activity size={12} className="animate-pulse mx-auto" /> : (index + 1).toString().padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-10 h-10 border border-white/10 overflow-hidden flex-shrink-0 relative">
                      <img src={track.coverUrl} className={cn("w-full h-full object-cover grayscale transition-all duration-700", !isRowPlaying && "group-hover:grayscale-0 group-hover:scale-110")} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-black uppercase tracking-tighter truncate leading-none mb-1">
                        {track.title}
                      </p>
                      <Link to={`/artist/${track.artistId}`} onClick={(e) => e.stopPropagation()} className={cn(
                        "text-[9px] font-black uppercase tracking-widest truncate block",
                        isRowPlaying ? "text-white/60" : "text-white/20 group-hover:text-black/60 hover:underline"
                      )}>
                        {track.artist?.stageName || 'Unknown_Artist'}
                      </Link>
                    </div>
                  </div>

                  <span className={cn("hidden md:block text-[9px] font-black uppercase tracking-widest", isRowPlaying ? "text-white/40" : "text-white/20 group-hover:text-black/40")}>
                    {track.playCount.toLocaleString()} UNITS
                  </span>

                  <div className={cn("hidden lg:flex items-center gap-2 overflow-hidden", !playlist.isCollaborative && "invisible")}>
                    {item.addedByUser && (
                      <>
                        <img src={item.addedByUser.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'} className="w-4 h-4 rounded-full grayscale group-hover:grayscale-0" />
                        <span className={cn("text-[9px] font-black uppercase tracking-widest truncate", isRowPlaying ? "text-white/40" : "text-white/20 group-hover:text-black/40")}>{item.addedByUser.name}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(track.id, track.title); }}
                      className={cn(
                        "transition-all duration-300",
                        isLiked(track.id) ? "text-[#1db954]" : "text-white/20 group-hover:text-black/20 hover:text-[#1db954]"
                      )}
                    >
                      <Heart size={14} className={isLiked(track.id) ? "fill-[#1db954]" : ""} />
                    </button>
                    <span className={cn("text-[10px] font-black italic", isRowPlaying ? "text-[#1db954]" : "text-white/20 group-hover:text-black/40")}>{formatTime(track.duration)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openTrackMenu(e, { ...track, artistName: track.artist.stageName }); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>

                  {/* Hover Progress Tab */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#1db954] translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER STATUS ── */}
        <footer className="mt-32 pt-12 border-t border-white/10 opacity-20 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1db954]">Archive_Transmission_Stable</span>
            <span className="text-[7px] font-black uppercase tracking-widest text-white">Security_Protocol: AES-256_ACTIVE</span>
          </div>
          <div className="flex gap-8">
            <Cpu size={14} />
            <Zap size={14} />
          </div>
        </footer>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-md selection:bg-white selection:text-black"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-white/20 w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-noise" />

              <div className="relative z-10">
                <div className="flex items-center justify-between p-8 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Edit_Archive_Manifest</h2>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Override_System_Parameters</p>
                  </div>
                  <button onClick={() => setIsEditing(false)} className="p-2 border border-white/10 hover:border-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdatePlaylist} className="p-8 space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="relative group w-48 h-48 bg-[#111] border border-white/10 flex-shrink-0">
                      <img src={editForm.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=300'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                        {uploadingCover ? <Loader2 className="animate-spin text-[#1db954]" /> : <Camera size={32} className="text-[#1db954] mb-2" />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Inject_Visual</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                      </label>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Manifest_Identity</label>
                        <input
                          className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm font-black uppercase tracking-tighter outline-none focus:border-[#1db954] transition-colors"
                          value={editForm.title}
                          onChange={e => setEditForm((p: any) => ({ ...p, title: e.target.value }))}
                          placeholder="ASSIGN_IDENTITY" required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Archive_Description</label>
                        <textarea
                          className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm font-black uppercase tracking-tighter h-24 outline-none focus:border-[#1db954] transition-colors resize-none"
                          value={editForm.description}
                          onChange={e => setEditForm((p: any) => ({ ...p, description: e.target.value }))}
                          placeholder="ENTER_DATA_STRING"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 border border-white/10 bg-white/[0.02]">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest italic">Collaborative_Protocol</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Multi-User Manifest Access</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm((p: any) => ({ ...p, isCollaborative: !p.isCollaborative }))}
                      className={cn("w-12 h-6 border transition-all duration-500 relative", editForm.isCollaborative ? "bg-[#1db954] border-[#1db954]" : "border-white/20 bg-transparent")}
                    >
                      <div className={cn("absolute top-1 w-4 h-4 transition-all duration-500", editForm.isCollaborative ? "right-1 bg-black" : "left-1 bg-white")} />
                    </button>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="submit" disabled={saving}
                      className="bg-[#1db954] text-black font-black uppercase tracking-widest px-12 py-4 hover:bg-white transition-all italic text-sm shadow-[8px_8px_0px_rgba(29,185,84,0.2)]"
                    >
                      {saving ? 'EXECUTING...' : 'COMMIT_CHANGES'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENUS ── */}
      {trackMenu && (
        <SongContextMenu
          song={trackMenu.song} position={trackMenu.position} onClose={closeTrackMenu}
          onPlay={() => {
            const idx = playlist.songs.findIndex((s: any) => s.song.id === trackMenu.song.id);
            if (idx !== -1) handleTrackPlay(idx);
          }}
          onRemoveFromPlaylist={canManageItems ? () => handleRemoveFromPlaylist(trackMenu.song.id) : undefined}
        />
      )}
      {playlistMenu && (
        <PlaylistContextMenu
          playlist={playlistMenu.playlist} position={playlistMenu.position}
          onClose={closePlaylistMenu} onRename={() => setIsEditing(true)}
        />
      )}
      {showCollaborators && (
        <CollaboratorModal
          playlistId={id!} collaborators={playlist.collaborators} ownerId={playlist.ownerId}
          currentUserId={user?.id || ''} onClose={() => setShowCollaborators(false)}
        />
      )}
    </div>
  );
};