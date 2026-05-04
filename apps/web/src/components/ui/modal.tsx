import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md'
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      timer = setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen && !animate) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
      animate ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent pointer-events-none'
    }`}>
      <div 
        className={`bg-black w-full ${sizeClasses[size]} rounded-none border border-white/20 shadow-[40px_40px_0px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 transform relative isolate ${
          animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Texture Layer */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0 bg-noise" />
        
        {/* Scanlines */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-[#1db954] uppercase tracking-[0.5em]">System_Prompt</span>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{title}</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-white/20 hover:text-white p-2 transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 py-8">
            {children}
          </div>

          {footer ? (
            <div className="px-8 py-6 border-t border-white/10 flex items-center justify-end gap-6 bg-white/[0.01]">
              {footer}
            </div>
          ) : (
            <div className="px-8 pb-8 flex items-center justify-end gap-6">
              <Button variant="ghost" onClick={onClose} className="hover:bg-white/5">Cancel_Process</Button>
              <Button onClick={onClose}>Execute_Action</Button>
            </div>
          )}
        </div>

        {/* Technical Decor */}
        <div className="absolute bottom-2 left-2 flex gap-1 opacity-20">
           <div className="w-1 h-1 bg-white" />
           <div className="w-1 h-1 bg-white" />
           <div className="w-1 h-1 bg-[#1db954]" />
        </div>
      </div>
    </div>
  );
};
