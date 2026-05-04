import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, Music2, FileAudio, Image as ImageIcon, Video, Layers, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { queryClient } from '../../lib/query-client';
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

const TechnicalSelect = ({ label, index, children, ...props }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-black text-[#1DB954]">{index}</span>
      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
    </div>
    <select
      {...props}
      className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
    >
      {children}
    </select>
  </div>
);

// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal = ({ albums, onClose, onSuccess }: { albums: any[], onClose: () => void, onSuccess: () => void }) => {
  const [form, setForm] = useState({
    title: '', lyrics: '', duration: '', albumId: '', language: 'vi',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [canvasFile, setCanvasFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAudioFile(file);
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.onloadedmetadata = () => {
        setForm(p => ({ ...p, duration: Math.round(audio.duration).toString() }));
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !audioFile) { toast.error('Vui lòng điền tiêu đề và chọn file âm thanh'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('audio', audioFile);
      if (coverFile) formData.append('cover', coverFile);
      if (canvasFile) formData.append('canvas', canvasFile);
      if (form.lyrics) formData.append('lyrics', form.lyrics);
      if (form.duration) formData.append('duration', form.duration);
      if (form.albumId) formData.append('albumId', form.albumId);
      if (form.language) formData.append('language', form.language);

      await api.post('/songs/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Dữ liệu tín hiệu đã được truyền tải! 🎵');
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi truyền tải');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Init_Signal_Upload" size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TechnicalInput
              label="Signal_Title" index="MET_01"
              placeholder="ENTER_TITLE" value={form.title}
              onChange={(e: any) => setForm(p => ({ ...p, title: e.target.value }))}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-[#1DB954]">FIL_01</span>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Audio_Payload (MP3)</label>
              </div>
              <label className="block w-full cursor-pointer group">
                <div className="border border-white/10 bg-white/[0.03] p-8 flex flex-col items-center gap-3 group-hover:border-[#1DB954] transition-all relative overflow-hidden">
                  <FileAudio size={24} className="text-white/20 group-hover:text-[#1DB954]" />
                  <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-full">
                    {audioFile ? audioFile.name : 'SELECT_AUDIO_SOURCE'}
                  </span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                  {audioFile && <div className="absolute top-0 right-0 p-1 bg-[#1DB954] text-black"><Zap size={10} /></div>}
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-[#1DB954]">IMG_01</span>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Visual_Cover</label>
                </div>
                <label className="block w-full cursor-pointer group">
                  <div className="aspect-square border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center gap-2 group-hover:border-[#1DB954] transition-all">
                    <ImageIcon size={16} className="text-white/20" />
                    <span className="text-[7px] font-black uppercase tracking-widest">{coverFile ? 'LOADED' : 'ATTACH'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                  </div>
                </label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-[#1DB954]">VID_01</span>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Canvas_Loop</label>
                </div>
                <label className="block w-full cursor-pointer group">
                  <div className="aspect-square border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center gap-2 group-hover:border-[#1DB954] transition-all">
                    <Video size={16} className="text-white/20" />
                    <span className="text-[7px] font-black uppercase tracking-widest">{canvasFile ? 'LOADED' : 'ATTACH'}</span>
                    <input type="file" accept="video/*" className="hidden" onChange={e => setCanvasFile(e.target.files?.[0] || null)} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TechnicalSelect
              label="Archive_Node" index="SYS_01"
              value={form.albumId} onChange={(e: any) => setForm(p => ({ ...p, albumId: e.target.value }))}
            >
              <option value="" className="bg-black">NULL_COLLECTION</option>
              {albums.map((a: any) => <option key={a.id} value={a.id} className="bg-black">{a.title.toUpperCase()}</option>)}
            </TechnicalSelect>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-[#1DB954]">TXT_01</span>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Lyric_Manifest</label>
              </div>
              <textarea
                rows={8}
                className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest resize-none placeholder:text-white/5"
                placeholder="INPUT_LYRIC_DATA"
                value={form.lyrics}
                onChange={e => setForm(p => ({ ...p, lyrics: e.target.value }))}
              />
            </div>

            <div className="p-4 border border-[#1DB954]/20 bg-[#1DB954]/5 flex items-center justify-between">
              <span className="text-[8px] font-black text-[#1DB954] uppercase tracking-[0.4em]">Signal_Duration</span>
              <span className="text-[12px] font-black tabular-nums">
                {form.duration ? `${Math.floor(parseInt(form.duration) / 60)}:${(parseInt(form.duration) % 60).toString().padStart(2, '0')}` : '00:00'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-white/5">
          <Button variant="spotify" className="px-16 h-14" disabled={submitting}>
            {submitting ? 'TRANSMITTING...' : 'INIT_BROADCAST'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Edit Modal (Simplified Version for brevity) ────────────────────────────────
const EditModal = ({ song, albums, onClose, onSuccess }: { song: any, albums: any[], onClose: () => void, onSuccess: () => void }) => {
  const [form, setForm] = useState({
    title: song.title || '', lyrics: song.lyrics || '', albumId: song.albumId || '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [canvasFile, setCanvasFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      if (coverFile) formData.append('cover', coverFile);
      if (canvasFile) formData.append('canvas', canvasFile);
      if (form.lyrics !== song.lyrics) formData.append('lyrics', form.lyrics);
      formData.append('albumId', form.albumId || '');

      await api.patch(`/songs/${song.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Tín hiệu đã được cập nhật.');
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
      onSuccess();
    } catch (err: any) {
      toast.error('Cập nhật thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Overwrite_Signal: ${song.id.slice(0, 8)}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TechnicalInput
              label="Signal_Title" index="MET_01"
              value={form.title} onChange={(e: any) => setForm(p => ({ ...p, title: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Cover_Update</label>
                <input type="file" accept="image/*" className="w-full bg-white/[0.03] border border-white/10 p-2 text-[10px]" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Canvas_Update</label>
                <input type="file" accept="video/*" className="w-full bg-white/[0.03] border border-white/10 p-2 text-[10px]" onChange={e => setCanvasFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <TechnicalSelect
              label="Archive_Node" index="SYS_01"
              value={form.albumId} onChange={(e: any) => setForm(p => ({ ...p, albumId: e.target.value }))}
            >
              <option value="" className="bg-black">NULL_COLLECTION</option>
              {albums.map((a: any) => <option key={a.id} value={a.id} className="bg-black">{a.title.toUpperCase()}</option>)}
            </TechnicalSelect>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Lyric_Manifest</label>
              <textarea
                rows={5}
                className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm outline-none font-black uppercase tracking-widest resize-none"
                value={form.lyrics}
                onChange={e => setForm(p => ({ ...p, lyrics: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-8 border-t border-white/5">
          <Button variant="spotify" className="px-16" disabled={submitting}>
            {submitting ? 'SYNCHRONIZING...' : 'COMMIT_CHANGES'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ArtistSongsPage = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, song: any }>({ isOpen: false, song: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [songsRes, albumsRes] = await Promise.all([
        api.get('/artists/me/songs') as any,
        api.get('/artists/me/albums') as any,
      ]);
      setSongs(songsRes.data || []);
      setAlbums(albumsRes.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteConfirm.song) return;
    try {
      await api.delete(`/songs/${deleteConfirm.song.id}`);
      toast.success('Signal_Purged: Bài hát đã được xóa.');
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
      setDeleteConfirm({ isOpen: false, song: null });
      fetchData();
    } catch {
      toast.error('Lỗi khi xóa bài hát.');
    }
  };

  return (
    <div className="space-y-20 animate-in fade-in duration-700 pb-20">

      {/* ── HEADER ── */}
      <header className="flex flex-col items-start gap-12 border-b border-white/10 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Music2 size={20} className="text-[#1DB954]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1DB954]">Archive_Broadcast_v4.2</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.8]">
            Signal_Archive
          </h1>
          <p className="max-w-xl text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">
            Management of primary audio broadcast signals. Registry contains {songs.length} verified data units.
          </p>
        </div>

        <Button
          variant="spotify"
          className="h-20 px-12 group relative"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center gap-4 relative z-10">
            <Plus size={20} />
            <span className="text-[14px] font-black uppercase tracking-[0.2em]">Upload_New_Signal</span>
          </div>
          {/* Design detail */}
          <div className="absolute top-0 right-0 p-1 opacity-20"><Activity size={12} /></div>
        </Button>
      </header>

      {/* ── LISTING ── */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-black text-[#1DB954]">01</span>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Broadcasting_Units</h2>
          <div className="flex-1 h-[1px] bg-white/5" />
          <Layers size={14} className="text-white/20" />
        </div>

        <div className="border border-white/10 bg-black relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 bg-noise" />

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left relative z-10 border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">#</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Signal_Identity</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Archive_Node</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30 text-center">Protocol_Status</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse h-24">
                      <td colSpan={5} className="bg-white/[0.01]" />
                    </tr>
                  ))
                ) : songs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <Zap size={48} />
                        <p className="text-[10px] font-black uppercase tracking-widest italic">Signal_Registry_Empty: Please initialize upload.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  songs.map((song, i) => (
                    <tr key={song.id} className="group hover:bg-[#1DB954]/5 transition-colors">
                      <td className="px-8 py-6 text-[10px] font-black text-white/20 tabular-nums">
                        {(i + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 border border-white/10 overflow-hidden bg-black flex-shrink-0 relative">
                            {song.coverUrl ? (
                              <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10"><Music2 size={16} /></div>
                            )}
                            <div className="absolute inset-0 border border-white/10 group-hover:border-[#1DB954]/40 transition-all" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-black uppercase tracking-tighter text-white truncate max-w-[240px] italic">{song.title}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#1DB954] tabular-nums">{song.playCount?.toLocaleString() || 0} UNITS</span>
                              <div className="w-1 h-1 bg-white/20" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">UUID: {song.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          {song.album?.title || 'NULL_NODE'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "inline-block px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] border transition-all",
                          song.status === 'APPROVED' ? 'border-[#1DB954]/20 text-[#1DB954] bg-[#1DB954]/5' :
                            song.status === 'PENDING' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5' :
                              song.status === 'PROCESSING' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5 animate-pulse' :
                                'border-red-500/20 text-red-400 bg-red-500/5'
                        )}>
                          {song.status === 'APPROVED' ? 'SYNC_COMPLETE' : song.status === 'PENDING' ? 'SYNC_PENDING' : song.status === 'PROCESSING' ? 'SYNC_ACTIVE' : 'SYNC_FAILED'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingSong(song)}
                            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-white hover:bg-white text-white/40 hover:text-black transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, song })}
                            className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-red-500 hover:bg-red-500 text-white/40 hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MODALS ── */}
      {showModal && (
        <UploadModal
          albums={albums}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData(); }}
        />
      )}
      {editingSong && (
        <EditModal
          song={editingSong}
          albums={albums}
          onClose={() => setEditingSong(null)}
          onSuccess={() => { setEditingSong(null); fetchData(); }}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, song: null })}
        onConfirm={handleDelete}
        title="Execute_Signal_Purge"
        message={`Target: "${deleteConfirm.song?.title}". This operation will permanently remove the data cluster from the primary broadcast archive.`}
        confirmText="Confirm_Purge"
      />

    </div>
  );
};
