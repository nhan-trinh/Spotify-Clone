## Feature: Collaborative Playlists
## Project: RingBeatMusic (Prisma + PostgreSQL)

---

### Schema liên quan (thực tế từ schema.prisma)

```prisma
model Playlist {
  id              String   @id @default(uuid())
  ownerId         String?  // null = playlist hệ thống (isSystem = true)
  isPublic        Boolean  @default(false)
  isSystem        Boolean  @default(false)
  isCollaborative Boolean  @default(false)
  songs           PlaylistSong[]
  collaborators   PlaylistCollaborator[]
}

model PlaylistSong {
  id         String   @id @default(uuid())
  playlistId String
  songId     String
  addedBy    String   // userId của người thêm bài
  position   Int      // thứ tự bài trong playlist
  addedAt    DateTime @default(now())
  @@unique([playlistId, songId])
}

// ⚠ Cần bổ sung vào schema thực tế:
model PlaylistCollaborator {
  id         String                   @id @default(uuid())
  playlistId String
  userId     String
  status     CollaboratorStatus       @default(ACTIVE)  // ACTIVE | KICKED
  addedAt    DateTime                 @default(now())
  kickedAt   DateTime?
  @@unique([playlistId, userId])      // Tránh duplicate invite
}

enum CollaboratorStatus {
  ACTIVE
  KICKED
}

enum Role {
  USER_FREE
  USER_PREMIUM
  ARTIST
  PODCAST_HOST
  MODERATOR
  ADMIN
}
```

---

### Business Rules

1. Chỉ owner (`playlist.ownerId`) mới được bật/tắt `isCollaborative`
2. `isSystem = true` → KHÔNG bao giờ được bật `isCollaborative`
3. `ownerId = null` → playlist hệ thống, không có owner → block mọi thao tác collaborative
4. Chỉ owner mới được invite/kick collaborator
5. Collaborator chỉ được xóa bài do CHÍNH MÌNH thêm (`PlaylistSong.addedBy = userId`)
6. Owner được xóa bài của bất kỳ ai
7. Kick collaborator: set `status = KICKED`, `kickedAt = now()` — KHÔNG xóa bài họ đã thêm
8. Tắt `isCollaborative`: tất cả collaborator `ACTIVE` mất quyền — bài hát giữ nguyên
9. `position` của `PlaylistSong` phải được recalculate sau khi xóa bài
10. `MODERATOR` và `ADMIN` có thể xóa bài trong bất kỳ playlist nào (override)
11. `@@unique([playlistId, songId])` → không được thêm bài trùng
12. `@@unique([playlistId, userId])` trên `PlaylistCollaborator` → không được invite trùng

---

### Test Cases

#### TC-01 — Bật isCollaborative [✓ Happy path]
- Setup: Playlist thường, `ownerId = userA`, `isSystem = false`
- Input: userA gọi `enableCollaborative(playlistId)`
- Expected: `playlist.isCollaborative = true`
- Guard 1: userB (không phải owner) gọi → throw `FORBIDDEN`
- Guard 2: `isSystem = true` → throw `CANNOT_MODIFY_SYSTEM_PLAYLIST`
- Guard 3: `ownerId = null` → throw `CANNOT_MODIFY_SYSTEM_PLAYLIST`

#### TC-02 — Tắt isCollaborative [⚠ Edge case]
- Setup: Playlist đang có 3 collaborator ACTIVE, mỗi người đã thêm bài
- Input: Owner tắt `isCollaborative`
- Expected:
  - `playlist.isCollaborative = false`
  - Tất cả collaborator ACTIVE không còn quyền thêm/xóa bài
  - Tất cả `PlaylistSong` records giữ nguyên (không xóa)
  - `addedBy` trên từng bài giữ nguyên giá trị cũ

#### TC-03 — Invite Collaborator [✓ Happy path]
- Input: Owner gọi `inviteCollaborator(playlistId, userBId)`
- Expected: Tạo record `PlaylistCollaborator { playlistId, userId: userBId, status: ACTIVE }`
- Guard 1: Caller không phải owner → throw `FORBIDDEN`
- Guard 2: `playlist.isCollaborative = false` → throw `PLAYLIST_NOT_COLLABORATIVE`
- Guard 3: userBId đã có record với `status = ACTIVE` → throw `ALREADY_COLLABORATOR`
- Guard 4: Owner invite chính mình → throw `CANNOT_INVITE_OWNER`

#### TC-04 — Re-invite sau khi bị kick [★ Schema-specific]
- Setup: userB có record `{ status: KICKED }`
- Input: Owner invite lại userB
- Expected: Update record cũ thành `{ status: ACTIVE, kickedAt: null }` (không tạo record mới)
- Lý do: `@@unique([playlistId, userId])` sẽ conflict nếu INSERT thay vì UPDATE

