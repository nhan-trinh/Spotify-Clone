import { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { Plus, Disc3, Trash2, Edit2, Upload, Loader2, Globe, EyeOff, Zap, Layers, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { cn } from '../../lib/utils';

// ─── Shared Components ────────────────────────────────────────────────────────
const TechnicalInput = ({ label, index, ...props }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
       <span className="text-[8px] font-black text-[#1DB954]">{index}</span>
       <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
    </div>
    <input
      {...props}
      className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest placeholder:text-white/5"
    />
  </div>
);

// ─── Album Modal ─────────────────────────────────────────────────────────────
const AlbumModal = ({ album, onClose, onSuccess }: { album?: any; onClose: () => void; onSuccess: () => void; }) => {
  const isEdit = !!album;
  const [form, setForm] = useState({
    title: album?.title || '',
    coverUrl: album?.coverUrl || '',
    releaseDate: album?.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [albumId, setAlbumId] = useState<string | null>(album?.id || null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    let targetAlbumId = albumId;
    if (!targetAlbumId) {
      if (!form.title.trim()) { toast.error('Vui lòng nhập tên album trước'); return; }
      try {
        const res = await api.post('/albums', { title: form.title, releaseDate: form.releaseDate || undefined }) as any;
        targetAlbumId = res.data?.id;
        setAlbumId(targetAlbumId);
      } catch { toast.error('Lỗi khởi tạo album'); return; }
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('cover', file);
      const res = await api.post(`/albums/${targetAlbumId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }) as any;
      setForm(p => ({ ...p, coverUrl: res.data?.coverUrl || '' }));
      toast.success('Visual_Asset Synchronized!');
    } catch {
      toast.error('Lỗi truyền tải hình ảnh');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const data = { title: form.title, releaseDate: form.releaseDate || undefined };
      if (isEdit) {
        await api.patch(`/albums/${album.id}`, data);
      } else if (albumId) {
        await api.patch(`/albums/${albumId}`, data);
      } else {
        await api.post('/albums', data);
      }
      toast.success('Collection_Manifest Committed.');
      onSuccess();
    } catch {
      toast.error('Lỗi lưu trữ dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? "Overwrite_Collection" : "Init_Collection_Manifest"} size="md">
      <form onSubmit={handleSubmit} className="space-y-8">
        <TechnicalInput 
           label="Collection_Title" index="MET_01"
           value={form.title} onChange={(e: any) => setForm(p => ({ ...p, title: e.target.value }))}
           placeholder="INPUT_COLLECTION_NAME"
        />

        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-[#1DB954]">IMG_01</span>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Visual_Broadside</label>
           </div>
           <div 
              onClick={() => coverInputRef.current?.click()}
              className="relative aspect-video border border-white/10 bg-white/[0.03] group cursor-pointer overflow-hidden"
           >
              {form.coverUrl ? (
                <img src={form.coverUrl} alt="cover" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Upload size={24} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Select_Visual_Payload</span>
                </div>
              )}
              {uploadingCover && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                   <Loader2 size={24} className="animate-spin text-[#1DB954]" />
                </div>
              )}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 border-l border-b border-white/10">
                 <Zap size={12} className="text-[#1DB954]" />
              </div>
           </div>
           <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>

        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-[#1DB954]">TS_01</span>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Deployment_Timestamp</label>
           </div>
           <input
             type="date"
             className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest"
             value={form.releaseDate}
             onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))}
           />
        </div>

        <div className="flex justify-end pt-8 border-t border-white/5">
           <Button variant="spotify" className="px-12" disabled={submitting}>
              {submitting ? 'SYNCHRONIZING...' : isEdit ? 'COMMIT_CHANGES' : 'INIT_COLLECTION'}
           </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const ArtistAlbumsPage = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; album?: any }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, album: any }>({ isOpen: false, album: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [albumsRes, songsRes] = await Promise.all([
        api.get('/artists/me/albums') as any,
        api.get('/artists/me/songs') as any,
      ]);
      setAlbums(albumsRes.data || []);
      setSongs(songsRes.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteConfirm.album) return;
    try {
      await api.delete(`/albums/${deleteConfirm.album.id}`);
      toast.success('Collection_Purged: Thành công.');
      setDeleteConfirm({ isOpen: false, album: null });
      fetchData();
    } catch { toast.error('Lỗi khi xóa album'); }
  };

  const handleAddSongsToAlbum = async (albumId: string, songId: string) => {
    try {
      await api.post(`/albums/${albumId}/songs`, { songId });
      toast.success('Signal_Routed: Đã thêm vào Collection.');
      fetchData();
    } catch { toast.error('Lỗi tuyến bài hát'); }
  };

  const handleTogglePublish = async (album: any) => {
    const newStatus = album.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.patch(`/albums/${album.id}`, { status: newStatus });
      toast.success(newStatus === 'PUBLISHED' ? 'Node_Published: Đã công khai.' : 'Node_Retracted: Đã ẩn.');
      fetchData();
    } catch { toast.error('Lỗi đồng bộ trạng thái'); }
  };

  const unassignedSongs = songs.filter((s) => !s.albumId);

  return (
    <div className="space-y-20 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col items-start gap-12 border-b border-white/10 pb-16">
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <Disc3 size={20} className="text-[#1DB954]" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1DB954]">Archive_Collection_v4.2</span>
            </div>
            <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.8]">
               Signal_Collections
            </h1>
            <p className="max-w-xl text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">
               Aggregated broadcast data units grouped by conceptual clusters. Registry contains {albums.length} verified collections.
            </p>
         </div>

         <Button 
            variant="spotify" 
            className="h-20 px-12 group relative"
            onClick={() => setModalState({ open: true })}
         >
            <div className="flex items-center gap-4 relative z-10">
               <Plus size={20} />
               <span className="text-[14px] font-black uppercase tracking-[0.2em]">Init_New_Collection</span>
            </div>
            <div className="absolute top-0 right-0 p-1 opacity-20"><Zap size={12} /></div>
         </Button>
      </header>

      {/* ── GRID ── */}
      <section>
        <div className="flex items-center gap-4 mb-12">
           <span className="text-[10px] font-black text-[#1DB954]">01</span>
           <h2 className="text-2xl font-black uppercase tracking-tighter italic">Aggregated_Nodes</h2>
           <div className="flex-1 h-[1px] bg-white/5" />
           <Layers size={14} className="text-white/20" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
             <Disc3 size={64} strokeWidth={1} />
             <p className="mt-6 text-[10px] font-black uppercase tracking-widest italic">No_Collections_Detected_In_Library</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div key={album.id} className="group bg-black border border-white/10 relative isolate transition-all duration-500 hover:border-[#1DB954]">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 bg-noise" />
                
                {/* Visual */}
                <div className="relative aspect-square overflow-hidden border-b border-white/10">
                   {album.coverUrl ? (
                     <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10 bg-white/[0.02]">
                        <Disc3 size={48} strokeWidth={1} />
                     </div>
                   )}
                   
                   {/* Status Overlay */}
                   <div className="absolute top-4 right-4 z-20">
                      <span className={cn(
                        "px-3 py-1 text-[8px] font-black uppercase tracking-widest border",
                        album.status === 'PUBLISHED' ? "border-[#1DB954] bg-[#1DB954] text-black" : "border-white/20 bg-black/80 text-white/40"
                      )}>
                        {album.status === 'PUBLISHED' ? 'SYNCED_NODE' : 'DRAFT_NODE'}
                      </span>
                   </div>

                   {/* Command Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center gap-2">
                       <Link 
                         to={`/album/${album.id}`} 
                         target="_blank" 
                         className="h-9 px-4 inline-flex items-center justify-center whitespace-nowrap rounded-none text-[11px] font-black uppercase tracking-widest transition-all border border-white/20 bg-transparent hover:border-[#1DB954] hover:text-[#1DB954] text-white gap-2"
                       >
                          <Zap size={12} />
                          <span>VIEW_ENTITY</span>
                       </Link>
                      <button 
                        onClick={() => setModalState({ open: true, album })}
                        className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all"
                      >
                         <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, album })}
                        className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-red-500 hover:text-white transition-all"
                      >
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>

                {/* Metadata */}
                <div className="p-6 space-y-6">
                   <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black uppercase tracking-tighter truncate italic">{album.title}</h3>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{album._count?.songs || 0} DATA_UNITS</span>
                         {album.releaseDate && (
                            <>
                               <div className="w-1 h-1 bg-white/10" />
                               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest tabular-nums">YEAR: {new Date(album.releaseDate).getFullYear()}</span>
                            </>
                         )}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <button
                        onClick={() => handleTogglePublish(album)}
                        className={cn(
                          "w-full flex items-center justify-center gap-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                          album.status === 'PUBLISHED' ? "border-white/10 text-white/20 hover:border-red-500 hover:text-red-500" : "border-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954] hover:text-black"
                        )}
                      >
                         {album.status === 'PUBLISHED' ? <><EyeOff size={14} /> RETRACT_SIGNAL</> : <><Globe size={14} /> BROADCAST_NODE</>}
                      </button>

                      {unassignedSongs.length > 0 && (
                        <div className="pt-4 border-t border-white/5 space-y-3">
                           <div className="flex items-center gap-2 text-white/20">
                              <Activity size={10} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Signal_Routing:</span>
                           </div>
                           <select
                             className="w-full bg-white/[0.03] border border-white/10 text-[9px] text-white/60 font-black uppercase tracking-widest px-3 py-2 outline-none focus:border-[#1DB954]"
                             defaultValue=""
                             onChange={(e) => { if (e.target.value) { handleAddSongsToAlbum(album.id, e.target.value); e.target.value = ''; } }}
                           >
                             <option value="" className="bg-black">SELECT_SIGNAL_UNIT</option>
                             {unassignedSongs.map((s) => (
                               <option key={s.id} value={s.id} className="bg-black">{s.title.toUpperCase()}</option>
                             ))}
                           </select>
                        </div>
                      )}
                   </div>
                </div>

                {/* Technical Corner */}
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black border border-white/20" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MODALS ── */}
      {modalState.open && (
        <AlbumModal
          album={modalState.album}
          onClose={() => setModalState({ open: false })}
          onSuccess={() => { setModalState({ open: false }); fetchData(); }}
        />
      )}

      <ConfirmModal
         isOpen={deleteConfirm.isOpen}
         onClose={() => setDeleteConfirm({ isOpen: false, album: null })}
         onConfirm={handleDelete}
         title="Execute_Collection_Purge"
         message={`Target: "${deleteConfirm.album?.title}". Purging a collection manifest will dissociate data units but will not delete signal clusters.`}
         confirmText="Confirm_Purge"
      />

    </div>
  );
};
