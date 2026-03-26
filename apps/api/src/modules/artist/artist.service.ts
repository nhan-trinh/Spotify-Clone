export const artistService = {
  getArtists: async (_query: unknown) => { throw new Error('TODO'); },
  getArtistById: async (_id: string) => { throw new Error('TODO'); },
  getArtistSongs: async (_artistId: string) => { throw new Error('TODO'); },
  getArtistAlbums: async (_artistId: string) => { throw new Error('TODO'); },
  getArtistAnalytics: async (_artistId: string) => { throw new Error('TODO'); },
  updateArtistProfile: async (_artistId: string, _data: unknown) => { throw new Error('TODO'); },
  followArtist: async (_userId: string, _artistId: string) => { throw new Error('TODO'); },
  unfollowArtist: async (_userId: string, _artistId: string) => { throw new Error('TODO'); },
  requestVerification: async (_artistId: string) => { throw new Error('TODO'); },
};
