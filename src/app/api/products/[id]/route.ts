import { NextResponse } from "next/server";
import { productUpdateSchema } from "@/lib/validations/product";
import {
  getProductById,
  updateExistingProduct,
  deleteExistingProduct,
} from "@/lib/services/product.service";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { data: null, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: product, error: null });
  } catch (err: any) {
    console.error("[GET /api/products/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy chi tiết sản phẩm"}` }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch((err) => {
      console.error("[PUT /api/products/[id]] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json(
        { data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" },
        { status: 400 }
      );
    }

    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[PUT /api/products/[id]] Validation error:", errorMsg);
      return NextResponse.json(
        { data: null, error: `Dữ liệu cập nhật sản phẩm không hợp lệ: ${errorMsg}` },
        { status: 422 }
      );
    }

    const product = await updateExistingProduct(id, parsed.data);
    return NextResponse.json({ data: product, error: null });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.message === "SLUG_EXISTS") {
        return NextResponse.json(
          { data: null, error: "Slug sản phẩm đã tồn tại" },
          { status: 409 }
        );
      }
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { data: null, error: "Sản phẩm không tồn tại" },
          { status: 404 }
        );
      }
    }
    console.error("[PUT /api/products/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể cập nhật sản phẩm"}` }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const product = await deleteExistingProduct(id);
    return NextResponse.json({ data: product, error: null });
  } catch (err: any) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json(
        { data: null, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/products/[id]]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể xóa sản phẩm"}` }, { status: 500 });
  }
}
