import { useState, useEffect } from 'react';

export type RecentSearchItem = {
  id: string;
  type: 'song' | 'artist' | 'album' | 'playlist' | 'profile' | 'query';
  title: string;
  subtitle?: string;
  coverUrl?: string;
  query?: string;
  timestamp: number;
};

const RECENT_SEARCH_KEY = 'ringbeat_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCH_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  const saveToStorage = (items: RecentSearchItem[]) => {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(items));
    setRecentSearches(items);
  };

  const addItem = (item: Omit<RecentSearchItem, 'timestamp'>) => {
    const newItem: RecentSearchItem = { ...item, timestamp: Date.now() };
    
    // Remove if already exists (to bring it to the top)
    const filtered = recentSearches.filter(
      (i) => !(i.id === newItem.id && i.type === newItem.type)
    );
    
    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    saveToStorage(updated);
  };

  const removeItem = (id: string, type: string) => {
    const updated = recentSearches.filter((i) => !(i.id === id && i.type === type));
    saveToStorage(updated);
  };

  const clearAll = () => {
    saveToStorage([]);
  };

  return {
    recentSearches,
    addItem,
    removeItem,
    clearAll,
  };
};
