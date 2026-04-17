import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface CanvasPlayerProps {
  url: string;
  isPlaying?: boolean;
  onDimensionsReady?: (width: number, height: number) => void;
  className?: string;
  poster?: string;
}

export const CanvasPlayer = ({ url, isPlaying = true, onDimensionsReady, className, poster }: CanvasPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
    setIsLoaded(false);
  }, [url]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy might block or video not ready
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, isLoaded]);

  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        preload="auto"
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          if (onDimensionsReady) {
            onDimensionsReady(video.videoWidth, video.videoHeight);
          }
        }}
        className="w-full h-full object-cover"
      />
      
      {/* Loading Overlay (Chỉ hiện nếu thực sự không có poster) */}
      {!isLoaded && !poster && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
           <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
