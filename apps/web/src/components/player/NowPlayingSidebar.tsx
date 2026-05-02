import { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/player.store';
import { useUIStore } from '../../stores/ui.store';
import { useLibraryStore } from '../../stores/library.store';
import { api } from '../../lib/api';
import { X, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CanvasPlayer } from './CanvasPlayer';
import { FastAverageColor } from 'fast-average-color';

export const NowPlayingSidebar = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { isNowPlayingVisible, setNowPlayingVisible } = useUIStore();
  const { isLiked, toggleLike, isFollowing, toggleFollow } = useLibraryStore();
  const [artist, setArtist] = useState<any>(null);
  const [bgColor, setBgColor] = useState('#000000');

  useEffect(() => {
    if (!currentTrack) return;
    setBgColor('#000000');
    setArtist(null);

    // Lấy màu từ cover nếu không có canvas
    if (currentTrack.coverUrl && !currentTrack.canvasUrl) {
      const fac = new FastAverageColor();
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      // Thêm cache buster để tránh lỗi CORS nếu ảnh đã được cache mà không có header CORS
      img.src = `${currentTrack.coverUrl}${currentTrack.coverUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;

      img.onload = () => {
        try {
          const color = fac.getColor(img);
          // Làm tối màu đi một chút để giữ vibe Brutalism
          setBgColor(color.hex);
        } catch (err) {
          setBgColor('#121212');
        } finally {
          fac.destroy();
        }
      };
      img.onerror = () => {
        setBgColor('#121212');
        fac.destroy();
      };
    }

    if (currentTrack.artistId) {
      api.get(`/artists/${currentTrack.artistId}`).then((res: any) => {
        setArtist(res.data);
      }).catch(() => { });
    }
  }, [currentTrack?.id, currentTrack?.artistId, currentTrack?.canvasUrl]);

  if (!currentTrack) return null;

  return (
    <aside
      className={cn(
        "w-full h-full flex-shrink-0 relative overflow-hidden group/now-sidebar flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isNowPlayingVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}
      style={{
        backgroundColor: currentTrack.canvasUrl ? '#000000' : bgColor,
        backgroundImage: currentTrack.canvasUrl ? 'none' : `linear-gradient(to bottom, ${bgColor}44, #000000)`
      }}
    >
      {/* 1. Background Layer: Video Canvas */}
      {currentTrack.canvasUrl && (
        <div className="absolute inset-0 z-0">
          <CanvasPlayer
            url={currentTrack.canvasUrl}
            poster={currentTrack.coverUrl}
            isPlaying={isPlaying}
            className="w-full h-full object-cover grayscale opacity-40 group-hover/now-sidebar:grayscale-0 group-hover/now-sidebar:opacity-60 transition-all duration-1000"
          />
          {/* Brutalist Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      {/* 2. Texture Overlay (Grain) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 3. Giant Editorial Typography (Background) */}
      <div className="absolute -left-12 top-1/4 select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap z-0">
        <span className="text-[120px] font-black text-white/[0.03] tracking-tighter uppercase leading-none">
          {currentTrack.title}
        </span>
      </div>

      {/* 4. Header - Editorial Style */}
      <div className="p-6 pb-4 flex items-center justify-between border-b-2 border-white/10 relative z-20">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-black text-white leading-none tracking-tighter uppercase flex items-center gap-3">
            Playing
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-[#1db954]" />
            <span className="text-[8px] font-black text-[#444] uppercase tracking-[0.4em]">Visual Stream // 4.0</span>
          </div>
        </div>
        <button
          onClick={() => setNowPlayingVisible(false)}
          className="p-2 text-[#222] hover:text-white transition-all hover:scale-110 active:rotate-180"
        >
          <X size={28} strokeWidth={3} />
        </button>
      </div>

      {/* 5. Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-20">
        <div className="p-8 space-y-16">

          {/* Spacer if Canvas is present to show video */}
          {currentTrack.canvasUrl && <div className="h-[25vh]" />}

          {/* MAIN SONG SECTION */}
          <section className="relative">
            {/* Indexing */}
            <div className="text-[10px] font-black text-[#1db954] mb-4 tracking-[0.5em] uppercase">
              Now Capturing
            </div>

            <div className="space-y-6">
              {!currentTrack.canvasUrl && (
                <div className="relative aspect-square w-full mb-8 shadow-[15px_15px_0px_rgba(255,255,255,0.02)] border border-white/10 overflow-hidden group/cover">
                  <img src={currentTrack.coverUrl} className="w-full h-full object-cover grayscale group-hover/cover:grayscale-0 transition-all duration-1000" alt="" />
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-[32px] font-black text-white leading-[0.9] tracking-tighter uppercase break-words mb-4">
                    {currentTrack.title}
                  </h1>
                  <p className="text-[14px] font-black text-[#666] uppercase tracking-[0.2em]">
                    {currentTrack.artistName}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(currentTrack.id, currentTrack.title)}
                  className={cn(
                    "shrink-0 transition-transform active:scale-75",
                    isLiked(currentTrack.id) ? "text-[#1db954]" : "text-[#222] hover:text-white"
                  )}
                >
                  <Heart size={32} className={isLiked(currentTrack.id) ? "fill-current" : ""} strokeWidth={3} />
                </button>
              </div>

              {/* Industrial Metadata Row */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-[#222] uppercase tracking-[0.3em] mb-1">Encoding</span>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">FLAC / 1411kbps</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-[#222] uppercase tracking-[0.3em] mb-1">Release</span>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">2024.Q2</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-[#222] uppercase tracking-[0.3em] mb-1">License</span>
                  <span className="text-[9px] font-black text-[#1db954] uppercase tracking-widest">Premium Log</span>
                </div>
              </div>
            </div>
          </section>

          {/* ARTIST PROFILE SECTION */}
          <section className="space-y-8">
            <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
              Profile Archive
              <div className="flex-1 h-[1px] bg-white/5" />
            </h3>

            <div className="bg-white/[0.02] border border-white/10 relative overflow-hidden group/artist-card">
              <div className="h-64 w-full relative overflow-hidden">
                <img
                  src={artist?.avatarUrl || currentTrack.coverUrl}
                  className="w-full h-full object-cover grayscale group-hover/artist-card:grayscale-0 transition-all duration-[2s] brightness-50 group-hover/artist-card:brightness-100"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                {/* Editorial Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-black text-[8px] font-black px-3 py-1 uppercase tracking-[0.3em]">
                    Verified Entity
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-[24px] font-black text-white uppercase tracking-tighter leading-none mb-2">
                      {currentTrack.artistName}
                    </h3>
                    <span className="text-[9px] font-black text-[#444] uppercase tracking-[0.2em]">
                      {artist?.followersCount?.toLocaleString() || '0'} Total Listeners
                    </span>
                  </div>
                  <button
                    onClick={() => artist?.id && toggleFollow(artist.id, currentTrack.artistName)}
                    className={cn(
                      "px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2",
                      isFollowing(currentTrack.artistId || '')
                        ? "bg-transparent text-white border-white/20 hover:border-white"
                        : "bg-[#1db954] text-black border-[#1db954] hover:bg-white hover:border-white"
                    )}
                  >
                    {isFollowing(currentTrack.artistId || '') ? 'Following' : 'Follow'}
                  </button>
                </div>

                {artist?.bio && (
                  <p className="text-[11px] text-[#666] font-bold leading-relaxed uppercase tracking-tight line-clamp-4">
                    {artist.bio}
                  </p>
                )}
              </div>

              {/* Asymmetric Decor */}
              <div className="absolute bottom-0 right-0 w-24 h-24 text-[120px] font-black text-white/[0.02] -mb-10 -mr-6 italic">
                BIO
              </div>
            </div>
          </section>

          {/* CREDITS SECTION */}
          <section className="space-y-8 pb-12">
            <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
              Credits & Log
              <div className="flex-1 h-[1px] bg-white/5" />
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 group/credit transition-all hover:bg-white/[0.03]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1db954] text-black font-black flex items-center justify-center text-[20px]">
                    {currentTrack.artistName?.[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-white uppercase tracking-tight">{currentTrack.artistName}</span>
                    <span className="text-[8px] font-black text-[#444] uppercase tracking-widest mt-1">Lead Architect / Vocals</span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-white/5 italic">PRIMARY</div>
              </div>

              <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 group/credit transition-all hover:bg-white/[0.03]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 border-2 border-white/10 text-white/10 font-black flex items-center justify-center text-[20px]">
                    RB
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-white uppercase tracking-tight">RingBeat Studios</span>
                    <span className="text-[8px] font-black text-[#444] uppercase tracking-widest mt-1">Production / Distribution</span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-white/5 italic">FACILITY</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};
