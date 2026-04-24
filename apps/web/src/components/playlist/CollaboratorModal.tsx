import React, { useState } from 'react';
import { X, Search, UserPlus, UserMinus, Loader2, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { queryClient } from '../../lib/query-client';

interface CollaboratorModalProps {
  playlistId: string;
  collaborators: any[];
  ownerId: string;
  currentUserId: string;
  onClose: () => void;
}

export const CollaboratorModal: React.FC<CollaboratorModalProps> = ({
  playlistId,
  collaborators,
  ownerId,
  currentUserId,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const isOwner = currentUserId === ownerId;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const res = await api.get(`/search?q=${searchQuery}`) as any;
      // Chỉ lấy users và loại bỏ owner + những người đã là active collaborator
      const activeIds = collaborators
        .filter(c => c.status === 'ACTIVE')
        .map(c => c.userId);
      
      const filtered = (res.data.users || []).filter((u: any) => 
        u.id !== ownerId && !activeIds.includes(u.id)
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleInvite = async (userId: string) => {
    setLoadingAction(userId);
    try {
      await api.post(`/playlists/${playlistId}/collaborative/invite`, { userId });
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
      // Reset search
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Invite failed:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleKick = async (userId: string) => {
    setLoadingAction(userId);
    try {
      await api.delete(`/playlists/${playlistId}/collaborative/kick/${userId}`);
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    } catch (err) {
      console.error('Kick failed:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
      <div className="bg-[#282828] w-full max-w-[480px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Người cộng tác</h2>
          <button onClick={onClose} className="text-[#b3b3b3] hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Box (Only for Owner) */}
          {isOwner && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#b3b3b3]">Mời bạn bè cùng đóng góp</p>
              <form onSubmit={handleSearch} className="relative group">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full bg-[#3e3e3e] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-white/20 outline-none"
                />
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-[200px] overflow-y-auto custom-scrollbar bg-[#181818] rounded-lg border border-white/5 divide-y divide-white/5">
                  {searchResults.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={u.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <span className="text-sm font-medium truncate">{u.name}</span>
                      </div>
                      <button
                        onClick={() => handleInvite(u.id)}
                        disabled={loadingAction === u.id}
                        className="text-[#1db954] hover:scale-110 transition-transform p-1 disabled:opacity-50"
                      >
                        {loadingAction === u.id ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {searching && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#1db954]" /></div>}
            </div>
          )}

          {/* Current Collaborators List */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-[#b3b3b3]">Danh sách cộng tác viên</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {/* Always show Owner first */}
              <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={collaborators[0]?.playlist?.owner?.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-[#1db954] rounded-full p-0.5 border-2 border-[#282828]" title="Chủ sở hữu">
                      <Check size={8} className="text-black font-black" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Chủ sở hữu</p>
                    <p className="text-xs text-[#b3b3b3]">Quyền tối cao</p>
                  </div>
                </div>
              </div>

              {collaborators.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={collab.user.avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'} 
                      className={cn(
                        "w-10 h-10 rounded-full object-cover transition-opacity",
                        collab.status === 'KICKED' && "opacity-40 grayscale"
                      )} 
                      alt="" 
                    />
                    <div className="overflow-hidden">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        collab.status === 'KICKED' ? "text-[#b3b3b3] line-through" : "text-white"
                      )}>
                        {collab.user.name}
                      </p>
                      <p className="text-[10px] text-[#b3b3b3]">
                        {collab.status === 'ACTIVE' ? 'Đang hoạt động' : `Đã bị gỡ (${collab.kickedAt ? new Date(collab.kickedAt).toLocaleDateString() : ''})`}
                      </p>
                    </div>
                  </div>

                  {isOwner && collab.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleKick(collab.user.id)}
                      disabled={loadingAction === collab.user.id}
                      className="opacity-0 group-hover:opacity-100 text-[#ff4444] hover:scale-110 transition-all p-2 disabled:opacity-50"
                      title="Gỡ quyền cộng tác"
                    >
                      {loadingAction === collab.user.id ? <Loader2 size={18} className="animate-spin" /> : <UserMinus size={18} />}
                    </button>
                  )}

                  {isOwner && collab.status === 'KICKED' && (
                    <button
                      onClick={() => handleInvite(collab.user.id)}
                      disabled={loadingAction === collab.user.id}
                      className="opacity-0 group-hover:opacity-100 text-[#1db954] hover:scale-110 transition-all p-2 disabled:opacity-50"
                      title="Mời lại"
                    >
                      {loadingAction === collab.user.id ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                    </button>
                  )}
                </div>
              ))}

              {collaborators.length === 0 && (
                <div className="text-center py-8 text-[#b3b3b3] text-sm italic">
                  Chưa có người cộng tác nào.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 text-[10px] text-[#b3b3b3] leading-tight italic">
          * Người cộng tác có quyền thêm bài hát và xóa bài hát do chính họ thêm vào playlist này.
        </div>
      </div>
    </div>
  );
};
