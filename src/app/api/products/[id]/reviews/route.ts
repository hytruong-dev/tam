import { NextRequest, NextResponse } from "next/server";

interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

const MEMORY_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "p1",
    authorName: "Tuấn Anh Gundam",
    rating: 5,
    comment: "Siêu phẩm MGEX mạ vàng quá đỉnh, chi tiết khớp nối đầm tay. Đóng gói xốp 3 lớp nguyên vẹn box!",
    isVerifiedPurchase: true,
    createdAt: new Date("2026-09-08").toISOString(),
  },
  {
    id: "rev-2",
    productId: "p1",
    authorName: "Đức Collector",
    rating: 5,
    comment: "Giao hàng siêu nhanh từ ThienTam Studio. Hàng full box authentic 100%. Sẽ ủng hộ dài dài!",
    isVerifiedPurchase: true,
    createdAt: new Date("2026-09-09").toISOString(),
  },
  {
    id: "rev-3",
    productId: "p2",
    authorName: "Hoàng Long HotToys",
    rating: 5,
    comment: "Khuôn mặt RDJ quá giống thật, chất liệu Diecast đầm tay. 10/10 điểm uy tín!",
    isVerifiedPurchase: true,
    createdAt: new Date("2026-09-10").toISOString(),
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = MEMORY_REVIEWS.filter((r) => r.productId === id);

    const averageRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 5.0;

    return NextResponse.json({
      success: true,
      total: reviews.length,
      averageRating,
      data: reviews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.comment || !body.rating) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đánh giá và số sao" },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: id,
      authorName: body.authorName || "Collector Ẩn Danh",
      rating: Number(body.rating) || 5,
      comment: body.comment,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    MEMORY_REVIEWS.unshift(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn đã gửi đánh giá mô hình!",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to post review" },
      { status: 500 }
    );
  }
}
