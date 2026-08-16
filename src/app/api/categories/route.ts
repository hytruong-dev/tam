import { NextResponse } from "next/server";
import { findAllCategories, createCategory, checkCategorySlugExists } from "@/lib/repositories/category.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await findAllCategories();
    return NextResponse.json({ data: categories, error: null });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 422 });
    }

    const slugTaken = await checkCategorySlugExists(parsed.data.slug);
    if (slugTaken) {
      return NextResponse.json({ data: null, error: "Slug đã tồn tại" }, { status: 409 });
    }

    const category = await createCategory(parsed.data);
    return NextResponse.json({ data: category, error: null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
