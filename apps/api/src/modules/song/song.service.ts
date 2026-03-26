export const songService = {
  getSongs: async (_query: unknown) => { throw new Error('TODO'); },
  getSongById: async (_id: string) => { throw new Error('TODO'); },
  createSong:  async (_artistId: string, _data: unknown) => { throw new Error('TODO'); },
  updateSong:  async (_id: string, _artistId: string, _data: unknown) => { throw new Error('TODO'); },
  deleteSong:  async (_id: string, _actorId: string) => { throw new Error('TODO'); },
  getUploadUrl: async (_artistId: string, _filename: string) => { throw new Error('TODO'); },
  uploadComplete: async (_songId: string, _artistId: string) => { throw new Error('TODO'); },
  likeSong:   async (_userId: string, _songId: string) => { throw new Error('TODO'); },
  unlikeSong: async (_userId: string, _songId: string) => { throw new Error('TODO'); },
  hideSong:   async (_userId: string, _songId: string, _playlistId?: string) => { throw new Error('TODO'); },
};
