import { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/player.store';
import { useUIStore } from '../../stores/ui.store';
import { useLibraryStore } from '../../stores/library.store';
import { api } from '../../lib/api';
import { X, Heart, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { CanvasPlayer } from './CanvasPlayer';
import { FastAverageColor } from 'fast-average-color';

export const NowPlayingSidebar = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { isNowPlayingVisible, setNowPlayingVisible } = useUIStore();
  const { isLiked, toggleLike, isFollowing, toggleFollow } = useLibraryStore();
  const [artist, setArtist] = useState<any>(null);
  const [bgColor, setBgColor] = useState('#121212');

  useEffect(() => {
    if (!currentTrack) return;
    setBgColor('#121212');
    setArtist(null);

    if (currentTrack.coverUrl) {
      const fac = new FastAverageColor();
      const imgUrl = `${currentTrack.coverUrl}${currentTrack.coverUrl.includes('?') ? '&' : '?'}cb=${Date.now()}`;
      fac.getColorAsync(imgUrl, { crossOrigin: 'anonymous' })
        .then(color => setBgColor(color.hex))
        .catch(() => setBgColor('#1a1a1a'))
        .finally(() => fac.destroy());
    }

    if (currentTrack.artistId) {
      api.get(`/artists/${currentTrack.artistId}`).then((res: any) => {
        setArtist(res.data);
      }).catch(() => {});
    }
  }, [currentTrack?.id, currentTrack?.artistId]);

  if (!isNowPlayingVisible || !currentTrack) return null;

  return (
    <aside className="w-[340px] flex-shrink-0 rounded-lg overflow-hidden relative"
      style={{ background: bgColor }}
    >
      {/* ══ LAYER 1: Canvas Video / Cover Image lót toàn bộ aside ══ */}
      {currentTrack.canvasUrl ? (
        <CanvasPlayer
          url={currentTrack.canvasUrl}
          isPlaying={isPlaying}
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <img
          key={currentTrack.id}
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
        />
      )}

      {/* ══ LAYER 2: Gradient overlay toàn aside — tăng đọc chữ ══ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75" />

      {/* ══ LAYER 3: Nút đóng (floating, không scroll) ══ */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest select-none drop-shadow">
          Đang phát
        </span>
        <button
          onClick={() => setNowPlayingVisible(false)}
          className="p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-white/80 hover:text-white transition-all backdrop-blur-sm"
        >
          <X size={18} />
        </button>
      </div>

      {/* ══ LAYER 4: Tất cả content scroll ĐÈ LÊN video ══ */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col">

        {/* Spacer: đẩy content xuống dưới → giống Spotify, thấy video trước */}
        <div className="flex-1 min-h-[55%]" />

        {/* Song title + artist row */}
        <div className="px-4 pt-2 pb-3">
          <h1 className="text-[22px] font-black text-white leading-tight drop-shadow-lg line-clamp-2 mb-1">
            <Link to={`/track/${currentTrack.id}`} className="hover:underline">
              {currentTrack.title}
            </Link>
          </h1>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-white/75 font-semibold truncate flex-1">
              <Link to={`/artist/${currentTrack.artistId}`} className="hover:underline hover:text-white">
                {currentTrack.artistName}
              </Link>
            </p>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => toggleLike(currentTrack.id, currentTrack.title)}
                className={cn(
                  "p-1.5 rounded-full transition-all hover:scale-110",
                  isLiked(currentTrack.id) ? "text-[#1db954]" : "text-white/80 hover:text-white"
                )}
              >
                <Heart size={20} className={isLiked(currentTrack.id) ? "fill-current" : ""} />
              </button>
              <button className="p-1.5 rounded-full text-white/80 hover:text-white transition-all">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* About Artist — đè lên video, bg mờ kính */}
        <div className="px-3 pb-3">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-xl group/card">
            <div className="h-48 w-full relative overflow-hidden">
              <img
                src={artist?.avatarUrl || currentTrack.coverUrl}
                className="w-full h-full object-cover brightness-75 group-hover/card:scale-110 transition-transform duration-[3s]"
                alt=""
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
              />
              <div className="absolute top-3 left-3 z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                  Giới thiệu về nghệ sĩ
                </p>
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-black text-base text-white drop-shadow tracking-tight">
                    {currentTrack.artistName}
                  </h3>
                  {artist?.isVerified && (
                    <CheckCircle2 size={14} className="text-[#3d91ff] fill-[#3d91ff]" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white/65">
                  {artist?.followersCount?.toLocaleString() || '0'} người theo dõi
                </span>
              </div>
            </div>

            <div className="px-4 py-3 space-y-3">
              {artist?.bio && (
                <p className="text-xs text-white/55 line-clamp-3 leading-relaxed">
                  {artist.bio}
                </p>
              )}
              <button
                onClick={() => artist?.id && toggleFollow(artist.id, currentTrack.artistName)}
                className={cn(
                  "w-full py-2 rounded-full font-bold text-sm transition-all active:scale-95 border",
                  isFollowing(currentTrack.artistId || '')
                    ? "bg-transparent text-white border-white/40 hover:border-white"
                    : "bg-white text-black border-white hover:bg-white/90"
                )}
              >
                {isFollowing(currentTrack.artistId || '') ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          </div>
        </div>

        {/* Credits — đè lên video */}
        <div className="px-3 pb-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">Thành phẩm</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {artist?.avatarUrl ? (
                  <img src={artist.avatarUrl} className="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold text-xs shrink-0">
                    {currentTrack.artistName?.[0] ?? '?'}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <Link
                    to={`/artist/${currentTrack.artistId}`}
                    className="text-sm font-bold hover:underline truncate text-white"
                  >
                    {currentTrack.artistName}
                  </Link>
                  <span className="text-xs text-white/50">Nghệ sĩ chính</span>
                </div>
              </div>
              <button
                onClick={() => artist?.id && toggleFollow(artist.id, currentTrack.artistName)}
                className={cn(
                  "shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ml-2",
                  isFollowing(currentTrack.artistId || '')
                    ? "text-white border-white/30 hover:border-white"
                    : "text-white border-white/50 hover:bg-white/10"
                )}
              >
                {isFollowing(currentTrack.artistId || '') ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};