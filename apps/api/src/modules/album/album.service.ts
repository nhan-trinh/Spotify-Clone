export const albumService = {
  getAlbums: async (_query: unknown) => { throw new Error('TODO'); },
  getAlbumById: async (_id: string) => { throw new Error('TODO'); },
  createAlbum: async (_artistId: string, _data: unknown) => { throw new Error('TODO'); },
  updateAlbum: async (_id: string, _artistId: string, _data: unknown) => { throw new Error('TODO'); },
  deleteAlbum: async (_id: string, _actorId: string) => { throw new Error('TODO'); },
  addSongToAlbum: async (_albumId: string, _songId: string) => { throw new Error('TODO'); },
  removeSongFromAlbum: async (_albumId: string, _songId: string) => { throw new Error('TODO'); },
  followAlbum: async (_userId: string, _albumId: string) => { throw new Error('TODO'); },
  unfollowAlbum: async (_userId: string, _albumId: string) => { throw new Error('TODO'); },
};
