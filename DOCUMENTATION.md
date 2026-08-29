# Tài liệu dự án Kaku Books

## 1. Tổng quan dự án

Dự án là một cửa hàng trực tuyến chuyên về mô hình anime và figure (trước đây là sách). Dự án sử dụng kiến trúc Next.js App Router với hệ thống quản trị dành cho admin để quản lý sản phẩm, danh mục và video YouTube.

## 2. Công nghệ sử dụng

- **Framework**: Next.js 16.3.1 (App Router)
- **Ngôn ngữ**: TypeScript
- **CSS**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui
- **ORM**: Prisma với PostgreSQL (Supabase)
- **Xác thực**: JWT với jose
- **Validation**: Zod
- **Form**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: Sonner

## 3. Kiến trúc ứng dụng

### Frontend (Storefront)
- Thư mục: `src/app/(storefront)/`
- Trang chủ: `src/app/(storefront)/page.tsx`
- Danh sách sản phẩm: `src/app/(storefront)/products/page.tsx`
- Chi tiết sản phẩm: `src/app/(storefront)/products/[slug]/page.tsx`
- Trang video: `src/app/(storefront)/videos/page.tsx`

### Backend (Admin)
- Thư mục: `src/app/admin/`
- Trang đăng nhập: `src/app/admin/login/page.tsx`
- Quản lý sản phẩm: `src/app/admin/products/`
- Quản lý danh mục: `src/app/admin/categories/`
- Quản lý video: `src/app/admin/videos/`

### API Routes
- Sản phẩm: `/api/products/` (GET, POST, PUT, DELETE)
- Danh mục: `/api/categories/` (GET, POST, PUT, DELETE)
- Video: `/api/videos/` (GET, POST, PUT, DELETE)
- Xác thực: `/api/auth/` (login, logout)

### Components
- Layout: `src/components/layout/` (Header, Footer)
- Admin: `src/components/admin/` (AdminHeader, ProductForm, CategoryForm, VideoForm, v.v.)
- UI chung: `src/components/ui/`
- Sản phẩm: `src/components/product/`

## 4. Cơ sở dữ liệu

### Schema Prisma
```prisma
model Category {
  id        String    @id @default(uuid()) @db.Uuid
  name      String
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now()) @map("created_at")
}

model Product {
  id               String   @id @default(uuid()) @db.Uuid
  name             String
  slug             String   @unique
  author           String?
  shortDescription String   @map("short_description")
  description      String   @db.Text
  imageUrl         String   @map("image_url")
  imagePath        String?  @map("image_path")
  price            Decimal  @db.Decimal(12, 0)
  originalPrice    Decimal? @map("original_price") @db.Decimal(12, 0)
  stock            Int      @default(0)
  categoryId       String   @map("category_id") @db.Uuid
  category         Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  isFeatured       Boolean  @default(false) @map("is_featured")
  isNew            Boolean  @default(false) @map("is_new")
  isActive         Boolean  @default(true) @map("is_active")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
}

model Video {
  id          String   @id @default(uuid()) @db.Uuid
  title       String
  youtubeUrl  String   @map("youtube_url")
  youtubeId   String   @map("youtube_id")
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
}
```

## 5. Các chức năng chính

### 5.1. Hệ thống người dùng
- **Khách hàng**: Truy cập storefront, xem sản phẩm, video
- **Admin**: Truy cập khu vực quản trị với mật khẩu xác thực

### 5.2. Quản lý sản phẩm (Admin)
- CRUD sản phẩm (tên, slug, mô tả, giá, hình ảnh, tồn kho, v.v.)
- Quản lý trạng thái (hiển thị, bán chạy, mới)
- Upload hình ảnh với Supabase Storage

### 5.3. Quản lý danh mục (Admin)
- CRUD danh mục sản phẩm
- Quản lý slug và tên danh mục

### 5.4. Quản lý video (Admin)
- CRUD video YouTube (chỉ cần dán link)
- Tự động trích xuất ID video
- Hiển thị thumbnail
- Quản lý trạng thái hoạt động

### 5.5. Frontend (Người dùng)
- Trang chủ với sản phẩm nổi bật, mới nhất và video mới nhất
- Danh sách sản phẩm với bộ lọc và phân trang
- Trang chi tiết sản phẩm
- Trang video với player nhúng

## 6. Authentication/Authorization

### Admin Authentication
- Sử dụng JWT token lưu trong cookie `admin_session`
- Middleware bảo vệ các route `/admin/*` (src/proxy.ts)
- Mật khẩu admin được lưu trong biến môi trường `ADMIN_PASSWORD`
- Session có thời hạn 8 tiếng

### API Protection
- Các endpoint admin yêu cầu xác thực qua hàm `isAdminAuthenticated()`
- Trả về lỗi 401 nếu không xác thực

## 7. Cấu hình Next.js

### next.config.ts
- Cấu hình remote patterns cho hình ảnh (Supabase, Unsplash, Picsum, YouTube thumbnails)
- Cho phép SVG và cấu hình Content Security Policy

### Middleware
- File `src/proxy.ts` bảo vệ các route `/admin/*`
- Kiểm tra session và redirect nếu chưa đăng nhập

## 8. Deployment

### Vercel
- Dự án được cấu hình để deploy trên Vercel
- Sử dụng Supabase làm database
- Environment variables được lưu trên Vercel dashboard

## 9. Tổ chức code

### Thư mục chính
```
src/
├── app/                 # Next.js App Router
│   ├── (storefront)/   # Giao diện người dùng
│   ├── admin/          # Giao diện quản trị
│   └── api/            # API routes
├── components/         # React components
│   ├── admin/          # Components cho admin
│   ├── layout/         # Header, Footer
│   ├── product/        # Components sản phẩm
│   └── ui/             # UI components chung
├── lib/               # Utilities, services, repositories
│   ├── auth/           # Xử lý xác thực
│   ├── repositories/   # Data access layer
│   ├── services/       # Business logic
│   ├── validations/    # Schema validation
│   └── utils.ts        # Helper functions
```

### Patterns sử dụng
- Repository pattern cho data access
- Service pattern cho business logic
- Validation schema với Zod
- Component composition
- Server Actions (gián tiếp qua API routes)

## 10. Điểm cần chú ý

### 10.1. Ưu điểm
- Kiến trúc rõ ràng, phân tách giữa frontend/backend
- Xác thực admin đơn giản nhưng hiệu quả
- Responsive UI với Tailwind
- Hệ thống quản lý video YouTube tích hợp
- Tích hợp Supabase cho lưu trữ hình ảnh

### 10.2. Các điểm cần cải thiện
- Tên biến và comment tiếng Việt có thể gây khó khăn cho team quốc tế
- Một số phần của ứng dụng vẫn giữ tên "books" dù đã chuyển thành "figures"
- Có thể thêm logging và monitoring cho production
- Có thể tối ưu hóa SEO với metadata động

### 10.3. Issues đã biết
- Middleware đang nằm trong file `proxy.ts` thay vì `middleware.ts` (đã được cập nhật)
- Một số text chưa được cập nhật từ "sách" sang "figure/model"

Dự án hiện đang hoạt động ổn định với đầy đủ chức năng quản lý sản phẩm, danh mục và video YouTube cho cả frontend và backend.