import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'ringbeat_pinned_items';
const MAX_PINS = 5;

export interface PinnedItem {
  id: string;
  type: 'playlist' | 'album' | 'artist';
  title: string;
  coverUrl?: string | null;
}

// ── Guard: only write if parse succeeded (isLoaded flag) ──
let _storageLoaded = false;

function load(): PinnedItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    _storageLoaded = true;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    _storageLoaded = false; // mark as failed → skip persistence
    return [];
  }
}

export const usePinnedItems = () => {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(load);

  // Use a Set ref for O(1) isPinned lookup — avoids .some() recreation on every render
  const pinnedIdsRef = useRef<Set<string>>(new Set(pinnedItems.map(p => p.id)));

  // Sync ref whenever state changes
  useEffect(() => {
    pinnedIdsRef.current = new Set(pinnedItems.map(p => p.id));
    // Guard: only persist if initial load was successful
    if (_storageLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedItems));
      } catch {
        // Quota exceeded or private mode — fail silently
      }
    }
  }, [pinnedItems]);

  const pin = useCallback((item: PinnedItem): boolean => {
    let replaced = false;
    setPinnedItems(prev => {
      if (prev.find(p => p.id === item.id)) return prev; // already pinned
      if (prev.length >= MAX_PINS) {
        replaced = true;
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });
    // Notify user when oldest pin was silently evicted
    // (replaced is set synchronously before React batches the state update)
    if (replaced) {
      toast(`Đã đạt giới hạn ${MAX_PINS} ghim — ghim cũ nhất đã được xóa`, {
        icon: '📌', duration: 3000,
      });
    }
    return !replaced;
  }, []);

  const unpin = useCallback((id: string) => {
    setPinnedItems(prev => prev.filter(p => p.id !== id));
  }, []);

  // Stable reference — reads from ref, not closure over state
  const isPinned = useCallback((id: string): boolean => {
    return pinnedIdsRef.current.has(id);
  }, []); // no deps: ref never changes identity

  const togglePin = useCallback((item: PinnedItem) => {
    if (pinnedIdsRef.current.has(item.id)) {
      unpin(item.id);
    } else {
      pin(item);
    }
  }, [pin, unpin]);

  return { pinnedItems, pin, unpin, isPinned, togglePin, maxPins: MAX_PINS };
};
