# Tài liệu dự án ThienTam / Kaku Books

> Cập nhật theo source hiện tại. Tên package/repository vẫn là `kaku-books`, nhưng sản phẩm thực tế là nền tảng thương mại và cộng đồng dành cho người sưu tầm mô hình/figure.

## 1. Dự án này làm gì?

ThienTam là website gồm ba phần:

1. **Storefront:** khách truy cập xem mô hình, tìm kiếm/lọc sản phẩm, xem video review và tham gia cộng đồng.
2. **Cộng đồng collector:** thành viên đăng ký/đăng nhập, đăng bài, đăng ảnh qua URL, bình luận, thích và báo cáo nội dung.
3. **Trang quản trị:** quản lý danh mục, mô hình, ảnh sản phẩm trên Supabase Storage, video YouTube, người dùng và báo cáo cộng đồng.

Luồng dữ liệu chính:

```text
Browser / Next.js page
        │
        ├── Server Component → service → repository → Prisma → Supabase PostgreSQL
        └── Client Component → /api/* → validation → service/repository → PostgreSQL hoặc Storage
```

## 2. Công nghệ

| Nhóm | Công nghệ | Vai trò |
|---|---|---|
| Framework | Next.js 16.3.1, App Router | SSR/RSC, routing, API Route Handlers |
| UI | React 19.2.8, TypeScript 5 | Component UI và type safety |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI | Giao diện responsive và primitive UI |
| Database | PostgreSQL trên Supabase | Lưu danh mục, sản phẩm, video, người dùng và cộng đồng |
| ORM | Prisma 7 + `@prisma/adapter-pg` + `pg` | Schema, query, migration và truy cập dữ liệu |
| Storage | Supabase Storage (`@supabase/supabase-js`) | Lưu ảnh sản phẩm do Admin upload |
| Authentication | JWT/cookie với `jose` | Phiên Admin và phiên thành viên |
| Validation | Zod | Kiểm tra dữ liệu API/form |
| Form | React Hook Form | Điều khiển và validate form |
| Tiện ích UI | Lucide React, Sonner | Icon và toast notification |
| Dữ liệu hỗ trợ | `slugify`, DiceBear | Sinh slug và avatar mặc định |

## 3. Chạy dự án

### Điều kiện

- Node.js tương thích Next.js 16.
- Một Supabase project gồm PostgreSQL và Storage.
- Các biến môi trường được cấu hình trong `.env.local`/môi trường deploy.

### Scripts

```bash
npm run dev        # Chạy môi trường phát triển
npm run build      # Build production
npm run start      # Chạy bản build production
npm run db:migrate # Prisma migrate dev
npm run db:push    # Đồng bộ Prisma schema lên database
npm run db:seed    # Chạy prisma/seed.ts
npm run db:studio  # Mở Prisma Studio
```

### Biến môi trường cần lưu ý

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL runtime của Prisma |
| `DIRECT_URL` | Chuỗi kết nối dùng cho thao tác Prisma/migration khi cần |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập khu vực Admin |
| Các biến Supabase | URL/key phục vụ Storage hoặc API Supabase |
| Secret JWT | Ký/xác minh cookie phiên Admin và khách hàng |

Không đưa `.env.local`, password, token hoặc service-role key vào Git/document công khai.

## 4. Cấu trúc thư mục

```text
.
├── prisma/
│   ├── schema.prisma                # Toàn bộ model/enum Prisma
│   └── seed.ts                      # Seed dữ liệu local
├── public/
│   └── images/                      # Ảnh tĩnh dùng cho storefront
├── src/
│   ├── app/
│   │   ├── (storefront)/            # Route khách hàng
│   │   │   ├── auth/                # Đăng nhập, đăng ký
│   │   │   ├── community/           # Feed và chi tiết bài viết
│   │   │   ├── products/            # Danh sách, chi tiết sản phẩm
│   │   │   ├── videos/              # Video review
│   │   │   ├── layout.tsx           # Header/Footer storefront
│   │   │   └── page.tsx             # Trang chủ
│   │   ├── admin/                   # Khu vực quản trị
│   │   ├── api/                     # Next.js Route Handlers
│   │   ├── layout.tsx               # Root layout
│   │   ├── error.tsx                # Global error UI
│   │   └── not-found.tsx            # 404 UI
│   ├── components/
│   │   ├── admin/                   # Form/bảng/header quản trị
│   │   ├── auth/                    # Form auth khách hàng
│   │   ├── community/               # PostCard, composer, comment
│   │   ├── common/                  # Pagination, skeleton, empty state
│   │   ├── layout/                  # Header, Footer
│   │   ├── product/                 # Card, filter, grid, sản phẩm liên quan
│   │   └── ui/                      # Primitive UI dùng lại
│   ├── lib/
│   │   ├── auth/                    # JWT/session Admin và member
│   │   ├── repositories/            # Data access qua Prisma
│   │   ├── services/                # Nghiệp vụ (product, image storage...)
│   │   ├── validations/             # Zod schemas
│   │   ├── prisma.ts                # Singleton Prisma Client
│   │   ├── supabase-admin.ts        # Supabase server client
│   │   └── utils.ts                 # format price, slug, helpers
│   └── proxy.ts                     # Bảo vệ route /admin/*
├── next.config.ts                   # Cấu hình ảnh remote/Next
├── prisma.config.ts                 # Cấu hình Prisma 7
└── DOCUMENTATION.md                 # Tài liệu này
```

