import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { motion } from 'framer-motion';
import { Zap, Activity, Fingerprint, ChevronLeft, Loader2, Key, RefreshCw, Database } from 'lucide-react';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*[\d#?!&@$%\^&\*]).{10,}$/;

const resetSchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải gồm 6 chữ số.'),
  newPassword: z.string().min(10, 'Mật khẩu phải từ 10 kí tự').regex(passwordRegex, 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số (hoặc kí tự đặc biệt)'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPasswordPage = () => {
  const [serverMsg, setServerMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  const resetMutation = useMutation({
    mutationFn: async (data: ResetFormValues) => {
      return (await api.post('/auth/reset-password', { email, ...data })) as any;
    },
    onSuccess: () => {
      setServerMsg({ type: 'success', text: 'KEY_SYNC_SUCCESS: Credentials overwritten. Redirecting to Auth_Gate...' });
      setTimeout(() => navigate('/login'), 2500);
    },
    onError: (error: any) => {
      setServerMsg({ type: 'error', text: error.response?.data?.error?.message || 'SYNC_FAILURE: Validation key mismatched or buffer expired.' });
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = (data: ResetFormValues) => {
    setServerMsg(null);
    if (!email) {
      setServerMsg({ type: 'error', text: 'IDENTITY_MISSING: No target signal detected. Return to start.' });
      return;
    }
    resetMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white relative overflow-hidden selection:bg-[#1db954] selection:text-black font-sans">
      {/* ── Noise Texture Overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      {/* ── Editorial Background Elements ── */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none hidden lg:block">
        <span className="text-[15rem] font-black uppercase tracking-tighter italic leading-none">SYNC_v4</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10 h-full min-h-screen">

        {/* Left Side: Branding/Sync Manifest (Desktop only) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-16 border-r border-white/5 bg-white/[0.01]">
          <Link to="/" className="flex items-baseline gap-1 group">
            <span className="text-4xl font-black uppercase tracking-tighter text-white">Ring</span>
            <span className="text-4xl font-black uppercase tracking-tighter text-[#1db954]">Beat</span>
            <div className="w-2 h-2 bg-[#1db954] ml-2 animate-pulse" />
          </Link>

          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#1db954]" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">Sync_Protocol</span>
              </div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
                Credential<br />Overwrite
              </h2>
            </div>

            <div className="flex flex-col gap-6 opacity-30">
              <TechnicalReadout icon={RefreshCw} label="Process_State" value="Awaiting_Handshake" />
              <TechnicalReadout icon={Key} label="Credential_Type" value="Master_Security_Key" />
              <TechnicalReadout icon={Database} label="Target_Signal" value={email.slice(0, 15) + (email.length > 15 ? '...' : '')} />
            </div>
          </div>

          <div className="flex justify-between items-end opacity-20">
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">SYNC_GATE_09 // CLUSTER_PRIMARY</span>
            <div className="flex gap-4">
              <Zap size={12} />
              <Activity size={12} />
            </div>
          </div>
        </div>

        {/* Right Side: Reset Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-24 relative">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[420px] bg-white/[0.02] border border-white/5 p-8 lg:p-12 shadow-[40px_40px_100px_rgba(0,0,0,0.5)] relative"
          >
            {/* Terminal Corner Markers */}
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-[#1db954]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-white/20" />

            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[8px] font-black text-[#1db954] uppercase tracking-widest">HANDSHAKE_REQUIRED</span>
                <div className="h-[1px] flex-1 bg-[#1db954]/20" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                Key_Sync
              </h1>
              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 leading-relaxed italic">
                Verification code transmitted to node: <span className="text-white/60">{email}</span>. Initialize overwrite sequence below.
              </p>
            </div>

            {serverMsg && (
              <div className={`mb-8 border ${serverMsg.type === 'error' ? 'border-[#e22134]/30 bg-[#e22134]/5' : 'border-[#1db954]/30 bg-[#1db954]/5'} px-4 py-3`}>
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 ${serverMsg.type === 'error' ? 'bg-[#e22134]' : 'bg-[#1db954]'} animate-pulse`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${serverMsg.type === 'error' ? 'text-[#e22134]' : 'text-[#1db954]'}`}>
                    {serverMsg.text}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label htmlFor="otp" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Handshake_Code (OTP)</Label>
                  <span className="text-[7px] font-black text-[#1db954]/40 uppercase tracking-widest">Awaiting_Input</span>
                </div>
                <Input
                  id="otp"
                  maxLength={6}
                  placeholder="000000"
                  className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-2xl font-black tracking-[1em] text-center focus-visible:ring-0 focus-visible:border-[#1db954] transition-all hover:border-white placeholder:text-white/10"
                  {...register('otp')}
                  error={!!errors.otp}
                />
                {errors.otp && <p className="text-[9px] font-black uppercase tracking-widest text-[#e22134] mt-2 italic">_{errors.otp.message}</p>}
              </div>

              {/* New Password Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label htmlFor="newPassword" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Master_Key_Overwrite</Label>
                  <span className="text-[7px] font-black text-[#1db954]/40 uppercase tracking-widest">Encrypted_Write</span>
                </div>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••••••"
                  className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-lg font-black tracking-widest focus-visible:ring-0 focus-visible:border-[#1db954] transition-all hover:border-white placeholder:text-white/10"
                  {...register('newPassword')}
                  error={!!errors.newPassword}
                />
                {errors.newPassword && <p className="text-[9px] font-black uppercase tracking-widest text-[#e22134] mt-2 italic leading-relaxed">_{errors.newPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full bg-[#1db954] text-black h-14 font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-[8px_8px_0px_rgba(29,185,84,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {resetMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synchronizing...
                  </>
                ) : 'Execute_Overwrite'}
              </button>
            </form>

            <div className="mt-12 text-center">
              <Link to="/login" className="flex items-center justify-center gap-2 text-[10px] font-black text-white/30 hover:text-[#1db954] uppercase tracking-[0.2em] transition-colors">
                <ChevronLeft size={12} />
                Return_to_Auth_Gate
              </Link>
            </div>
          </motion.div>

          {/* Mobile Footer Decor */}
          <div className="mt-12 lg:hidden opacity-20 flex flex-col items-center gap-2">
            <span className="text-[7px] font-black uppercase tracking-[0.5em]">RingBeat Credential Sync // v4.0.1</span>
            <Fingerprint size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnicalReadout = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 flex items-center justify-center border border-white/10 bg-white/[0.02]">
      <Icon size={14} className="text-[#1db954]" />
    </div>
    <div className="flex flex-col">
      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40">{label}</span>
      <span className="text-[11px] font-black uppercase tracking-widest text-white">{value}</span>
    </div>
  </div>
);
