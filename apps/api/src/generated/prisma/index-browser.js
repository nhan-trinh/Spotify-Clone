
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  name: 'name',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  avatarUrl: 'avatarUrl',
  role: 'role',
  isEmailVerified: 'isEmailVerified',
  isBanned: 'isBanned',
  banReason: 'banReason',
  loginAttempts: 'loginAttempts',
  lockedUntil: 'lockedUntil',
  twoFactorEnabled: 'twoFactorEnabled',
  twoFactorSecret: 'twoFactorSecret',
  googleId: 'googleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArtistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stageName: 'stageName',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  isVerified: 'isVerified',
  socialLinks: 'socialLinks',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PodcastHostScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  displayName: 'displayName',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  createdAt: 'createdAt'
};

exports.Prisma.SongScalarFieldEnum = {
  id: 'id',
  title: 'title',
  artistId: 'artistId',
  albumId: 'albumId',
  genreId: 'genreId',
  duration: 'duration',
  audioUrl128: 'audioUrl128',
  audioUrl320: 'audioUrl320',
  coverUrl: 'coverUrl',
  lyrics: 'lyrics',
  syncedLyrics: 'syncedLyrics',
  language: 'language',
  releaseDate: 'releaseDate',
  status: 'status',
  playCount: 'playCount',
  likeCount: 'likeCount',
  canvasUrl: 'canvasUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SongArtistScalarFieldEnum = {
  id: 'id',
  songId: 'songId',
  artistId: 'artistId',
  role: 'role'
};

exports.Prisma.AlbumScalarFieldEnum = {
  id: 'id',
  title: 'title',
  artistId: 'artistId',
  coverUrl: 'coverUrl',
  releaseDate: 'releaseDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GenreScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  coverUrl: 'coverUrl'
};

exports.Prisma.PlaylistScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  coverUrl: 'coverUrl',
  ownerId: 'ownerId',
  isPublic: 'isPublic',
  isSystem: 'isSystem',
  isFeatured: 'isFeatured',
  isPinned: 'isPinned',
  isCollaborative: 'isCollaborative',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlaylistSongScalarFieldEnum = {
  id: 'id',
  playlistId: 'playlistId',
  songId: 'songId',
  addedBy: 'addedBy',
  position: 'position',
  addedAt: 'addedAt'
};

exports.Prisma.PlaylistCollaboratorScalarFieldEnum = {
  id: 'id',
  playlistId: 'playlistId',
  userId: 'userId',
  status: 'status',
  addedAt: 'addedAt',
  kickedAt: 'kickedAt'
};

exports.Prisma.LikedSongScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  songId: 'songId',
  likedAt: 'likedAt'
};

exports.Prisma.HiddenSongScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  songId: 'songId',
  playlistId: 'playlistId',
  hiddenAt: 'hiddenAt'
};

exports.Prisma.FollowedArtistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  artistId: 'artistId',
  followedAt: 'followedAt'
};

exports.Prisma.FollowedAlbumScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  albumId: 'albumId',
  followedAt: 'followedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  plan: 'plan',
  status: 'status',
  autoRenew: 'autoRenew',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  plan: 'plan',
  amount: 'amount',
  status: 'status',
  vnpayTxnRef: 'vnpayTxnRef',
  vnpayResponseCode: 'vnpayResponseCode',
  idempotencyKey: 'idempotencyKey',
  paidAt: 'paidAt',
  createdAt: 'createdAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  paymentId: 'paymentId',
  amount: 'amount',
  plan: 'plan',
  issuedAt: 'issuedAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  reportedBy: 'reportedBy',
  songId: 'songId',
  reason: 'reason',
  status: 'status',
  resolvedBy: 'resolvedBy',
  resolvedAt: 'resolvedAt',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.StrikeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  issuedBy: 'issuedBy',
  reason: 'reason',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  actorId: 'actorId',
  action: 'action',
  targetId: 'targetId',
  targetType: 'targetType',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.PodcastShowScalarFieldEnum = {
  id: 'id',
  hostId: 'hostId',
  title: 'title',
  description: 'description',
  coverUrl: 'coverUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PodcastEpisodeScalarFieldEnum = {
  id: 'id',
  showId: 'showId',
  title: 'title',
  description: 'description',
  audioUrl: 'audioUrl',
  duration: 'duration',
  publishedAt: 'publishedAt',
  status: 'status',
  playCount: 'playCount',
  createdAt: 'createdAt'
};

