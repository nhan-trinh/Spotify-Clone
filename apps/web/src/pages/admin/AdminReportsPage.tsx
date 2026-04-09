import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CheckCircle, XCircle, Flag, MessageSquare, AlertCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';

export const AdminReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'RESOLVED' | 'DISMISSED'>('PENDING');

  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'RESOLVE' | 'DISMISS' | null;
    report: any;
  }>({ isOpen: false, type: null, report: null });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/moderation/reports?status=${filter}`);
      setReports(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const handleHandleReport = (report: any, action: 'RESOLVE' | 'DISMISS') => {
    setModal({ isOpen: true, type: action, report });
  };

  const executeAction = async () => {
    if (!modal.report) return;
    const { id } = modal.report;
    const action = modal.type === 'RESOLVE' ? 'resolved' : 'dismissed';

    try {
      await api.post(`/moderation/reports/${id}/${action}`);
      toast.success(`Đã ${modal.type === 'RESOLVE' ? 'xử lý' : 'bác bỏ'} thành công`);
      setModal({ ...modal, isOpen: false });
      fetchReports();
    } catch (error) {
      toast.error('Lỗi khi xử lý báo cáo');
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Content Reports</h2>
          <p className="text-[#b3b3b3]">Xử lý các cáo buộc vi phạm nội dung từ người dùng.</p>
        </div>
        
        <div className="flex bg-[#181818] p-1 rounded-lg border border-[#282828]">
          {(['PENDING', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                filter === s ? 'bg-[#282828] text-white shadow-lg' : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-[#181818] rounded-xl border border-[#282828] overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#282828]/50 uppercase tracking-wider text-[#b3b3b3] text-[11px] font-bold sticky top-0 z-10 box-shadow">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Target Content</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {loading ? (
                 <tr><td colSpan={5} className="p-12 text-center text-[#b3b3b3] animate-pulse font-medium">Đang truy xuất dữ liệu báo cáo...</td></tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[#b3b3b3]">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Flag size={48} />
                      <p className="text-lg font-bold">Không có báo cáo nào ở trạng thái {filter}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#282828]/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 animate-pulse' :
                        r.status === 'RESOLVED' ? 'bg-[#1DB954]/10 text-[#1DB954]' :
                        'bg-[#3e3e3e] text-[#888]'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{r.reporter?.name}</p>
                      <p className="text-xs text-[#b3b3b3]">{r.reporter?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#282828] p-2 rounded">
                           <ShieldAlert size={16} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white max-w-[200px] truncate">{r.song?.title || 'Unknown Content'}</p>
                          <p className="text-[10px] text-[#b3b3b3] uppercase tracking-tighter">ID: {r.songId?.split('-')[0]}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                          <MessageSquare size={12} className="text-blue-400" /> {r.reason}
                        </span>
                        {r.note && <p className="text-xs text-[#b3b3b3] italic max-w-xs truncate">"{r.note}"</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleHandleReport(r, 'RESOLVE')}
                            className="bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954] hover:text-black border border-[#1DB954]/20 p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold uppercase"
                          >
                            <CheckCircle size={14} /> Resolve
                          </button>
                          <button
                            onClick={() => handleHandleReport(r, 'DISMISS')}
                            className="bg-[#3e3e3e] text-white hover:bg-[#555] border border-[#444] p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold uppercase"
                          >
                            <XCircle size={14} /> Dismiss
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end text-[#555] italic text-xs">
                           Processed at {new Date(r.resolvedAt || r.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.type === 'RESOLVE' ? '✅ Xác nhận xử lý báo cáo' : '🚫 Bác bỏ báo cáo'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal({ ...modal, isOpen: false })}>Hủy</Button>
            <Button 
               onClick={executeAction}
               className={modal.type === 'RESOLVE' ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]' : ''}
            >
              Xác nhận
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#282828] rounded-xl border border-[#3e3e3e]">
             <AlertCircle size={24} className={modal.type === 'RESOLVE' ? 'text-[#1DB954]' : 'text-gray-400'} />
             <div>
                <p className="font-bold text-white mb-1">
                  {modal.type === 'RESOLVE' ? 'Đánh dấu đã giải quyết' : 'Từ chối báo cáo này'}
                </p>
                <p className="text-sm text-[#b3b3b3]">
                  {modal.type === 'RESOLVE' 
                    ? 'Bạn xác nhận rằng nội dung này vi phạm và đã được xử lý (ví dụ: gỡ bài hoặc đánh gậy).' 
                    : 'Bạn cho rằng báo cáo này không hợp lệ hoặc nội dung không vi phạm tiêu chuẩn.'}
                </p>
             </div>
          </div>
          
          <div className="p-3 bg-[#181818] rounded-lg border border-[#3e3e3e]">
            <p className="text-[10px] text-[#555] font-bold uppercase mb-1">Cáo buộc bởi</p>
            <p className="text-sm text-white font-medium">{modal.report?.reporter?.name}</p>
            <p className="text-xs text-[#b3b3b3]">{modal.report?.reason}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
