# Kaku Books

Website bán truyện/manga hiện đại, sang trọng xây dựng bằng Next.js 15 App Router.

## Công nghệ sử dụng

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** — PostgreSQL + Storage
- **Prisma ORM**
- **React Hook Form** + **Zod**
- **Sonner** (toast) · **Lucide React** (icon) · **Jose** (JWT)

## Tính năng

- Storefront: trang chủ, danh sách sản phẩm (tìm kiếm, lọc, sắp xếp, phân trang), chi tiết sản phẩm.
- Admin (bảo vệ bằng session cookie JWT): quản lý sản phẩm — thêm, sửa, ẩn/hiện, xóa.
- Upload ảnh bìa lên Supabase Storage (JPEG/PNG/WebP, tối đa 5 MB).
- Responsive: desktop, tablet và mobile.

## Yêu cầu

- Node.js ≥ 18
- Tài khoản [Supabase](https://supabase.com) (miễn phí)

## Cài đặt

### 1. Clone và cài dependencies

```bash
git clone <repo-url>
cd kaku-books
npm install
```

### 2. Tạo Supabase Project

1. Đăng nhập [supabase.com](https://supabase.com) → tạo project mới.
2. Vào **Project Settings → Database** → copy **Connection string** (Transaction pooler và Direct connection).
3. Vào **Project Settings → API** → copy `URL` và các keys.

### 3. Tạo Storage Bucket

Trong Supabase Dashboard:
1. Vào **Storage → New bucket**.
2. Đặt tên: `product-images`.
3. Chọn **Public bucket**.
4. Tạo bucket.

### 4. Cấu hình environment

```bash
cp .env.example .env.local
```

Điền đầy đủ các biến trong `.env.local`:

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

SUPABASE_SECRET_KEY="your-service-role-key"
SUPABASE_JWKS_URL="https://[project-ref].supabase.co/auth/v1/.well-known/jwks.json"

ADMIN_PASSWORD="your-strong-password"
ADMIN_SESSION_SECRET="your-random-32-char-secret"
```

Tạo `ADMIN_SESSION_SECRET` mạnh:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Tạo database và seed dữ liệu

```bash
# Migrate schema
npm run db:migrate

# Hoặc nếu không dùng migrate (production):
npm run db:push

# Tạo dữ liệu mẫu
npm run db:seed
```

### 6. Chạy môi trường development

```bash
npm run dev
```

> **Lưu ý Windows:** Nếu gặp lỗi `Cannot find module '@tailwindcss/postcss'` khi build, đây là vấn đề file lock trên Windows. Thử chạy:
> ```powershell
> # Đóng tất cả cửa sổ VS Code/terminal đang chạy dev server, sau đó:
> Remove-Item -Recurse -Force node_modules
> npm install
> ```

Mở [http://localhost:3000](http://localhost:3000).

**Admin panel**: [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
- Đăng nhập bằng mật khẩu đã đặt trong `ADMIN_PASSWORD`.

## Cấu trúc thư mục

```
src/
  app/
    (storefront)/        ← Trang khách hàng
      page.tsx           ← Trang chủ
      products/
        page.tsx         ← Danh sách sản phẩm
        [slug]/page.tsx  ← Chi tiết sản phẩm
    admin/               ← Quản trị (bảo vệ session)
      login/page.tsx
      products/
        page.tsx         ← Danh sách admin
        create/page.tsx
        [id]/edit/page.tsx
    api/                 ← Route Handlers
  components/
    layout/              ← Header, Footer
    product/             ← ProductCard, Grid, Filters
    admin/               ← Form, Table, ImageUpload
    common/              ← Pagination, EmptyState, Skeleton
  lib/
    auth/session.ts      ← JWT session
    repositories/        ← Prisma queries
    services/            ← Business logic
    validations/         ← Zod schemas
    prisma.ts
    supabase-admin.ts
prisma/
  schema.prisma
  seed.ts
```

## Kiểm tra trước khi deploy

```bash
npm run build
```

## Deploy lên Vercel

1. Push code lên GitHub.
2. Import vào [vercel.com](https://vercel.com).
3. Thêm tất cả environment variables.
4. Deploy.

> **Lưu ý**: Sau khi deploy lần đầu, chạy `npm run db:migrate -- --name init` ở môi trường local với `DIRECT_URL` trỏ đến production DB để tạo schema.
