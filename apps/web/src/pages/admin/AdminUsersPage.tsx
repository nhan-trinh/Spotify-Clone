import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Shield, ShieldAlert, Ban, Key, CheckCircle2, Hammer, AlertTriangle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';

export const AdminUsersPage = () => {
  const [data, setData] = useState<{ users: any[], total: number, page: number }>({ users: [], total: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'BAN' | 'UNBAN' | 'ROLE' | 'STRIKE' | 'VERIFY' | null;
    user: any;
    reason: string;
    note: string;
    targetRole: string;
  }>({ 
    isOpen: false, 
    type: null, 
    user: null, 
    reason: 'SPAM', 
    note: '', 
    targetRole: '' 
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?page=${data.page}&search=${search}`);
      setData(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchUsers(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, data.page]);

  const handleBan = (user: any) => {
    if (user.isBanned) {
      setModal({ ...modal, isOpen: true, type: 'UNBAN', user, reason: '' });
    } else {
      setModal({ ...modal, isOpen: true, type: 'BAN', user, reason: '' });
    }
  };

  const handleChangeRole = (user: any) => {
    setModal({ ...modal, isOpen: true, type: 'ROLE', user, targetRole: user.role });
  };

  const handleVerifyArtist = (user: any) => {
    // Note: Verify needs artistId, not userId. AdminUsersPage query includes artistProfile.
    setModal({ ...modal, isOpen: true, type: 'VERIFY', user });
  };

  const handleIssueStrike = (user: any) => {
    setModal({ ...modal, isOpen: true, type: 'STRIKE', user, reason: 'SPAM', note: '' });
  };

  const executeAction = async () => {
    if (!modal.user) return;
    const { id, name } = modal.user;

    try {
      switch (modal.type) {
        case 'UNBAN':
          await api.post(`/admin/users/${id}/unban`);
          toast.success('Đã mở khóa tài khoản');
          break;
        case 'BAN':
          if (!modal.reason.trim()) return toast.error('Vui lòng nhập lý do');
          await api.post(`/admin/users/${id}/ban`, { reason: modal.reason });
          toast.error('Đã khóa tài khoản');
          break;
        case 'ROLE':
          await api.patch(`/admin/users/${id}/role`, { role: modal.targetRole });
          toast.success(`Đã đổi quyền thành ${modal.targetRole}`);
          break;
        case 'VERIFY':
          await api.post(`/admin/artists/${modal.user.artistProfile.id}/verify`);
          toast.success(`Đã cấp tích xanh cho ${name}!`);
          break;
        case 'STRIKE':
          const res = await api.post(`/moderation/users/${id}/strike`, { 
            reason: modal.reason, 
            note: modal.note 
          });
          if (res.data.banned) {
            toast.error(`User ${name} đã bị TỰ ĐỘNG KHÓA do nhận đủ 3 gậy!`);
          } else {
            toast.warning(`Đã đánh gậy cho ${name}. Hiện tại: ${res.data.totalStrikes}/3 gậy.`);
          }
          break;
        default:
          break;
      }
      setModal({ ...modal, isOpen: false });
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi thực hiện thao tác');
    }
    return;
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">User Management</h2>
          <p className="text-[#b3b3b3]">Quản lý người dùng, vai trò (Roles) và hình phạt hệ thống.</p>
        </div>
        <div className="flex bg-[#282828] p-1 rounded-full w-full md:w-80 border border-[#3e3e3e]">
          <input
            type="text"
            placeholder="Tìm kiếm Email hoặc Tên..."
            className="bg-transparent text-sm w-full outline-none px-4 py-2 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 bg-[#181818] rounded-xl border border-[#282828] overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#282828]/50 uppercase tracking-wider text-[#b3b3b3] text-[11px] font-bold sticky top-0 z-10 box-shadow">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Data</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {loading && data.users.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#b3b3b3] animate-pulse">Đang tải dữ liệu...</td></tr>
              ) : data.users.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#b3b3b3]">Không tìm thấy người dùng.</td></tr>
              ) : (
                data.users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#282828]/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#3e3e3e] flex items-center justify-center font-bold font-mono text-lg text-[#b3b3b3] shadow-md">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-base text-white">{u.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#b3b3b3]">{u.email}</span>
                        {u.isEmailVerified && <span className="bg-[#1DB954]/20 text-[#1DB954] px-1.5 py-[1px] rounded text-[9px] font-bold">VERIFIED</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-[#e22134]/20 text-[#e22134]' :
                        u.role === 'MODERATOR' ? 'bg-orange-500/20 text-orange-400' :
                        u.role === 'ARTIST' ? 'bg-[#1DB954]/20 text-[#1DB954]' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role === 'ADMIN' ? <ShieldAlert size={12}/> : <Shield size={12}/>}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.isBanned ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#e22134] text-white">
                          <Ban size={12} /> BANNED
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 items-center justify-center">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex px-3 py-1 text-xs font-bold text-[#b3b3b3]">ACTIVE</span>
                            {u._count?.strikes > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 rounded">
                                <AlertTriangle size={10} /> {u._count.strikes}
                              </span>
                            )}
                          </div>
                          {u.role === 'ARTIST' && u.artistProfile && (
                            u.artistProfile.isVerified 
                              ? <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">✓ VERIFIED ARTIST</span>
                              : <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold animate-pulse">PENDING VERIFY</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-[#b3b3b3]">
                        {!u.isBanned && (
                          <button
                            onClick={() => handleIssueStrike(u)}
                            className="hover:text-yellow-500 hover:bg-yellow-500/10 p-2 rounded-lg transition-all"
                            title="Issue Strike"
                          >
                            <Hammer size={18} />
                          </button>
                        )}
                        {u.role === 'ARTIST' && u.artistProfile && !u.artistProfile.isVerified && (
                          <button
                            onClick={() => handleVerifyArtist(u)}
                            className="hover:text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-all"
                            title="Verify Artist"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleChangeRole(u)}
                          className="hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                          title="Change Role"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => handleBan(u)}
                          className={u.isBanned ? "text-[#1DB954] hover:bg-[#1DB954]/10 p-2 rounded-lg" : "hover:text-[#e22134] hover:bg-[#e22134]/10 p-2 rounded-lg"}
                          title={u.isBanned ? "Unban User" : "Ban User"}
                        >
                          {u.isBanned ? <CheckCircle2 size={18} /> : <Ban size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="h-14 bg-[#282828]/50 border-t border-[#282828] flex items-center justify-between px-6 shrink-0">
          <span className="text-sm text-[#b3b3b3]">
            Hiển thị <span className="font-bold text-white">{data.users.length}</span> / {data.total}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={data.page === 1}
              onClick={() => setData(p => ({ ...p, page: p.page - 1 }))}
              className="px-3 py-1 text-sm font-bold bg-[#282828] hover:bg-[#3e3e3e] rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm px-2 font-bold">{data.page}</span>
            <button 
              disabled={data.users.length < 20}
              onClick={() => setData(p => ({ ...p, page: p.page + 1 }))}
              className="px-3 py-1 text-sm font-bold bg-[#282828] hover:bg-[#3e3e3e] rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={
          modal.type === 'STRIKE' ? '⚠️ Đánh gậy người dùng' :
          modal.type === 'BAN' ? '🚫 Khóa tài khoản' :
          modal.type === 'UNBAN' ? '🔓 Mở khóa tài khoản' :
          modal.type === 'ROLE' ? '🔑 Thay đổi quyền hạn' :
          '✨ Xác minh Nghệ sĩ'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal({ ...modal, isOpen: false })}>Hủy</Button>
            <Button 
              className={modal.type === 'BAN' || modal.type === 'STRIKE' ? 'bg-[#e22134] hover:bg-[#ff1b31]' : ''}
              onClick={executeAction}
            >
              {modal.type === 'UNBAN' ? 'Xác nhận Mở' : modal.type === 'VERIFY' ? 'Xác minh ngay' : 'Thực hiện'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#181818] rounded-xl border border-[#3e3e3e]">
            <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-white font-bold">
              {modal.user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-white">{modal.user?.name}</p>
              <p className="text-xs text-[#b3b3b3]">{modal.user?.email}</p>
            </div>
          </div>

          {modal.type === 'ROLE' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#b3b3b3] uppercase">Chọn vai trò mới</label>
              <div className="grid grid-cols-2 gap-2">
                {['USER_FREE', 'USER_PREMIUM', 'ARTIST', 'MODERATOR', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setModal({ ...modal, targetRole: r })}
                    className={`px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                      modal.targetRole === r 
                        ? 'bg-[#1DB954] border-[#1DB954] text-black shadow-[0_0_15px_rgba(29,185,84,0.3)]' 
                        : 'bg-[#282828] border-[#3e3e3e] text-[#b3b3b3] hover:border-[#888]'
                    }`}
                  >
                    {r.replace('USER_', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(modal.type === 'BAN' || modal.type === 'STRIKE') && (
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-[#b3b3b3] uppercase">Lý do hình phạt</label>
                  <select 
                    value={modal.reason}
                    onChange={(e) => setModal({ ...modal, reason: e.target.value })}
                    className="w-full mt-2 bg-[#181818] border border-[#3e3e3e] rounded-lg p-3 text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="SPAM">Phát tán thư rác (Spam)</option>
                    <option value="COPYRIGHT_VIOLATION">Vi phạm bản quyền</option>
                    <option value="INAPPROPRIATE_CONTENT">Nội dung không phù hợp</option>
                    <option value="OTHER">Lý do khác</option>
                  </select>
               </div>
               {modal.type === 'STRIKE' && (
                 <div>
                    <label className="text-xs font-bold text-[#b3b3b3] uppercase">Ghi chú chi tiết</label>
                    <textarea 
                      placeholder="Nhập chi tiết vi phạm để lưu lại nhật ký..."
                      value={modal.note}
                      onChange={(e) => setModal({ ...modal, note: e.target.value })}
                      className="w-full mt-2 bg-[#181818] border border-[#3e3e3e] rounded-lg p-3 text-white focus:outline-none focus:border-[#1DB954] h-24 resize-none"
                    />
                 </div>
               )}
            </div>
          )}

          {modal.type === 'UNBAN' && (
            <p className="text-[#b3b3b3] text-sm">Bạn sắp mở khóa tài khoản cho người dùng này. Họ sẽ có thể đăng nhập lại bình thường.</p>
          )}

          {modal.type === 'VERIFY' && (
            <p className="text-[#b3b3b3] text-sm">Xác nhận cấp huy hiệu "Verified" (Tích xanh) cho nghệ sĩ này. Hành động này sẽ được lưu vào nhật ký hệ thống.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};
