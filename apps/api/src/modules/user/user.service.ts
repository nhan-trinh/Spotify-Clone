export const userService = {
  getMe: async (_userId: string) => { throw new Error('TODO'); },
  updateMe: async (_userId: string, _data: unknown) => { throw new Error('TODO'); },
  deleteMe: async (_userId: string) => { throw new Error('TODO'); },
  uploadAvatar: async (_userId: string, _file: Express.Multer.File) => { throw new Error('TODO'); },
  changePassword: async (_userId: string, _oldPass: string, _newPass: string) => { throw new Error('TODO'); },
  getLikedSongs: async (_userId: string) => { throw new Error('TODO'); },
  getFollowedArtists: async (_userId: string) => { throw new Error('TODO'); },
  getUserById: async (_id: string) => { throw new Error('TODO'); },
};
