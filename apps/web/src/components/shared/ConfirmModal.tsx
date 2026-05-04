import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { AlertTriangle, Trash2, Zap } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Execute_Purge',
  cancelText = 'Cancel_Process',
  variant = 'danger',
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'spotify' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-5">
              <Zap size={48} />
           </div>
           
           <div className={variant === 'danger' ? 'text-red-500' : 'text-[#1db954]'}>
              {variant === 'danger' ? <Trash2 size={32} strokeWidth={1.5} /> : <AlertTriangle size={32} strokeWidth={1.5} />}
           </div>
           
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Warning_Protocol</span>
              <p className="text-sm font-black uppercase tracking-widest text-white leading-relaxed">
                {message}
              </p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/10" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Manifest_Details</span>
           </div>
           <p className="text-[10px] text-white/40 uppercase tracking-widest leading-loose">
             This action is irreversible. Target data will be permanently purged from the local archive and primary node clusters. Authentication session verified.
           </p>
        </div>
      </div>
    </Modal>
  );
};
