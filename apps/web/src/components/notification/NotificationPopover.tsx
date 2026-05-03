import { useEffect } from 'react';
import { useNotificationStore, Notification } from '../../stores/notification.store';
import { Bell, Check, Trash2, X as XIcon, AlertTriangle, Lock, Music, Cpu, Zap, Activity, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export const NotificationPopover = () => {
  const navigate = useNavigate();
  const { 
    notifications = [], 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    loading 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const safeNotifications = notifications || [];

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-[420px] bg-[#050505] border-2 border-white/20 shadow-[20px_20px_60px_rgba(0,0,0,0.9)] z-[100] overflow-hidden flex flex-col max-h-[600px] isolate">
      {/* ── Noise Overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-noise" />

      {/* ── Header ── */}
      <header className="p-6 border-b border-white/10 flex flex-col gap-4 relative z-10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#1db954]" />
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Signal_Buffer</h3>
           </div>
           <div className="flex items-center gap-2">
              <Activity size={12} className="text-[#1db954]" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#1db954]">Feed: Stable</span>
           </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Unread_Signals: {unreadCount}</span>
           {unreadCount > 0 && (
             <button 
               onClick={() => markAllAsRead()}
               className="text-[9px] font-black uppercase tracking-widest text-[#1db954] hover:text-black hover:bg-[#1db954] px-2 py-1 transition-all border border-transparent hover:border-[#1db954]"
             >
               Wipe_Signals_Status
             </button>
           )}
        </div>
      </header>

      {/* ── Notification List ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-[150px] relative z-10">
        {loading && safeNotifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-white/20 gap-4">
            <div className="w-12 h-[2px] bg-[#1db954] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Fetching_Data_Signals...</p>
          </div>
        ) : safeNotifications.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-white/10 gap-6 text-center">
             <div className="relative">
                <Bell size={48} strokeWidth={1} className="opacity-10" />
                <Zap size={16} className="absolute -top-2 -right-2 text-[#1db954] animate-pulse" />
             </div>
             <div className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-[0.3em]">No_Events_Logged</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">The system is currently in standby mode.</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {safeNotifications.map((n, idx) => (
                <motion.div
                  key={n._id || `notif-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NotificationItem 
                    notification={n} 
                    onClick={() => {
                      if (!n.isRead) markAsRead(n._id);
                      handleNotificationClick(n, navigate);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="p-4 border-t border-white/10 bg-black flex items-center justify-between relative z-10">
         <div className="flex items-center gap-4">
            <Database size={12} className="text-white/20" />
            <span className="text-[7px] font-black uppercase tracking-widest text-white/20 italic">Buffer_Sync: NOMINAL</span>
         </div>
         <div className="flex gap-4">
            <Cpu size={12} className="text-white/10" />
            <Zap size={12} className="text-white/10" />
         </div>
      </footer>
    </div>
  );
};

const NotificationItem = ({ 
  notification: n, 
  onClick,
  onDelete
}: { 
  notification: Notification, 
  onClick: () => void,
  onDelete: (e: React.MouseEvent) => void 
}) => {
  const isApproved = n.type.includes('APPROVED');
  const isRejected = n.type.includes('REJECTED') || n.type.includes('BANNED');
  const isWarning = n.type.includes('STRIKE');

  return (
    <div 
      onClick={onClick}
      className={cn(
        "px-6 py-5 flex gap-5 border-b border-white/5 transition-all cursor-pointer relative group overflow-hidden",
        !n.isRead ? "bg-white/[0.02]" : "hover:bg-white text-white hover:text-black"
      )}
    >
      {/* ── Type Indicator Strip ── */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-[3px] transition-all",
        !n.isRead ? (isApproved ? "bg-green-500" : isRejected ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-blue-500") : "bg-transparent group-hover:bg-black"
      )} />

      {/* ── Icon Area ── */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          "w-10 h-10 border flex items-center justify-center transition-colors",
          !n.isRead 
            ? "border-white/10 bg-white/5" 
            : "border-white/5 bg-transparent group-hover:border-black group-hover:bg-black/5"
        )}>
          {getTypeIcon(n.type, !n.isRead)}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <p className={cn(
            "text-[12px] font-black uppercase tracking-tighter truncate leading-none",
            !n.isRead ? "text-white" : "text-white/40 group-hover:text-black"
          )}>
            {n.title}
          </p>
          <div className="flex items-center gap-3">
            {!n.isRead && <div className="w-1.5 h-1.5 bg-[#1db954] animate-pulse" />}
            <button 
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 p-1 text-black/40 hover:text-red-600 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        
        <p className={cn(
          "text-[10px] font-black uppercase tracking-widest line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100",
          !n.isRead ? "text-white/60" : "text-white/20 group-hover:text-black/60"
        )}>
          {n.body}
        </p>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.02] group-hover:border-black/5">
           <div className="flex items-center gap-2">
              <Activity size={8} className={cn("opacity-20 group-hover:opacity-40", !n.isRead ? "text-[#1db954]" : "text-inherit")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest italic",
                !n.isRead ? "text-white/30" : "text-white/10 group-hover:text-black/20"
              )}>
                {dayjs(n.createdAt).fromNow()}
              </span>
           </div>
           <span className="text-[7px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-20 transition-opacity">Execute_Action_Now</span>
        </div>
      </div>
      
      {/* ── Hover Decoration ── */}
      <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-[#1db954] translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
    </div>
  );
};

const handleNotificationClick = (n: Notification, navigate: any) => {
  const { type, data } = n;
  
  if (type === 'NEW_RELEASE' || type === 'CONTENT_APPROVED') {
    if (data?.songId) {
      navigate(`/track/${data.songId}`);
    }
  } else if (type === 'ARTIST_VERIFIED') {
    if (data?.artistId) navigate(`/artist/${data.artistId}`);
  }
};

const getTypeIcon = (type: string, isUnread: boolean) => {
  const sizeClass = "w-4 h-4 transition-colors";
  const iconColor = isUnread ? "text-white" : "group-hover:text-black";
  
  switch (type) {
    case 'CONTENT_APPROVED': return <Check className={cn(sizeClass, iconColor)} />;
    case 'CONTENT_REJECTED': return <XIcon className={cn(sizeClass, iconColor)} />;
    case 'STRIKE_ISSUED': return <AlertTriangle className={cn(sizeClass, iconColor)} />;
    case 'ACCOUNT_BANNED': return <Lock className={cn(sizeClass, iconColor)} />;
    case 'NEW_RELEASE': return <Music className={cn(sizeClass, iconColor)} />;
    default: return <Bell className={cn(sizeClass, iconColor)} />;
  }
};