### Quy ước kiến trúc

- **Repository pattern:** truy vấn Prisma tập trung trong `src/lib/repositories`.
- **Service pattern:** xử lý nghiệp vụ nằm tại `src/lib/services`.
- **API layer:** API nhận request, xác thực/quyền, validate Zod rồi gọi service/repository.
- **UI:** tách theo domain (`product`, `community`, `admin`) và primitive dùng lại (`ui`).
- **App Router:** trang ưu tiên Server Component; phần có tương tác dùng Client Component.

## 5. Frontend (Storefront)

Hiện có **8 route trang storefront**; nếu bỏ 2 trang xác thực thì có **6 màn hình nội dung chính**.

| Route | Màn hình | Chức năng |
|---|---|---|
| `/` | Trang chủ | Hero, danh mục, sản phẩm nổi bật, video mới và lối vào cộng đồng |
| `/products` | Danh sách mô hình | Tìm kiếm, lọc, sắp xếp, phân trang |
| `/products/[slug]` | Chi tiết mô hình | Thông tin, SEO metadata, sản phẩm liên quan và video liên kết |
| `/videos` | Video review | Danh sách video YouTube active |
| `/community` | Feed cộng đồng | Xem bài đã xuất bản, điều hướng auth khi chưa đăng nhập |
| `/community/posts/[id]` | Chi tiết bài cộng đồng | Nội dung, media, bình luận và tương tác |
| `/auth/login` | Đăng nhập thành viên | Tạo phiên thành viên |
| `/auth/register` | Đăng ký thành viên | Tạo tài khoản, avatar mặc định, phiên đăng nhập |

## 6. Admin có gì?

Có **12 route màn hình Admin**: 1 màn hình đăng nhập và 11 màn hình nghiệp vụ. Route `/admin/*` (trừ login) được bảo vệ bởi `src/proxy.ts`.

| Nhóm | Route | Chức năng |
|---|---|---|
| Xác thực | `/admin/login` | Đăng nhập bằng `ADMIN_PASSWORD`, tạo cookie `admin_session` |
| Sản phẩm | `/admin/products` | Danh sách, tìm kiếm, phân trang và thao tác mô hình |
| Sản phẩm | `/admin/products/create` | Tạo mô hình, upload ảnh, nhập giá/kho/thông số/SEO |
| Sản phẩm | `/admin/products/[id]/edit` | Sửa mô hình, ảnh, trạng thái, SEO |
| Danh mục | `/admin/categories` | Danh sách/quản lý danh mục |
| Danh mục | `/admin/categories/create` | Tạo danh mục |
| Danh mục | `/admin/categories/[id]/edit` | Sửa danh mục |
| Video | `/admin/videos` | Danh sách/quản lý video YouTube |
| Video | `/admin/videos/create` | Tạo video từ URL YouTube |
| Video | `/admin/videos/[id]/edit` | Sửa video |
| Người dùng | `/admin/users` | Xem tối đa 50 thành viên mới nhất: avatar, email, role, status, ngày tham gia |
| Cộng đồng | `/admin/community` | Xem các báo cáo nội dung đang `PENDING` |

### Chi tiết nghiệp vụ Admin

- CRUD danh mục; không thể xóa danh mục còn sản phẩm.
- CRUD sản phẩm; kiểm tra slug/SKU, quản lý giá, tồn kho, trạng thái, ảnh, SEO.
- Upload ảnh sản phẩm lên Supabase Storage; khi thay/xóa product, hệ thống cố gắng dọn ảnh cũ.
- CRUD video YouTube; parse URL để tách `youtubeId`.
- Xem danh sách thành viên.
- Xem report cộng đồng đang chờ. **Lưu ý:** source hiện chưa có UI/API hoàn chỉnh để Admin resolve/reject report, suspend user hoặc kiểm duyệt publish/unpublish bài.

