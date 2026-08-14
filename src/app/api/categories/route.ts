import { NextResponse } from "next/server";
import { findAllCategories } from "@/lib/repositories/category.repository";

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
