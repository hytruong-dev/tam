import { NextResponse } from "next/server";
import { productUpdateSchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";
import {
  getProductById,
  updateExistingProduct,
  deleteExistingProduct,
} from "@/lib/services/product.service";
import { isAdminAuthenticated } from "@/lib/auth/session";

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
  } catch (err) {
    console.error("[GET /api/products/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
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
    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const product = await updateExistingProduct(id, parsed.data);
    return NextResponse.json({ data: product, error: null });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "SLUG_EXISTS") {
        return NextResponse.json(
          { data: null, error: "Slug đã tồn tại" },
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
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
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
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json(
        { data: null, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/products/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
