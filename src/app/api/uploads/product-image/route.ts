import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
import {
  validateImageFile,
  uploadProductImage,
} from "@/lib/services/storage.service";

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { data: null, error: "Không tìm thấy file ảnh" },
        { status: 400 }
      );
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { data: null, error: validation.error },
        { status: 415 }
      );
    }

    const { url, path } = await uploadProductImage(file);
    return NextResponse.json({ data: { url, path }, error: null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/uploads/product-image]", err);
    return NextResponse.json({ data: null, error: "Upload thất bại" }, { status: 500 });
  }
}