exports.Prisma.PodcastSubscriberScalarFieldEnum = {
  id: 'id',
  showId: 'showId',
  userId: 'userId',
  subscribedAt: 'subscribedAt'
};

exports.Prisma.PlaylistFollowerScalarFieldEnum = {
  userId: 'userId',
  playlistId: 'playlistId',
  followedAt: 'followedAt'
};

exports.Prisma.SystemConfigScalarFieldEnum = {
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserFollowScalarFieldEnum = {
  followerId: 'followerId',
  followingId: 'followingId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  USER_FREE: 'USER_FREE',
  USER_PREMIUM: 'USER_PREMIUM',
  ARTIST: 'ARTIST',
  PODCAST_HOST: 'PODCAST_HOST',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
};

exports.SongStatus = exports.$Enums.SongStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
  BANNED: 'BANNED'
};

exports.AlbumStatus = exports.$Enums.AlbumStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  BANNED: 'BANNED'
};

exports.CollaboratorStatus = exports.$Enums.CollaboratorStatus = {
  ACTIVE: 'ACTIVE',
  KICKED: 'KICKED'
};

exports.SubscriptionPlan = exports.$Enums.SubscriptionPlan = {
  FREE: 'FREE',
  PREMIUM_INDIVIDUAL: 'PREMIUM_INDIVIDUAL',
  PREMIUM_DUO: 'PREMIUM_DUO',
  PREMIUM_FAMILY: 'PREMIUM_FAMILY',
  PREMIUM_STUDENT: 'PREMIUM_STUDENT'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.ReportStatus = exports.$Enums.ReportStatus = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
};

exports.StrikeReason = exports.$Enums.StrikeReason = {
  COPYRIGHT_VIOLATION: 'COPYRIGHT_VIOLATION',
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
  SPAM: 'SPAM',
  OTHER: 'OTHER'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  USER_BANNED: 'USER_BANNED',
  USER_UNBANNED: 'USER_UNBANNED',
  SONG_APPROVED: 'SONG_APPROVED',
  SONG_REJECTED: 'SONG_REJECTED',
  REPORT_RESOLVED: 'REPORT_RESOLVED',
  ROLE_CHANGED: 'ROLE_CHANGED',
  CONFIG_UPDATED: 'CONFIG_UPDATED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Artist: 'Artist',
  PodcastHost: 'PodcastHost',
  Song: 'Song',
  SongArtist: 'SongArtist',
  Album: 'Album',
  Genre: 'Genre',
  Playlist: 'Playlist',
  PlaylistSong: 'PlaylistSong',
  PlaylistCollaborator: 'PlaylistCollaborator',
  LikedSong: 'LikedSong',
  HiddenSong: 'HiddenSong',
  FollowedArtist: 'FollowedArtist',
  FollowedAlbum: 'FollowedAlbum',
  Subscription: 'Subscription',
  Payment: 'Payment',
  Invoice: 'Invoice',
  Report: 'Report',
  Strike: 'Strike',
  AuditLog: 'AuditLog',
  PodcastShow: 'PodcastShow',
  PodcastEpisode: 'PodcastEpisode',
  PodcastSubscriber: 'PodcastSubscriber',
  PlaylistFollower: 'PlaylistFollower',
  SystemConfig: 'SystemConfig',
  UserFollow: 'UserFollow'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
