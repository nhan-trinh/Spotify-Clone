# Module: Admin

## Mô tả
Dashboard quản trị, quản lý user, content, subscription, cấu hình hệ thống, audit log.

---

## Business Rules

- Chỉ role `ADMIN` mới truy cập được toàn bộ module này
- Mọi hành động của Admin đều ghi vào **AuditLog**
- Admin có thể **gán / thu hồi** mọi role kể cả Moderator và Admin khác
- Ban user → blacklist tất cả Refresh Token của user đó (Redis)
- **Feature Flags**: bật/tắt tính năng mà không cần deploy lại (lưu Redis hoặc DB config)

---

## API Endpoints

### User Management
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/users` | Danh sách user (filter, paginate, search) |
| GET | `/admin/users/:id` | Chi tiết user |
| PATCH | `/admin/users/:id/role` | Gán role |
| POST | `/admin/users/:id/ban` | Ban user |
| POST | `/admin/users/:id/unban` | Unban user |
| POST | `/admin/users/:id/reset-password` | Reset mật khẩu |

### Content Management
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/songs` | Tất cả bài hát (mọi status) |
| DELETE | `/admin/songs/:id` | Xóa bài hát |
| POST | `/admin/artists/:id/verify` | Cấp Verified Badge |
| POST | `/admin/playlists` | Tạo playlist hệ thống |
| PATCH | `/admin/playlists/:id/feature` | Feature / unfeature playlist |
| PATCH | `/admin/playlists/:id/pin` | Ghim / bỏ ghim |

### Moderator Management
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/moderators` | Danh sách Moderator |
| GET | `/admin/moderators/:id/activity` | Hoạt động kiểm duyệt |
| DELETE | `/admin/moderators/:id` | Thu hồi quyền Moderator |

### Subscription & Payment
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/subscriptions` | Danh sách tất cả subscription |
| GET | `/admin/payments` | Lịch sử thanh toán |
| POST | `/admin/payments/:id/refund` | Xử lý hoàn tiền |
| GET | `/admin/plans` | Danh sách gói |
| PATCH | `/admin/plans/:plan/price` | Cập nhật giá gói |

### System Config
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/config` | Lấy toàn bộ config |
| PATCH | `/admin/config` | Cập nhật config |
| POST | `/admin/config/features/:key/toggle` | Bật/tắt feature flag |
| POST | `/admin/maintenance` | Bật/tắt maintenance mode |

### Audit Log
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/audit-logs` | Lịch sử hành động (filter theo actor, action, date) |

### Analytics Dashboard
| Method | Path | Mô tả |
|---|---|---|
| GET | `/admin/analytics/overview` | Tổng quan (user, plays, revenue) |
| GET | `/admin/analytics/top-songs` | Top bài hát |
| GET | `/admin/analytics/top-artists` | Top artist |
| GET | `/admin/analytics/revenue` | Doanh thu theo thời gian |
| GET | `/admin/analytics/conversion` | Tỷ lệ Free → Premium |
| GET | `/admin/analytics/retention` | Retention rate |

---

## File Structure (BE)
```
src/modules/admin/
├── admin.router.ts
├── admin.controller.ts
├── admin.service.ts
├── admin.schema.ts
└── admin.types.ts
```
