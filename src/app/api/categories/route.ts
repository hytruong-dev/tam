import { NextResponse } from "next/server";
import { findAllCategories, createCategory, checkCategorySlugExists } from "@/lib/repositories/category.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/category";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await findAllCategories();
    return NextResponse.json({ data: categories, error: null });
  } catch (err: any) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy danh mục"}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/categories] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/categories] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu danh mục không hợp lệ: ${errorMsg}` }, { status: 422 });
    }

    const slugTaken = await checkCategorySlugExists(parsed.data.slug);
    if (slugTaken) {
      return NextResponse.json({ data: null, error: "Slug danh mục đã tồn tại" }, { status: 409 });
    }

    const category = await createCategory(parsed.data);
    return NextResponse.json({ data: category, error: null }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể tạo danh mục"}` }, { status: 500 });
  }
}
