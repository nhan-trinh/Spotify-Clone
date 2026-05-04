import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../lib/api';
import { User as UserIcon, Camera, Cpu, Shield, Zap, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const AccountSettingsPage = () => {
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Profile Form
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setGender((user as any).gender || '');
      setTimeout(() => setLoading(false), 500);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', { name, gender }) as any;
      updateUser({ name: res.data.name, gender: res.data.gender });
      toast.success('Hồ sơ đã được đồng bộ hóa.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi đồng bộ.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Xác thực mật khẩu không khớp.');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/users/password', { currentPassword, newPassword });
      toast.success('Mật khẩu đã được ghi đè.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi ghi đè.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await api.post('/users/avatar', formData) as any;
      updateUser({ avatarUrl: res.data.avatarUrl });
      toast.success('Dữ liệu hình ảnh đã được cập nhật.');
    } catch (error: any) {
      toast.error('Lỗi truyền tải hình ảnh.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="flex-1 w-full min-h-full bg-black overflow-y-auto no-scrollbar relative isolate selection:bg-[#1db954] selection:text-black text-white">
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-noise" />

      <div className="px-6 lg:px-12 pt-24 pb-32 relative z-10 w-full max-w-screen-2xl mx-auto">

        {/* ── HEADER MANIFEST ── */}
        <header className="mb-24 border-b border-white/10 pb-16 grid lg:grid-cols-[1fr_auto] items-end gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-[#1db954]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">System_Identity_v4.2</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
              Account_Manifest
            </h1>
            <p className="max-w-xl text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">
              User entities must synchronize profile metadata and security keys to maintain platform integrity. Access Level: {user?.role?.toUpperCase()}.
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-6 opacity-20">
            <TechnicalReadout icon={Cpu} label="System_Core" value="NEURAL_LINK_ACTIVE" />
            <TechnicalReadout icon={Shield} label="Protocol" value="ENCRYPTED_SHA256" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-20">

          {/* ── SIDEBAR: IDENTITY ── */}
          <aside className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] font-black text-[#1db954]">01</span>
                <h2 className="text-xl font-black uppercase tracking-tighter italic">Entity_Visual</h2>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <div className="relative group">
                <div className="aspect-square bg-white/[0.02] border border-white/10 relative overflow-hidden group-hover:border-[#1db954] transition-colors duration-500">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <UserIcon size={64} strokeWidth={1} />
                    </div>
                  )}

                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#1db954] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#1db954] opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Scanline Effect */}
                  <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-[0.1] pointer-events-none transition-opacity bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all z-20">
                    <div className="flex flex-col items-center gap-2">
                      <Camera size={24} className="text-[#1db954]" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Update_Image</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
                      <div className="w-8 h-[2px] bg-[#1db954] animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tighter italic">{user?.name}</p>
                    <p className="text-[10px] text-[#1db954] font-black uppercase tracking-widest mt-1">ID: {user?.id.slice(0, 12)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">Registry_Role</p>
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest italic">{user?.role?.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-12 border-t border-white/5 opacity-30">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural_Sync</span>
                  <span className="text-[8px] font-black uppercase text-[#1db954]">STABLE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Archive_Access</span>
                  <span className="text-[8px] font-black uppercase text-[#1db954]">GRANTED</span>
                </div>
              </div>
            </section>
          </aside>

          {/* ── MAIN FORMS ── */}
          <main className="space-y-24">
            {/* Profile Sync */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black text-[#1db954]">02</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Metadata_Synchronization</h2>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Alias_Descriptor</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm focus:border-[#1db954] outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/5"
                      placeholder="Input_Alias"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Gender_Identifier</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm focus:border-[#1db954] outline-none transition-all font-black uppercase tracking-widest appearance-none"
                    >
                      <option value="" className="bg-black">SELECT_IDENTIFIER</option>
                      <option value="man" className="bg-black">XY_MALE</option>
                      <option value="woman" className="bg-black">XX_FEMALE</option>
                      <option value="non-binary" className="bg-black">NON_BINARY</option>
                      <option value="prefer_not_to_say" className="bg-black">NULL_HIDDEN</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative px-12 py-4 bg-[#1db954] text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all active:scale-95 disabled:opacity-30"
                  >
                    {saving ? 'Synchronizing...' : 'Commit_Changes'}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-black border border-white/20" />
                  </button>
                </div>
              </form>
            </section>

            {/* Security Keys */}
            {!user?.googleId && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-black text-[#1db954]">03</span>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">Security_Overwrite</h2>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <form onSubmit={handleChangePassword} className="space-y-12">
                  <div className="space-y-3 max-w-md">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Current_Credential</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm focus:border-[#1db954] outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-white/5 pt-12">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">New_Input_Key</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm focus:border-[#1db954] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Verify_Sequence</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm focus:border-[#1db954] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-12 py-4 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs hover:border-[#1db954] hover:text-[#1db954] transition-all active:scale-95 disabled:opacity-30"
                    >
                      Overwrite_Key
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* System Marker */}
            <footer className="mt-32 pt-8 border-t border-white/10 flex justify-between items-center opacity-10">
              <span className="text-[8px] font-black uppercase tracking-[0.5em]">RingBeat // System_Preferences_End</span>
              <div className="flex gap-4">
                <Zap size={12} />
                <Globe size={12} />
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

const TechnicalReadout = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/[0.02]">
      <Icon size={16} className="text-[#1db954]" />
    </div>
    <div className="flex flex-col">
      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40">{label}</span>
      <span className="text-[12px] font-black uppercase tracking-widest text-white">{value}</span>
    </div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="flex-1 w-full min-h-full bg-black p-12">
    <div className="max-w-screen-2xl mx-auto space-y-24 animate-pulse">
      <div className="h-40 w-full bg-white/[0.02] border border-white/5" />
      <div className="grid grid-cols-[400px_1fr] gap-20">
        <div className="h-96 bg-white/[0.02]" />
        <div className="space-y-12">
          <div className="h-64 bg-white/[0.02]" />
          <div className="h-64 bg-white/[0.02]" />
        </div>
      </div>
    </div>
  </div>
);
