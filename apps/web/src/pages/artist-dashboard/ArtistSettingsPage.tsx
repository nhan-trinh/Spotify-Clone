import { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'sonner';
import { Camera, Loader2, BadgeCheck, Send, Upload, Shield, Zap, Globe, AtSign, Video, Globe2, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';

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

export const ArtistSettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [requestingVerify, setRequestingVerify] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    stageName: '',
    bio: '',
    avatarUrl: '',
    socialLinks: {
      website: '',
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/artists/me') as any;
        const data = res.data;
        setProfile(data);
        setForm({
          stageName: data.stageName || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          socialLinks: {
            website: data.socialLinks?.website || '',
            instagram: data.socialLinks?.instagram || '',
            facebook: data.socialLinks?.facebook || '',
            youtube: data.socialLinks?.youtube || '',
            tiktok: data.socialLinks?.tiktok || '',
          },
        });
      } catch {
        setForm(prev => ({ ...prev, stageName: user?.name || '' }));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/artists/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }) as any;
      const newUrl = res.data?.avatarUrl;
      setForm((p) => ({ ...p, avatarUrl: newUrl }));
      updateUser({ avatarUrl: newUrl });
      toast.success('Visual_ID Synchronized!');
    } catch {
      toast.error('Lỗi truyền tải hình ảnh.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { avatarUrl: _skip, ...patchBody } = form;
      await api.patch('/artists/me', patchBody);
      updateUser({ name: form.stageName });
      toast.success('Manifest_Updated: Thành công.');
    } catch {
      toast.error('Lỗi cập nhật dữ liệu.');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerify = async () => {
    if (profile?.isVerified) return;
    setRequestingVerify(true);
    try {
      await api.post('/artists/request-verify');
      toast.success('Yêu cầu xác minh đã được chuyển tiếp tới Admin. ✅');
    } catch {
      toast.error('Lỗi chuyển tiếp yêu cầu.');
    } finally {
      setRequestingVerify(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
        <Loader2 size={32} className="animate-spin text-[#1DB954]" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Fetching_Profile_Manifest</span>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-in fade-in duration-700 pb-20">

      {/* ── HEADER ── */}
      <header className="flex flex-col gap-6 border-b border-white/10 pb-16">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-[#1DB954]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1DB954]">Module_Profile_Config_v4.2</span>
        </div>
        <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.8]">
          System_Manifest
        </h1>
        <p className="max-w-xl text-white/30 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">
          Management of public entity descriptors and authentication badges. Manual synchronization of network nodes is required for broadcast accuracy.
        </p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-20">

        {/* Left Column: Avatar & Verify */}
        <div className="lg:col-span-4 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black text-[#1DB954]">01</span>
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Entity_Visual_ID</h2>
            </div>

            <div className="group relative">
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="relative aspect-square bg-black border border-white/10 overflow-hidden cursor-pointer isolate"
              >
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-10">
                    <Camera size={48} strokeWidth={1} />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 z-10">
                  {uploadingAvatar ? <Loader2 size={24} className="animate-spin text-[#1DB954]" /> : <Upload size={24} className="text-[#1DB954]" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Overwrite_Visual</span>
                </div>

                {/* Scanlines Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-10 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
              </div>

              {profile?.isVerified && (
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#1DB954] flex items-center justify-center shadow-xl z-30">
                  <BadgeCheck size={28} className="text-black" />
                </div>
              )}
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <div className="mt-8 p-4 border border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                <span>File_Format: JPG/PNG</span>
                <span>Max_Load: 5.0MB</span>
              </div>
            </div>
          </section>

          <section className={cn(
            "p-8 border relative isolate",
            profile?.isVerified ? "border-[#1DB954]/20 bg-[#1DB954]/5" : "border-white/10 bg-black"
          )}>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 bg-noise" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <BadgeCheck size={20} className={profile?.isVerified ? 'text-[#1DB954]' : 'text-white/20'} />
                <h3 className="text-sm font-black uppercase tracking-widest">{profile?.isVerified ? 'AUTHENTICATION_VERIFIED' : 'AUTH_BADGE_REQUEST'}</h3>
              </div>

              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-loose italic">
                {profile?.isVerified
                  ? 'This entity has been verified by the central administration node. Authentication status is active.'
                  : 'Verified status increases entity trust across broadcast nodes. Manual review by central node required.'}
              </p>

              {!profile?.isVerified && (
                <button
                  onClick={handleRequestVerify}
                  disabled={requestingVerify}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  {requestingVerify ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  TRANSMIT_VERIFY_REQUEST
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Info & Socials */}
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#1DB954]">02</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Core_Metadata_Descriptors</h2>
              <div className="flex-1 h-[1px] bg-white/5" />
              <Activity size={14} className="text-white/20" />
            </div>

            <div className="grid grid-cols-1 gap-10">
              <TechnicalInput
                label="Stage_Identity_Alias" index="ID_01"
                value={form.stageName} onChange={(e: any) => setForm((p) => ({ ...p, stageName: e.target.value }))}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-[#1DB954]">BIO_01</span>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Entity_Narrative_Descriptor</label>
                </div>
                <textarea
                  rows={6}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#1DB954] transition-all font-black uppercase tracking-widest resize-none placeholder:text-white/5"
                  placeholder="ENTER_ENTITY_BIO"
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#1DB954]">03</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Network_Node_Sychronization</h2>
              <div className="flex-1 h-[1px] bg-white/5" />
              <Globe size={14} className="text-white/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { key: 'website', label: 'Primary_Domain', index: 'NET_01', icon: Globe2 },
                { key: 'instagram', label: 'Instagram_ID', index: 'NET_02', icon: AtSign },
                { key: 'facebook', label: 'Facebook_Endpoint', index: 'NET_03', icon: Globe2 },
                { key: 'youtube', label: 'YouTube_Broadcast', index: 'NET_04', icon: Video },
                { key: 'tiktok', label: 'TikTok_Node', index: 'NET_05', icon: Zap },
              ].map(({ key, label, index, icon: Icon }) => (
                <div key={key} className="group relative">
                  <TechnicalInput
                    label={label} index={index}
                    value={(form.socialLinks as any)[key]}
                    onChange={(e: any) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }))}
                    placeholder={`NULL_POINTER_LINK`}
                  />
                  <div className="absolute top-2 right-2 opacity-10 group-focus-within:opacity-100 transition-opacity">
                    <Icon size={12} className="text-white group-focus-within:text-[#1DB954]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-12 border-t border-white/10 flex justify-end">
            <Button variant="spotify" className="h-20 px-16 group relative" disabled={saving}>
              <div className="flex items-center gap-4 relative z-10">
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                <span className="text-[16px] font-black uppercase tracking-[0.3em] italic">Commit_Manifest_Update</span>
              </div>
              {/* Design detail */}
              <div className="absolute top-0 right-0 p-1 opacity-20"><Zap size={12} /></div>
            </Button>
          </div>
        </div>
      </form>

      {/* Technical Footer Indicator */}
      <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-10">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">RingBeat // Profile_Node_End_Session</span>
        <div className="flex gap-4">
          <Activity size={12} />
          <Shield size={12} />
        </div>
      </footer>

    </div>
  );
};
