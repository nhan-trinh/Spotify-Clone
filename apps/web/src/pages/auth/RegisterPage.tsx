import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuthMutation';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Icons } from '../../components/ui/icons';
import { CheckCircle2, XCircle, ChevronLeft, Loader2, Zap, Activity, Database, Globe, Fingerprint, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*[\d#?!&@$%\^&\*]).{10,}$/;

const step1Schema = z.object({ email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ') });
const step2Schema = z.object({ password: z.string().min(10, 'Mật khẩu từ 10 kí tự').regex(passwordRegex, 'Thêm 1 chữ số hoặc kí tự đặc biệt') });
const step3Schema = z.object({
  name: z.string().min(1, 'Nhập tên cho hồ sơ'),
  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh hợp lệ'),
  gender: z.enum(['man', 'woman', 'non-binary', 'prefer-not-to-say'], { required_error: 'Vui lòng chọn giới tính' }),
});

export const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({});
  const [serverMsg, setServerMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const formStep1 = useForm({ resolver: zodResolver(step1Schema) });
  const formStep2 = useForm({ resolver: zodResolver(step2Schema), defaultValues: { password: '' } });
  const formStep3 = useForm({ resolver: zodResolver(step3Schema) });

  const passwordValue = formStep2.watch('password');
  const hasLetter = /[a-zA-Z]/.test(passwordValue || '');
  const hasNumberOrSpecials = /[\d#?!&@$%\^&\*]/.test(passwordValue || '');
  const hasMinLength = (passwordValue || '').length >= 10;
  const isPasswordValid = hasLetter && hasNumberOrSpecials && hasMinLength;

  const handleNext1 = async (data: any) => {
    setIsCheckingEmail(true);
    setServerMsg(null);
    try {
      const res = await api.post('/auth/check-email', { email: data.email }) as any;
      if (res.data?.exists) {
        formStep1.setError('email', { type: 'manual', message: 'IDENTITY_CONFLICT: Email already registered in registry.' });
      } else {
        setFormData({ ...formData, ...data });
        setStep(2);
      }
    } catch (error) {
      setServerMsg({ type: 'error', text: 'REGISTRY_ERROR: Connection failed during verification.' });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleNext2 = (data: any) => { setFormData({ ...formData, ...data }); setStep(3); };

  const handleFinalSubmit = (data: any) => {
    const finalData = { ...formData, ...data };
    registerMutation.mutate(finalData, {
      onSuccess: () => {
        setServerMsg({ type: 'success', text: 'REGISTRY_SUCCESS: Identity manifesting. Redirecting...' });
        setTimeout(() => navigate('/verify-email', { state: { email: finalData.email } }), 2000);
      },
      onError: (error: any) => {
        setServerMsg({ type: 'error', text: error.response?.data?.error?.message || 'REGISTRY_FAILURE: Data corruption detected.' });
      },
    });
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white relative overflow-hidden selection:bg-[#1db954] selection:text-black font-sans">
      {/* ── Noise Texture Overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      {/* ── Editorial Background Elements ── */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none hidden lg:block">
        <span className="text-[15rem] font-black uppercase tracking-tighter italic leading-none">REG_v4</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10 h-full min-h-screen">

        {/* Left Side: Branding/Identity Creation (Desktop only) */}
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
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1db954]">Creation_Protocol</span>
              </div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
                New Entity<br />Registration
              </h2>
            </div>

            <div className="flex flex-col gap-6 opacity-30">
              <TechnicalReadout icon={Database} label="Registry_Mode" value="Direct_Initialize" />
              <TechnicalReadout icon={Globe} label="Auth_Node" value="External_OAuth_v1" />
              <TechnicalReadout icon={ShieldCheck} label="Security_Level" value="Tier_01_Identity" />
            </div>
          </div>

          <div className="flex justify-between items-end opacity-20">
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">INIT_G_77 // CLUSTER_PRIMARY</span>
            <div className="flex gap-4">
              <Zap size={12} />
              <Activity size={12} />
            </div>
          </div>
        </div>

        {/* Right Side: Multi-step Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-24 relative overflow-y-auto">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[420px] bg-white/[0.02] border border-white/5 p-8 lg:p-12 shadow-[40px_40px_100px_rgba(0,0,0,0.5)] relative"
          >
            {/* Terminal Corner Markers */}
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-[#1db954]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-white/20" />

            {/* Progress PHASE Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-[#1db954] uppercase tracking-widest">PHASE_0{step}/03</span>
                  <div className="w-8 h-[1px] bg-[#1db954]/40" />
                </div>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">REGISTRY_INIT</span>
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                {step === 1 ? 'Manifest_ID' : step === 2 ? 'Key_Init' : 'Entity_Data'}
              </h1>
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

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <form onSubmit={formStep1.handleSubmit(handleNext1)} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Registered_Email</Label>
                      <Input
                        id="email"
                        placeholder="IDENTITY@DOMAIN.COM"
                        className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-lg font-black tracking-tighter focus-visible:ring-0 focus-visible:border-[#1db954] transition-all hover:border-white placeholder:text-white/10 uppercase"
                        {...formStep1.register('email')}
                        error={!!formStep1.formState.errors.email}
                      />
                      {formStep1.formState.errors.email && <p className="text-[9px] font-black uppercase tracking-widest text-[#e22134] mt-2 italic">_{formStep1.formState.errors.email.message as string}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isCheckingEmail}
                      className="w-full bg-[#1db954] text-black h-14 font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-[8px_8px_0px_rgba(29,185,84,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isCheckingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Execute_Phase_01'}
                    </button>
                  </form>

                  <div className="flex items-center gap-4 my-10">
                    <div className="flex-1 h-[1px] bg-white/5"></div>
                    <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">External_Links</span>
                    <div className="flex-1 h-[1px] bg-white/5"></div>
                  </div>

                  <button
                    type="button"
                    className="w-full border border-white/10 h-14 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all bg-black"
                    onClick={handleGoogleRegister}
                  >
                    <Icons.google className="h-4 w-4" />
                    Register with Google
                  </button>

                  <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Identity Already Confirmed?</p>
                    <Link to="/login" className="text-[11px] font-black text-[#1db954] uppercase tracking-[0.3em] hover:text-white transition-colors border-b-2 border-[#1db954]/20 pb-1">
                      Return_to_Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-[9px] font-black text-white/30 hover:text-[#1db954] transition-colors uppercase tracking-[0.2em]">
                      <ChevronLeft size={12} /> Return_to_Phase_01
                    </button>
                  </div>

                  <form onSubmit={formStep2.handleSubmit(handleNext2)} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Security_Key_Init</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••••••"
                        className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-lg font-black tracking-widest focus-visible:ring-0 focus-visible:border-[#1db954] transition-all hover:border-white placeholder:text-white/10"
                        {...formStep2.register('password')}
                        error={!!formStep2.formState.errors.password}
                      />

                      <div className="grid grid-cols-1 gap-2 pt-4">
                        <ValidationItem label="1 ALPHA_CHAR" valid={hasLetter} active={!!passwordValue} />
                        <ValidationItem label="1 NUM_OR_SPEC_CHAR" valid={hasNumberOrSpecials} active={!!passwordValue} />
                        <ValidationItem label="MIN_10_UNITS" valid={hasMinLength} active={!!passwordValue} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isPasswordValid}
                      className="w-full bg-[#1db954] text-black h-14 font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-[8px_8px_0px_rgba(29,185,84,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-30"
                    >
                      Execute_Phase_02
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-[9px] font-black text-white/30 hover:text-[#1db954] transition-colors uppercase tracking-[0.2em]">
                      <ChevronLeft size={12} /> Return_to_Phase_02
                    </button>
                  </div>

                  <form onSubmit={formStep3.handleSubmit(handleFinalSubmit)} className="space-y-8 pb-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Entity_Alias</Label>
                      <Input
                        id="name"
                        className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-lg font-black tracking-tighter focus-visible:ring-0 focus-visible:border-[#1db954] transition-all"
                        {...formStep3.register('name')}
                        error={!!formStep3.formState.errors.name}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Origination_Date</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="rounded-none border-x-0 border-t-0 border-b border-white/20 h-14 bg-transparent text-lg font-black tracking-tighter focus-visible:ring-0 focus-visible:border-[#1db954] transition-all invert"
                        {...formStep3.register('dateOfBirth')}
                        error={!!formStep3.formState.errors.dateOfBirth}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Entity_Categorization</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {['man', 'woman', 'non-binary', 'prefer-not-to-say'].map((g) => (
                          <label key={g} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] cursor-pointer group transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{g.replace(/-/g, '_')}</span>
                            <input type="radio" value={g} {...formStep3.register('gender')} className="accent-[#1db954] w-3 h-3" />
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full bg-[#1db954] text-black h-14 font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-[8px_8px_0px_rgba(29,185,84,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Finalize_Registration'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-12 lg:hidden opacity-20 flex flex-col items-center gap-2">
            <span className="text-[7px] font-black uppercase tracking-[0.5em]">RingBeat Registry Core // v4.0.1</span>
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

const ValidationItem = ({ label, valid, active }: { label: string; valid: boolean; active: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={cn(
      "text-[8px] font-black uppercase tracking-[0.2em] transition-colors",
      active ? (valid ? "text-[#1db954]" : "text-[#e22134]") : "text-white/20"
    )}>
      {label}
    </span>
    {active && (
      valid ? <CheckCircle2 size={10} className="text-[#1db954]" /> : <XCircle size={10} className="text-[#e22134]" />
    )}
  </div>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
