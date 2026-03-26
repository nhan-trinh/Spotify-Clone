export const playlistService = {
  getPlaylists: async (_query: unknown) => { throw new Error('TODO'); },
  getPlaylistById: async (_id: string) => { throw new Error('TODO'); },
  createPlaylist: async (_userId: string, _data: unknown) => { throw new Error('TODO'); },
  updatePlaylist: async (_id: string, _userId: string, _data: unknown) => { throw new Error('TODO'); },
  deletePlaylist: async (_id: string, _userId: string) => { throw new Error('TODO'); },
  addSong: async (_playlistId: string, _songId: string, _userId: string) => { throw new Error('TODO'); },
  removeSong: async (_playlistId: string, _songId: string, _userId: string) => { throw new Error('TODO'); },
  reorderSongs: async (_playlistId: string, _order: string[]) => { throw new Error('TODO'); },
  addCollaborator: async (_playlistId: string, _userId: string, _ownerId: string) => { throw new Error('TODO'); },
  removeCollaborator: async (_playlistId: string, _userId: string, _ownerId: string) => { throw new Error('TODO'); },
};
