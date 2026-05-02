import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'ringbeat_sidebar_sizes';

const DEFAULTS = {
  leftWidth: 300,
  rightWidth: 340,
};

const LIMITS = {
  left: { min: 200, max: 480 },
  right: { min: 260, max: 500 },
};

interface SidebarSizes {
  leftWidth: number;
  rightWidth: number;
}

function loadFromStorage(): SidebarSizes {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        leftWidth: Math.max(LIMITS.left.min, Math.min(LIMITS.left.max, parsed.leftWidth ?? DEFAULTS.leftWidth)),
        rightWidth: Math.max(LIMITS.right.min, Math.min(LIMITS.right.max, parsed.rightWidth ?? DEFAULTS.rightWidth)),
      };
    }
  } catch {}
  return DEFAULTS;
}

export const useSidebarResize = () => {
  const [sizes, setSizes] = useState<SidebarSizes>(loadFromStorage);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
  }, [sizes]);

  // ---------- LEFT SIDEBAR ----------
  const startLeftDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingLeft.current = true;
    startX.current = e.clientX;
    startWidth.current = sizes.leftWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sizes.leftWidth]);

  // ---------- RIGHT SIDEBAR ----------
  const startRightDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRight.current = true;
    startX.current = e.clientX;
    startWidth.current = sizes.rightWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sizes.rightWidth]);

  // ---------- GLOBAL MOUSE EVENTS ----------
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft.current) {
        const delta = e.clientX - startX.current;
        const newWidth = Math.max(
          LIMITS.left.min,
          Math.min(LIMITS.left.max, startWidth.current + delta)
        );
        setSizes(prev => ({ ...prev, leftWidth: newWidth }));
      }
      if (isDraggingRight.current) {
        // Right sidebar: dragging left increases width, dragging right decreases
        const delta = startX.current - e.clientX;
        const newWidth = Math.max(
          LIMITS.right.min,
          Math.min(LIMITS.right.max, startWidth.current + delta)
        );
        setSizes(prev => ({ ...prev, rightWidth: newWidth }));
      }
    };

    const onMouseUp = () => {
      if (isDraggingLeft.current || isDraggingRight.current) {
        isDraggingLeft.current = false;
        isDraggingRight.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const resetSizes = useCallback(() => setSizes(DEFAULTS), []);

  return {
    leftWidth: sizes.leftWidth,
    rightWidth: sizes.rightWidth,
    startLeftDrag,
    startRightDrag,
    resetSizes,
    limits: LIMITS,
  };
};