#### TC-05 — Collaborator thêm bài [✓ Happy path]
- Input: Collaborator ACTIVE gọi `addSong(playlistId, songId)`
- Expected:
  - Tạo `PlaylistSong { addedBy: collaboratorId, position: max(position)+1 }`
- Guard 1: User không có record ACTIVE trong `PlaylistCollaborator` → throw `FORBIDDEN`
- Guard 2: `playlist.isCollaborative = false` → throw `FORBIDDEN`
- Guard 3: `@@unique([playlistId, songId])` conflict → throw `SONG_ALREADY_IN_PLAYLIST`
- Guard 4: Song có `status != APPROVED` → throw `SONG_NOT_AVAILABLE`

#### TC-06 — Collaborator xóa bài của MÌNH [✓ Happy path]
- Setup: `PlaylistSong.addedBy = collaboratorId`
- Input: Collaborator gọi `removeSong(playlistId, songId)`
- Expected:
  - Xóa record `PlaylistSong`
  - Recalculate `position` của các bài còn lại (liên tục, không có gap)

#### TC-07 — Collaborator xóa bài của người KHÁC [✗ Error]
- Setup: `PlaylistSong.addedBy = userCId` (không phải collaborator đang gọi)
- Input: Collaborator B gọi `removeSong(playlistId, songId)`
- Expected: throw `FORBIDDEN`

#### TC-08 — Owner xóa bài của bất kỳ ai [✓ Happy path]
- Setup: Bài có `addedBy = collaboratorId`
- Input: Owner gọi `removeSong(playlistId, songId)`
- Expected: Xóa thành công, recalculate `position`

#### TC-09 — MODERATOR/ADMIN xóa bài override [★ Schema-specific]
- Setup: User có `role = MODERATOR` hoặc `ADMIN`, không phải owner
- Input: Gọi `removeSong(playlistId, songId)`
- Expected: Xóa thành công (bypass owner check)

#### TC-10 — Kick Collaborator [⚠ Edge case — quan trọng nhất]
- Setup: userB có `status = ACTIVE`, đã thêm 5 bài vào playlist
- Input: Owner gọi `kickCollaborator(playlistId, userBId)`
- Expected:
  - `PlaylistCollaborator.status = KICKED`
  - `PlaylistCollaborator.kickedAt = now()`
  - 5 `PlaylistSong` records của userB VẪN TỒN TẠI
  - `PlaylistSong.addedBy` vẫn là `userBId` (không thay đổi)
- Guard 1: Caller không phải owner → throw `FORBIDDEN`
- Guard 2: userB đã có `status = KICKED` → throw `USER_NOT_COLLABORATOR`

#### TC-11 — Kicked user cố thêm bài [✗ Error]
- Setup: userB có `status = KICKED`
- Input: userB gọi `addSong(playlistId, songId)`
- Expected: throw `FORBIDDEN` (check `status = ACTIVE`, không chỉ check tồn tại record)

#### TC-12 — Hiển thị addedBy sau khi kick [⚠ Edge case]
- Input: Fetch danh sách bài trong playlist (include `addedBy`)
- Expected:
  - Bài do userB (đã bị kick) thêm vẫn hiển thị `addedBy: "userB"`
  - Không filter out hoặc null-ify `addedBy`
  - Frontend có thể thêm badge "(đã rời)") nếu muốn, nhưng data phải đủ

#### TC-13 — Position integrity sau khi xóa bài [★ Schema-specific]
- Setup: Playlist có 5 bài, `position` = [1, 2, 3, 4, 5]
- Input: Xóa bài ở `position = 3`
- Expected: Các bài còn lại có `position` = [1, 2, 3, 4] (không phải [1, 2, 4, 5])
- Note: Dùng transaction để update atomically

#### TC-14 — Owner thêm bài (isCollaborative = false) [✓ Happy path]
- Input: Owner gọi `addSong` trên playlist KHÔNG collaborative
- Expected: Thêm thành công với `addedBy = ownerId`
- Note: Owner luôn có quyền thêm/xóa bài của mình bất kể `isCollaborative`

#### TC-15 — Playlist isPublic = false, collaborator fetch [★ Schema-specific]
- Setup: `playlist.isPublic = false`, userB là collaborator ACTIVE
- Input: userB fetch danh sách bài trong playlist
- Expected: Trả về danh sách bình thường (collaborator được xem dù playlist private)
- Guard: userC (không phải collaborator, không phải owner) fetch → throw `FORBIDDEN`