## 7. Cấu trúc dữ liệu

### Tổng quan

Database PostgreSQL có **10 model** và **6 enum**:

```text
Category 1 ── N Product N ── N Video
                     │       (qua VideoProduct)
User 1 ── N RefreshSession
User 1 ── N Post 1 ── N PostMedia
User 1 ── N Post 1 ── N Comment
                  Comment 1 ── N Comment (replies)
User 1 ── N Reaction
User 1 ── N Report (reporter/reviewer)
```

### Models

| Model / bảng | Vai trò | Trường chính |
|---|---|---|
| `Category` / `categories` | Danh mục mô hình | `id`, `name`, `slug` unique |
| `Product` / `products` | Mô hình/figure | tên, slug, SKU, brand, series, scale, material, giá, stock, cờ hiển thị, SEO |
| `Video` / `videos` | Video YouTube | `title`, `youtubeUrl`, `youtubeId`, `description`, `isActive` |
| `VideoProduct` / `video_products` | Bảng nối Video–Product | `videoId`, `productId`, `sortOrder`; unique theo cặp video/sản phẩm |
| `User` / `users` | Thành viên cộng đồng | email, password hash, display name, avatar, role, status |
| `RefreshSession` / `refresh_sessions` | Phiên refresh token của member | user, token hash, expiry, revoke time |
| `Post` / `posts` | Bài đăng cộng đồng | author, content, topic, published, like/comment count |
| `PostMedia` / `post_media` | Media URL gắn bài viết | post, URL, thứ tự |
| `Comment` / `comments` | Bình luận/reply | post, author, `parentId`, content, published |
| `Reaction` / `reactions` | Like Post/Comment | user, `targetType`, `targetId`, type |
| `Report` / `reports` | Báo cáo nội dung | reporter, target, reason, status, reviewer |

### Enum

| Enum | Giá trị |
|---|---|
| `ProductStatus` | `IN_STOCK`, `PREORDER`, `SOLD_OUT`, `DISCONTINUED` |
| `UserRole` | `GUEST`, `MEMBER`, `MODERATOR`, `ADMIN` |
| `UserStatus` | `ACTIVE`, `SUSPENDED` |
| `TargetType` | `POST`, `COMMENT` |
| `ReactionType` | `LIKE` |
| `ReportStatus` | `PENDING`, `RESOLVED`, `REJECTED` |

### Quan hệ và nguyên tắc xóa

- Một Category có nhiều Product; xóa Category bị chặn nếu vẫn còn Product (`Restrict`).
- Product và Video là quan hệ N–N qua `VideoProduct`; xóa Product/Video sẽ xóa bản ghi liên kết.
- User có nhiều session, post, comment, reaction và report.
- Xóa Post sẽ xóa media/bình luận liên quan; Comment hỗ trợ reply qua `parentId`.
- `Reaction` và `Report` dùng `targetType + targetId` để trỏ đa hình đến Post hoặc Comment, nên không có foreign key trực tiếp tới hai bảng này.

## 8. API

Tính theo source hiện tại, dự án có **18 route handler files** và **30 HTTP method handlers**.

### 8.1. Xác thực Admin

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| POST | `/api/auth/login` | Kiểm tra `ADMIN_PASSWORD`, tạo JWT cookie Admin | Public |
| POST | `/api/auth/logout` | Xóa cookie Admin | Admin |

### 8.2. Product và ảnh

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/products` | Danh sách/lọc/tìm kiếm/sắp xếp/phân trang; Admin có thể xem cả inactive | Public / Admin |
| POST | `/api/products` | Tạo sản phẩm | Admin |
| GET | `/api/products/[id]` | Chi tiết sản phẩm theo ID | Public |
| PUT | `/api/products/[id]` | Cập nhật sản phẩm, kiểm tra slug, dọn ảnh cũ | Admin |
| DELETE | `/api/products/[id]` | Xóa sản phẩm và thử xóa ảnh Storage | Admin |
| POST | `/api/uploads/product-image` | Upload ảnh sản phẩm lên Supabase Storage | Admin |

### 8.3. Category

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/categories` | Toàn bộ danh mục | Public |
| POST | `/api/categories` | Tạo danh mục, kiểm tra slug | Admin |
| GET | `/api/categories/[id]` | Chi tiết danh mục | Public |
| PUT | `/api/categories/[id]` | Cập nhật danh mục | Admin |
| DELETE | `/api/categories/[id]` | Xóa nếu không có sản phẩm | Admin |

