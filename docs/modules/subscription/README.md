# Module: Subscription

## Mô tả
Quản lý gói đăng ký, thanh toán qua VNPAY, billing, upgrade/downgrade, auto-renew.

---

## Business Rules

- Mỗi User chỉ có **1 Subscription record** tại một thời điểm
- Khi nâng cấp lên Premium → cập nhật `user.role = USER_PREMIUM`
- Khi hết hạn / hủy → cập nhật `user.role = USER_FREE`
- Subscription status: `ACTIVE | EXPIRED | CANCELLED | REFUNDED`
- **Auto-renew** mặc định bật — cron job kiểm tra hàng ngày
- Nếu auto-renew thất bại → gửi email thông báo, set status EXPIRED sau 3 ngày gia hạn thất bại
- **Idempotency**: mỗi payment có `idempotencyKey` để tránh charge 2 lần nếu VNPAY callback bị duplicate
- Hoàn tiền (refund): chỉ Admin mới có thể xử lý, cập nhật status = REFUNDED
- Gói **Family (tối đa 6 người)**: chủ tài khoản có thể mời thành viên (tính năng mở rộng sau)

---

## Các gói đăng ký

| Plan | Giá (VND/tháng) | Mô tả |
|---|---|---|
| FREE | 0 | Nghe có quảng cáo, giới hạn skip |
| PREMIUM_INDIVIDUAL | 59,000 | 1 tài khoản |
| PREMIUM_DUO | 89,000 | 2 tài khoản |
| PREMIUM_FAMILY | 119,000 | Tối đa 6 tài khoản |
| PREMIUM_STUDENT | 29,500 | 1 tài khoản, cần xác minh sinh viên |

*(Giá do Admin cấu hình — lưu trong DB hoặc env)*

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/subscription/plans` | ❌ | Danh sách gói và giá |
| GET | `/subscription/me` | ✅ | Subscription hiện tại của user |
| POST | `/subscription/checkout` | ✅ | Tạo payment order (VNPAY) |
| GET | `/subscription/vnpay/callback` | ❌ | VNPAY redirect callback (GET) |
| POST | `/subscription/vnpay/webhook` | ❌ | VNPAY IPN webhook (POST) |
| POST | `/subscription/cancel` | ✅ | Hủy auto-renew |
| GET | `/subscription/invoices` | ✅ | Lịch sử hóa đơn cá nhân |
| GET | `/subscription/invoices/:id` | ✅ | Chi tiết hóa đơn |

---

## VNPAY Payment Flow

```
1. POST /subscription/checkout
   Body: { plan: "PREMIUM_INDIVIDUAL" }

2. BE kiểm tra user chưa có sub active
3. Tạo Payment record (status: PENDING)
4. Tạo idempotencyKey = uuid()
5. Tạo VNPAY payment URL (ký HMAC-SHA512)
6. Trả về { paymentUrl }

7. FE redirect user đến paymentUrl

8. User thanh toán trên VNPAY

9. VNPAY gọi webhook: POST /subscription/vnpay/webhook
10. BE verify chữ ký VNPAY
11. Kiểm tra idempotencyKey — nếu đã xử lý → bỏ qua (trả 200)
12. Nếu responseCode = "00" (thành công):
    - Cập nhật Payment status: SUCCESS
    - Cập nhật / tạo Subscription (status: ACTIVE, endDate = now + 30 ngày)
    - Cập nhật user.role = USER_PREMIUM
    - Tạo Invoice record
    - BullMQ: gửi email xác nhận thanh toán
13. Nếu thất bại → Payment status: FAILED

14. VNPAY redirect user về FE: GET /subscription/vnpay/callback
15. FE đọc query params → hiển thị kết quả
```

---

## Cron Jobs (BullMQ)

### subscription-expiry (chạy hàng ngày 08:00)
```
1. Tìm tất cả Subscription có endDate <= now + 3 ngày AND status = ACTIVE
2. Nếu autoRenew = true:
   - Thử tạo payment mới (charge lại)
   - Thành công → gia hạn thêm 30 ngày
   - Thất bại → gửi email cảnh báo
3. Nếu autoRenew = false AND endDate <= now:
   - Set status = EXPIRED
   - Set user.role = USER_FREE
   - Gửi email thông báo hết hạn
```

---

## File Structure (BE)

```
src/modules/subscription/
├── subscription.router.ts
├── subscription.controller.ts
├── subscription.service.ts
├── subscription.schema.ts
├── subscription.types.ts
└── vnpay.helper.ts         # Tạo URL, verify chữ ký VNPAY

src/shared/jobs/
└── subscription-expiry.worker.ts
```
