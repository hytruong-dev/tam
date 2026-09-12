import { NextResponse } from "next/server";
import { productQuerySchema, productSchema } from "@/lib/validations/product";
import { getProducts, createNewProduct } from "@/lib/services/product.service";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = {
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      featured: searchParams.get("featured") ?? undefined,
      isNew: searchParams.get("isNew") ?? undefined,
      admin: searchParams.get("admin") ?? undefined,
    };

    const parsed = productQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[GET /api/products] Validation error:", errorMsg);
      return NextResponse.json(
        { data: null, error: `Query không hợp lệ: ${errorMsg}` },
        { status: 400 }
      );
    }

    const adminMode = parsed.data.admin && (await isAdminAuthenticated());
    const result = await getProducts(parsed.data, !!adminMode);
    return NextResponse.json({ data: result, error: null });
  } catch (err: any) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy danh sách sản phẩm"}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/products] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json(
        { data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" },
        { status: 400 }
      );
    }

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/products] Validation error:", errorMsg);
      return NextResponse.json(
        { data: null, error: `Dữ liệu sản phẩm không hợp lệ: ${errorMsg}` },
        { status: 422 }
      );
    }

    const product = await createNewProduct(parsed.data);
    return NextResponse.json({ data: product, error: null }, { status: 201 });
  } catch (err: any) {
    if (err instanceof Error && err.message === "SLUG_EXISTS") {
      return NextResponse.json(
        { data: null, error: "Slug sản phẩm đã tồn tại" },
        { status: 409 }
      );
    }
    console.error("[POST /api/products]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể tạo sản phẩm"}` }, { status: 500 });
  }
}
