import { create } from 'zustand';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface LibraryState {
  likedSongIds: Set<string>;
  followedArtistIds: Set<string>;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  toggleLike: (songId: string, songTitle?: string) => Promise<void>;
  toggleFollow: (artistId: string, artistName?: string) => Promise<void>;
  isLiked: (songId: string) => boolean;
  isFollowing: (artistId: string) => boolean;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedSongIds: new Set(),
  followedArtistIds: new Set(),
  isHydrated: false,

  hydrate: async () => {
    try {
      const res = await api.get('/users/library') as any;
      const data = res.data;
      set({
        likedSongIds: new Set(data.likedSongIds || []),
        followedArtistIds: new Set(data.followedArtistIds || []),
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  toggleLike: async (songId: string, songTitle?: string) => {
    const { likedSongIds } = get();
    const wasLiked = likedSongIds.has(songId);

    // Optimistic update
    const newSet = new Set(likedSongIds);
    if (wasLiked) {
      newSet.delete(songId);
    } else {
      newSet.add(songId);
    }
    set({ likedSongIds: newSet });

    // Show toast immediately
    if (!wasLiked) {
      toast.success(
        songTitle ? `Đã thêm "${songTitle}" vào Bài hát đã thích` : 'Đã thêm vào Bài hát đã thích',
        {
          icon: '💚',
          duration: 2500,
        }
      );
    } else {
      toast(
        songTitle ? `Đã xóa "${songTitle}" khỏi Bài hát đã thích` : 'Đã xóa khỏi Bài hát đã thích',
        { duration: 2000 }
      );
    }

    try {
      if (wasLiked) {
        await api.delete(`/songs/${songId}/like`);
      } else {
        await api.post(`/songs/${songId}/like`);
      }
    } catch (err: any) {
      // Revert nếu lỗi API
      set({ likedSongIds: likedSongIds });
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  },

  toggleFollow: async (artistId: string, artistName?: string) => {
    const { followedArtistIds } = get();
    const wasFollowing = followedArtistIds.has(artistId);

    // Optimistic update
    const newSet = new Set(followedArtistIds);
    if (wasFollowing) {
      newSet.delete(artistId);
    } else {
      newSet.add(artistId);
    }
    set({ followedArtistIds: newSet });

    // Toast
    if (!wasFollowing) {
      toast.success(
        artistName ? `Đang theo dõi ${artistName}` : 'Đang theo dõi nghệ sĩ',
        { icon: '🎵', duration: 2500 }
      );
    } else {
      toast(
        artistName ? `Đã bỏ theo dõi ${artistName}` : 'Đã bỏ theo dõi nghệ sĩ',
        { duration: 2000 }
      );
    }

    try {
      if (wasFollowing) {
        await api.delete(`/artists/${artistId}/follow`);
      } else {
        await api.post(`/artists/${artistId}/follow`);
      }
    } catch {
      // Revert nếu lỗi API
      set({ followedArtistIds: followedArtistIds });
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  },

  isLiked: (songId: string) => get().likedSongIds.has(songId),
  isFollowing: (artistId: string) => get().followedArtistIds.has(artistId),
}));
