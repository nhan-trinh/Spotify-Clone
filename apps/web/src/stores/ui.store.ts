import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isNowPlayingVisible: boolean;
  isSidebarVisible: boolean;
  toggleNowPlaying: () => void;
  setNowPlayingVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isNowPlayingVisible: false,
      isSidebarVisible: true,
      toggleNowPlaying: () => set((state) => ({ isNowPlayingVisible: !state.isNowPlayingVisible })),
      setNowPlayingVisible: (visible) => set({ isNowPlayingVisible: visible }),
      toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
      setSidebarVisible: (visible) => set({ isSidebarVisible: visible }),
    }),
    {
      name: 'spotify-ui-storage',
    }
  )
);
