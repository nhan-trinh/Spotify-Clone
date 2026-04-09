import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CheckCircle2, XCircle, Play, Pause, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';

export const AdminPendingSongsPage = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'APPROVE' | 'REJECT' | null;
    song: any;
    reason: string;
  }>({ isOpen: false, type: null, song: null, reason: '' });

  const fetchSongs = async () => {
    try {
      const res = await api.get('/moderation/songs/pending');
      setSongs(res.data);
    } catch (error) {
      toast.error('Lỗi lấy danh sách bài hát chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleApprove = (song: any) => {
    setModal({ isOpen: true, type: 'APPROVE', song, reason: '' });
  };

  const handleReject = (song: any) => {
    setModal({ isOpen: true, type: 'REJECT', song, reason: '' });
  };

  const executeAction = async () => {
    if (!modal.song) return;
    const { id } = modal.song;

    try {
      if (modal.type === 'APPROVE') {
        await api.post(`/moderation/songs/${id}/approve`);
        toast.success('Đã duyệt bài hát');
      } else {
        if (!modal.reason.trim()) return toast.error('Vui lòng nhập lý do từ chối');
        await api.post(`/moderation/songs/${id}/reject`, { reason: modal.reason });
        toast.info('Đã từ chối bài hát');
      }
      setSongs(songs.filter(s => s.id !== id));
      setModal({ ...modal, isOpen: false });
    } catch (error) {
      toast.error('Lỗi khi thực hiện thao tác');
    }
    return;
  };

  const handlePlayToggle = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Pending Content</h2>
          <p className="text-[#b3b3b3]">Duyệt các bài hát do Nghệ sĩ tải lên trước khi phát hành công khai.</p>
        </div>
        <div className="bg-[#e22134]/10 text-[#e22134] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-[#e22134]/30">
           <span className="w-2 h-2 rounded-full bg-[#e22134] animate-pulse"></span> {songs.length} Pending
        </div>
      </div>

      {loading ? (
        <div className="text-[#b3b3b3] p-8 text-center bg-[#181818] rounded-xl border border-[#282828] animate-pulse h-64"></div>
      ) : songs.length === 0 ? (
        <div className="text-center p-16 bg-[#181818] rounded-xl border border-[#282828] flex flex-col items-center">
          <CheckCircle2 size={48} className="text-[#1DB954] mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Tất cả đều hoàn tất!</h3>
          <p className="text-[#b3b3b3]">Không có bài hát nào đang chờ duyệt lúc này.</p>
        </div>
      ) : (
        <div className="bg-[#181818] rounded-xl border border-[#282828] overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#282828]/50 uppercase tracking-wider text-[#b3b3b3] text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Preview</th>
                <th className="px-6 py-4">Track Info</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Media Specs</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {songs.map((song) => {
                const audioUrl = song.audioUrl320 || song.audioUrl128;
                return (
                  <tr key={song.id} className="hover:bg-[#282828]/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 flex-shrink-0 cursor-pointer" onClick={() => handlePlayToggle(song.id)}>
                        <img src={song.coverUrl || '/placeholder.jpg'} alt="cover" className="w-12 h-12 rounded object-cover shadow-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                          {playingId === song.id ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1" />}
                        </div>
                      </div>
                      {playingId === song.id && (
                        <audio src={audioUrl} autoPlay onEnded={() => setPlayingId(null)} className="hidden" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-base text-white">{song.title}</p>
                      <p className="text-xs text-[#b3b3b3] mt-1">{new Date(song.createdAt).toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={song.artist?.avatarUrl || '/placeholder-user.jpg'} className="w-6 h-6 rounded-full object-cover" alt="" />
                        <span className="font-semibold">{song.artist?.stageName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-[#b3b3b3] mb-1">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}s</p>
                      <span className="bg-[#282828] text-[#888] px-2 py-0.5 rounded text-[10px] font-bold">MP3 / 320kbps</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(song)}
                          className="bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954] hover:text-black border border-[#1DB954]/20 p-2 rounded-full transition-colors"
                          title="Phê duyệt (Approve)"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button
                          onClick={() => handleReject(song)}
                          className="bg-[#e22134]/10 text-[#e22134] hover:bg-[#e22134] hover:text-white border border-[#e22134]/20 p-2 rounded-full transition-colors"
                          title="Từ chối (Reject)"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.type === 'APPROVE' ? '✅ Phê duyệt nội dung' : '🚫 Từ chối nội dung'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal({ ...modal, isOpen: false })}>Hủy</Button>
            <Button 
               onClick={executeAction}
               className={modal.type === 'REJECT' ? 'bg-[#e22134] hover:bg-[#ff1b31]' : 'bg-[#1DB954] text-black hover:bg-[#1ed760]'}
            >
              {modal.type === 'APPROVE' ? 'Duyệt bài hát' : 'Xác nhận từ chối'}
            </Button>
          </>
        }
      >
         <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#282828] rounded-xl border border-[#3e3e3e]">
               <img src={modal.song?.coverUrl || '/placeholder.jpg'} className="w-16 h-16 rounded shadow-lg object-cover" />
               <div>
                  <p className="font-bold text-lg text-white">{modal.song?.title}</p>
                  <p className="text-sm text-[#b3b3b3]">{modal.song?.artist?.stageName}</p>
               </div>
            </div>

            {modal.type === 'APPROVE' ? (
              <div className="flex items-start gap-3 text-sm text-[#b3b3b3]">
                 <CheckCircle2 size={18} className="text-[#1DB954] shrink-0 mt-0.5" />
                 <p>Bài hát này sẽ được phát hành công khai trên hệ thống và người dùng có thể bắt đầu tìm kiếm, nghe nhạc và thêm vào playlist.</p>
              </div>
            ) : (
              <div className="space-y-3">
                 <div className="flex items-start gap-3 text-sm text-yellow-500 mb-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>Hành động này sẽ xóa hoặc ẩn bài hát khỏi trạng thái chờ duyệt. Vui lòng cung cấp lý do cụ thể cho nghệ sĩ.</p>
                 </div>
                 <label className="text-xs font-bold text-[#b3b3b3] uppercase">Lý do từ chối</label>
                 <textarea 
                    autoFocus
                    placeholder="Ví dụ: Chất lượng âm thanh kém, Vi phạm bản quyền hình ảnh..."
                    value={modal.reason}
                    onChange={(e) => setModal({ ...modal, reason: e.target.value })}
                    className="w-full bg-[#181818] border border-[#3e3e3e] rounded-lg p-3 text-white focus:outline-none focus:border-[#e22134] h-24 resize-none"
                 />
              </div>
            )}
         </div>
      </Modal>
    </div>
  );
};
