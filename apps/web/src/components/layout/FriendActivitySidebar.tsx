import { useUIStore } from '../../stores/ui.store';
import { useFriendStore } from '../../stores/friend.store';
import { X, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const Equalizer = () => (
  <div className="flex items-end gap-[1px] h-3 w-3 mb-0.5">
    <div className="w-[2px] bg-[#1db954] animate-music-bar" style={{ animationDuration: '0.4s' }} />
    <div className="w-[2px] bg-[#1db954] animate-music-bar" style={{ animationDuration: '0.7s' }} />
    <div className="w-[2px] bg-[#1db954] animate-music-bar" style={{ animationDuration: '0.5s' }} />
  </div>
);

export const FriendActivitySidebar = () => {
  const { isFriendActivityVisible, setFriendActivityVisible } = useUIStore();
  const { activities, isLoading } = useFriendStore();

  return (
    <aside className={cn(
      "w-full h-full flex-shrink-0 bg-black flex flex-col border-l-2 border-white/10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group/sidebar",
      isFriendActivityVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
    )}>
      {/* Texture Overlay (Grain) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-noise" />

      {/* Giant Background Label (Editorial Style) */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center rotate-90 whitespace-nowrap">
        <span className="text-[140px] font-black text-white/[0.02] tracking-tighter uppercase leading-none">
          Friends
        </span>
      </div>

      {/* Header - Editorial Style */}
      <div className="p-8 pb-6 flex items-center justify-between border-b-2 border-white/10 relative z-10">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-black text-white leading-none tracking-tighter uppercase flex items-center gap-3">
            Activity
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-[#1db954]" />
            <span className="text-[8px] font-black text-[#444] uppercase tracking-[0.4em]">Live Log // 0.2.0</span>
          </div>
        </div>
        <button
          onClick={() => setFriendActivityVisible(false)}
          className="p-2 text-[#222] hover:text-white transition-all hover:scale-110 active:rotate-180"
        >
          <X size={28} strokeWidth={3} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {isLoading && activities.length === 0 ? (
          <div className="p-8 space-y-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-white/5 w-3/4" />
                  <div className="h-2 bg-white/5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-10 text-center mt-20">
            <div className="inline-block p-8 border-2 border-white/10 mb-8 relative group/btn">
              <Users size={48} className="text-[#222] group-hover/btn:text-[#1db954] transition-colors" />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />
            </div>
            <p className="text-[11px] text-[#444] font-black uppercase tracking-[0.25em] leading-relaxed mb-10 max-w-[200px] mx-auto">
              Synchronize with your network to discover collective rhythms.
            </p>
            <Link
              to="/search"
              className="inline-block px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#1db954] transition-all relative"
            >
              Initialize Search
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {activities.map((activity, idx) => (
              <div
                key={activity.user.id}
                className="group/item flex gap-5 p-6 border-b border-white/5 hover:bg-white/[0.03] transition-all relative cursor-pointer overflow-hidden"
              >
                {/* Index Number (Editorial) */}
                <div className="absolute left-1 top-1 text-[8px] font-black text-white/5">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>

                {/* Avatar - Editorial Grayscale */}
                <div className="relative shrink-0">
                  <Link to={`/profile/${activity.user.id}`} className="block relative">
                    <div className="absolute inset-0 border-2 border-transparent group-hover/item:border-[#1db954]/50 transition-all duration-500 z-10" />
                    <img
                      src={activity.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user.name)}&background=random`}
                      alt={activity.user.name}
                      className="w-16 h-16 object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700 brightness-75 group-hover/item:brightness-100"
                    />
                    {/* Activity Pulse */}
                    {activity.isPlaying && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black flex items-center justify-center z-20">
                        <div className="w-2 h-2 bg-[#1db954] animate-pulse" />
                      </div>
                    )}
                  </Link>
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-baseline justify-between gap-1 mb-2">
                    <Link
                      to={`/profile/${activity.user.id}`}
                      className="text-[16px] font-black text-white uppercase tracking-tighter hover:text-[#1db954] transition-colors truncate"
                    >
                      {activity.user.name}
                    </Link>
                    <span className="text-[8px] text-[#333] font-black uppercase tracking-widest shrink-0">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: false, locale: vi })}
                    </span>
                  </div>

                  {activity.currentSong ? (
                    <div className="space-y-1 relative">
                      <div className={cn(
                        "text-[12px] font-black truncate flex items-center gap-3 tracking-tight transition-colors",
                        activity.isPlaying ? "text-white" : "text-[#444]"
                      )}>
                        {activity.isPlaying && <Equalizer />}
                        <span className="truncate">{activity.currentSong.title}</span>
                      </div>
                      <p className="text-[9px] text-[#222] font-black uppercase tracking-[0.2em] truncate group-hover/item:text-white/40 transition-colors">
                        {activity.currentSong.artistName}
                      </p>

                      {/* Industrial Detail */}
                      <div className="flex items-center gap-4 mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <div className="text-[7px] font-black text-[#1db954] uppercase tracking-widest">320kbps / Stereo</div>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <div className="text-[7px] font-black text-white/20 uppercase tracking-widest">Direct Link</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-[#222] font-black uppercase tracking-[0.3em]">Status: Offline</span>
                      <div className="flex-1 h-[1px] bg-white/[0.02]" />
                    </div>
                  )}
                </div>

                {/* Brutalist Hover Accent */}
                <div className="absolute right-0 top-0 bottom-0 w-[0px] bg-[#1db954] group-hover/item:w-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>


    </aside>
  );
};
