import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, Music2 } from 'lucide-react';
import { toast } from 'sonner';

const UploadModal = ({ albums, onClose, onSuccess }: { albums: any[], onClose: () => void, onSuccess: () => void }) => {
  const [form, setForm] = useState({
    title: '', audioUrl: '', coverUrl: '', lyrics: '',
    duration: '', albumId: '', language: 'vi',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.audioUrl) {
      toast.error('Vui lòng điền tiêu đề và URL âm thanh');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/songs/with-url', {
        ...form,
        duration: form.duration ? parseInt(form.duration) : 0,
        albumId: form.albumId || null,
      });
      toast.success('Bài hát đã được thêm vào thư viện! 🎵');
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#282828] rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-5">Thêm bài hát mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-[#b3b3b3] mb-1 block">Tiêu đề *</label>
            <input
              className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954]"
              placeholder="Tên bài hát"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-[#b3b3b3] mb-1 block">URL âm thanh (MP3) *</label>
            <input
              className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954]"
              placeholder="https://example.com/song.mp3"
              value={form.audioUrl}
              onChange={e => setForm(p => ({ ...p, audioUrl: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-[#b3b3b3] mb-1 block">URL ảnh cover</label>
            <input
              className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954]"
              placeholder="https://example.com/cover.jpg"
              value={form.coverUrl}
              onChange={e => setForm(p => ({ ...p, coverUrl: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#b3b3b3] mb-1 block">Thời lượng (giây)</label>
              <input
                type="number" min="0"
                className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954]"
                placeholder="240"
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-[#b3b3b3] mb-1 block">Album (tuỳ chọn)</label>
              <select
                className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954]"
                value={form.albumId}
                onChange={e => setForm(p => ({ ...p, albumId: e.target.value }))}
              >
                <option value="">— Không có album —</option>
                {albums.map((a: any) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#b3b3b3] mb-1 block">Lời bài hát (tuỳ chọn)</label>
            <textarea
              rows={3}
              className="w-full bg-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#1DB954] resize-none"
              placeholder="Nhập lời bài hát..."
              value={form.lyrics}
              onChange={e => setForm(p => ({ ...p, lyrics: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2 rounded-full border border-[#535353] text-sm font-bold hover:border-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 py-2 rounded-full bg-[#1DB954] text-black text-sm font-bold hover:bg-[#1ed760] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Đang gửi...' : 'Gửi duyệt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ArtistSongsPage = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      APPROVED: 'bg-[#1DB954]/20 text-[#1DB954]',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      REJECTED: 'bg-red-500/20 text-red-400',
    };
    const label: Record<string, string> = { APPROVED: 'Đã duyệt', PENDING: 'Chờ duyệt', REJECTED: 'Từ chối' };
    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status] || 'bg-white/10 text-white'}`}>{label[status] || status}</span>;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Bài hát của bạn</h2>
          <p className="text-[#b3b3b3] text-sm mt-1">{songs.length} bài hát</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1DB954] text-black font-bold px-5 py-2.5 rounded-full hover:bg-[#1ed760] transition-colors text-sm"
        >
          <Plus size={16} />
          Thêm bài hát
        </button>
      </div>

      <div className="bg-[#181818] rounded-xl border border-[#282828] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[#282828] text-xs text-[#b3b3b3] uppercase tracking-wider">
          <span>Tiêu đề</span>
          <span>Album</span>
          <span>Trạng thái</span>
          <span>Thao tác</span>
        </div>

        <div className="divide-y divide-[#282828]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded flex-1" />
                </div>
                <div className="w-20 h-4 bg-white/10 rounded self-center" />
                <div className="w-16 h-5 bg-white/10 rounded-full self-center" />
                <div className="w-8 h-8 bg-white/10 rounded self-center" />
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Music2 size={40} className="text-[#b3b3b3] mb-3" />
              <p className="font-bold text-white mb-1">Chưa có bài hát nào</p>
              <p className="text-sm text-[#b3b3b3]">Nhấn "Thêm bài hát" để tải lên bài đầu tiên</p>
            </div>
          ) : (
            songs.map((song) => (
              <div key={song.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 hover:bg-white/5 items-center">
                <div className="flex items-center gap-3 min-w-0">
                  {song.coverUrl
                    ? <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    : <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0"><Music2 size={16} className="text-[#b3b3b3]" /></div>
                  }
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{song.title}</p>
                    <p className="text-xs text-[#b3b3b3]">{song.playCount?.toLocaleString() || 0} lượt nghe</p>
                  </div>
                </div>
                <span className="text-sm text-[#b3b3b3] whitespace-nowrap">
                  {song.album?.title || '—'}
                </span>
                {statusBadge(song.status)}
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-white/10 text-[#b3b3b3] hover:text-white transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-red-500/10 text-[#b3b3b3] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <UploadModal
          albums={albums}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
};
