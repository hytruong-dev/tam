import { NextResponse } from "next/server";
import {
  findCategoryById,
  updateCategory,
  deleteCategory,
  checkCategorySlugExists,
  getCategoryProductCount,
} from "@/lib/repositories/category.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/category";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await findCategoryById(id);
    if (!category) {
      return NextResponse.json({ data: null, error: "Không tìm thấy danh mục" }, { status: 404 });
    }
    return NextResponse.json({ data: category, error: null });
  } catch (err) {
    console.error("[GET /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 422 });
    }

    const existing = await findCategoryById(id);
    if (!existing) {
      return NextResponse.json({ data: null, error: "Không tìm thấy danh mục" }, { status: 404 });
    }

    const slugTaken = await checkCategorySlugExists(parsed.data.slug, id);
    if (slugTaken) {
      return NextResponse.json({ data: null, error: "Slug đã tồn tại" }, { status: 409 });
    }

    const category = await updateCategory(id, parsed.data);
    return NextResponse.json({ data: category, error: null });
  } catch (err) {
    console.error("[PUT /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await findCategoryById(id);
    if (!existing) {
      return NextResponse.json({ data: null, error: "Không tìm thấy danh mục" }, { status: 404 });
    }

    const productCount = await getCategoryProductCount(id);
    if (productCount > 0) {
      return NextResponse.json(
        { data: null, error: `Không thể xóa — danh mục đang có ${productCount} sản phẩm` },
        { status: 409 }
      );
    }

    const category = await deleteCategory(id);
    return NextResponse.json({ data: category, error: null });
  } catch (err) {
    console.error("[DELETE /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
