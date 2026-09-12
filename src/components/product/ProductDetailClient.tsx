"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, MessageCircle, Star, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { OrderModal } from "@/components/product/OrderModal";

interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const inStock = product.stock > 0;

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // New review form
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`);
      const json = await res.json();
      if (json.data) {
        setReviews(json.data);
        setAverageRating(json.averageRating || 5.0);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    setSubmittingReview(true);
    setReviewMessage(null);

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName || "Collector",
          rating,
          comment,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setReviewMessage("Cảm ơn bạn đã gửi đánh giá mô hình!");
        setComment("");
        fetchReviews();
      } else {
        setReviewMessage(json.error || "Gửi đánh giá thất bại");
      }
    } catch {
      setReviewMessage("Lỗi kết nối khi gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        <button
          onClick={() => setIsOrderModalOpen(true)}
          disabled={!inStock}
          className="flex-1 min-w-[200px] bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold rounded-xl py-3.5 px-6 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(224,86,56,0.4)] transition-all disabled:opacity-50"
        >
          <ShoppingBag className="w-4 h-4" />
          {inStock ? "ĐẶT MUA MÔ HÌNH NGAY" : "TẠM HẾT HÀNG"}
        </button>
        <a
          href="/community"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl py-3.5 px-5 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Tư Vấn Collector
        </a>
      </div>

      {/* Order Modal */}
      <OrderModal
        product={product}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Product Reviews & Rating Section */}
      <section className="bg-[#141824] rounded-3xl border border-white/10 shadow-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#E05638]" />
            <h2 className="font-heading text-xl font-extrabold text-white">
              Đánh Giá & Nhận Xét Từ Collector
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0E17] px-4 py-2 rounded-2xl border border-white/10">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(averageRating) ? "fill-amber-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="font-extrabold text-white text-sm">{averageRating} / 5</span>
            <span className="text-gray-400 text-xs">({reviews.length} đánh giá)</span>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handlePostReview} className="bg-[#0B0E17] p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Viết Đánh Giá Của Bạn</h3>

          {reviewMessage && (
            <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {reviewMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Họ tên của bạn</label>
              <input
                type="text"
                placeholder="VD: Minh Tuấn Collector"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#141824] border border-white/15 rounded-xl py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Đánh giá số sao</label>
              <div className="flex items-center gap-1 py-1 text-amber-400 cursor-pointer">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-400 font-bold mb-1">Nội dung nhận xét</label>
              <textarea
                rows={2}
                required
                placeholder="Chia sẻ nhận xét về độ hoàn thiện, đường sơn, khớp nối hoặc dịch vụ đóng gói..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#141824] border border-white/15 rounded-xl py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-[0_0_10px_rgba(224,86,56,0.3)] transition-all disabled:opacity-50"
          >
            {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "GỬI ĐÁNH GIÁ"}
          </button>
        </form>

        {/* Reviews List */}
        {loadingReviews ? (
          <div className="py-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#E05638]" /> Đang tải nhận xét...
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-400">Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét mô hình này!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#0B0E17] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{rev.authorName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-[11px]">{new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star key={st} className={`w-3.5 h-3.5 ${st <= rev.rating ? "fill-amber-400" : "text-gray-600"}`} />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