### 8.4. Video

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/videos` | Danh sách video, hỗ trợ `active`, `limit`, `page` | Public |
| POST | `/api/videos` | Tạo video, parse `youtubeId` | Admin |
| GET | `/api/videos/[id]` | Video kèm sản phẩm liên quan | Public |
| PUT | `/api/videos/[id]` | Cập nhật video | Admin |
| DELETE | `/api/videos/[id]` | Xóa video | Admin |

### 8.5. Xác thực thành viên

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| POST | `/api/customer-auth/register` | Đăng ký, hash password, tạo avatar và session | Public |
| POST | `/api/customer-auth/login` | Đăng nhập; chặn user `SUSPENDED` | Public |
| GET | `/api/customer-auth/me` | Hồ sơ user từ session hiện tại | Member |
| POST | `/api/customer-auth/logout` | Xóa session/cookie thành viên | Member |

### 8.6. Cộng đồng

| Method | Route | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/community/feed` | Feed published; hỗ trợ cursor, topic và limit | Public |
| POST | `/api/community/posts` | Tạo post có topic/media URL | Member |
| GET | `/api/community/posts/[id]` | Chi tiết post, author, media, comment | Public |
| DELETE | `/api/community/posts/[id]` | Xóa post của mình hoặc bởi Moderator/Admin | Owner / Moderator / Admin |
| GET | `/api/community/posts/[id]/comments` | Bình luận published | Public |
| POST | `/api/community/posts/[id]/comments` | Tạo comment/reply qua `parentId` | Member |
| POST | `/api/community/reactions` | Toggle LIKE trên Post/Comment | Member |
| POST | `/api/community/reports` | Tạo report Post/Comment | Member |

## 9. Authentication và phân quyền

### Admin

- Đăng nhập qua `POST /api/auth/login`.
- Password lấy từ `ADMIN_PASSWORD`.
- Cookie JWT: `admin_session`.
- `src/proxy.ts` redirect người chưa đăng nhập khi vào `/admin/*`.
- Endpoint thay đổi Product/Category/Video/Storage đều kiểm tra Admin.

### Thành viên

- Đăng ký/đăng nhập qua `customer-auth`.
- Password lưu dưới dạng hash; không lưu password thuần.
- User có `role` và `status`; user `SUSPENDED` không thể đăng nhập.
- Member cần đăng nhập để post, comment, reaction và report.

## 10. Nghiệp vụ chính

### Catalog

- Chỉ hiển thị Product active cho khách.
- Tìm kiếm theo tên, brand, series, SKU.
- Lọc theo category, brand, series, scale, status, khoảng giá.
- Sắp xếp và phân trang.
- Product có dữ liệu chi tiết của figure: hãng, series, scale, chất liệu, kích thước, tồn kho, pre-order, SEO.

### Video

- Video YouTube được lưu URL/ID.
- Có thể liên kết nhiều Product với một Video và ngược lại qua `VideoProduct`.
- Source API tạo/sửa Video hiện không truyền danh sách `productIds`; quan hệ đã tồn tại ở schema/repository để mở rộng.

### Community

- Feed chỉ lấy Post đã publish.
- Có cursor pagination và topic filter.
- Toggle Like cập nhật `likeCount`; tạo/xóa comment cập nhật `commentCount`.
- Chỉ author, Moderator hoặc Admin được xóa post.

## 11. Cấu hình deploy và vận hành

- Dự án phù hợp deploy trên Vercel hoặc Node runtime hỗ trợ Next.js.
- Database và Storage ở Supabase.
- Cần khai báo đủ env trên môi trường deploy.
- `next.config.ts` cấu hình remote image patterns cho các nguồn ảnh được phép.
- `npm run build` là bước kiểm tra bắt buộc trước deploy.

## 12. Hạn chế/điểm cần phát triển

1. Chưa có cart, checkout, order, payment hoặc quản lý đơn hàng trong schema/API.
2. Admin Community hiện chủ yếu xem report chờ xử lý; chưa có thao tác resolve/reject report hoặc quản trị user đầy đủ.
3. Chưa có API/UI hoàn chỉnh để quản lý liên kết Video–Product ngay trong form video.
4. Community media đang nhận URL; chưa có endpoint upload media cộng đồng riêng.
5. Nên bổ sung rate limit, audit log, monitoring/error tracking và test tự động trước production.
6. Có thể bổ sung metadata động sâu hơn và sitemap/robots nếu mục tiêu SEO cao.