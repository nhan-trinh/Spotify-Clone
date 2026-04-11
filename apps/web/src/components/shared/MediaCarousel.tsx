import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface MediaCarouselProps {
  children: React.ReactNode;
}

export const MediaCarousel = ({ children }: MediaCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      // Timeout để đợi scroll xong mới check lại nút
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className="group/carousel relative">
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {React.Children.map(children, (child) => (
          <div className="scroll-snap-align-start shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#282828] hover:bg-[#3e3e3e] text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#282828] hover:bg-[#3e3e3e] text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};
