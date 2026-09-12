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
import { formatZodError } from "@/lib/utils";

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
  } catch (err: any) {
    console.error("[GET /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy chi tiết danh mục"}` }, { status: 500 });
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
    const body = await request.json().catch((err) => {
      console.error("[PUT /api/categories/[id]] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[PUT /api/categories/[id]] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu danh mục không hợp lệ: ${errorMsg}` }, { status: 422 });
    }

    const existing = await findCategoryById(id);
    if (!existing) {
      return NextResponse.json({ data: null, error: "Không tìm thấy danh mục" }, { status: 404 });
    }

    const slugTaken = await checkCategorySlugExists(parsed.data.slug, id);
    if (slugTaken) {
      return NextResponse.json({ data: null, error: "Slug danh mục đã tồn tại" }, { status: 409 });
    }

    const category = await updateCategory(id, parsed.data);
    return NextResponse.json({ data: category, error: null });
  } catch (err: any) {
    console.error("[PUT /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể cập nhật danh mục"}` }, { status: 500 });
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
  } catch (err: any) {
    console.error("[DELETE /api/categories/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể xóa danh mục"}` }, { status: 500 });
  }
}
