import Link from "next/link";
import { MessageSquare, Users, Sparkles, Heart, MessageCircle, Share2, Award, Camera, ShieldCheck } from "lucide-react";
import { findCommunityFeed } from "@/lib/repositories/community.repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diễn Đàn Cộng Đồng Collector Figure | ThienTam Studio",
  description: "Cộng đồng chia sẻ góc trưng bày mô hình figure, review sản phẩm, thảo luận và giao lưu collector Việt Nam.",
};

export default async function CommunityPage() {
  const { posts } = await findCommunityFeed({ limit: 20 });

  return (
    <div className="bg-[#0B0E17] min-h-screen py-8 text-gray-100">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="bg-[#141824] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 text-[#E05638] text-xs font-extrabold uppercase tracking-wider mb-2 drop-shadow-[0_0_8px_rgba(224,86,56,0.4)]">
            <Users className="w-4 h-4" /> CỘNG ĐỒNG COLLECTOR THIENTAM
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Góc Khoe Mô Hình & Thảo Luận Sưu Tầm
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Nơi hàng ngàn đam mê hội tụ: Đăng tải bộ sưu tập tủ Figure, hỏi đáp kinh nghiệm chống mốc bụi, và cập nhật những tin tức mở bán Pre-order mới nhất.
          </p>
        </div>

        {/* Join Community CTA */}
        <div className="bg-gradient-to-r from-[#141824] via-[#1b2133] to-[#251014] rounded-3xl p-6 text-white border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-base sm:text-lg flex items-center justify-center sm:justify-start gap-2">
              <Camera className="w-5 h-5 text-[#E05638]" /> Khoe Góc Trưng Bày Của Bạn
            </h3>
            <p className="text-gray-300 text-xs max-w-md">
              Đăng nhập tài khoản ThienTam để tự do đăng tải hình ảnh bộ sưu tập và nhận lượt thích từ cộng đồng!
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(224,86,56,0.4)] transition-all"
            >
              Đăng Nhập
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 transition-all"
            >
              Tạo Tài Khoản
            </Link>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-[#141824] p-12 text-center rounded-3xl border border-white/10 shadow-xl space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="font-extrabold text-white text-base">Chưa có bài viết nào trong diễn đàn</h3>
            <p className="text-gray-400 text-xs">Hãy là người đầu tiên mở màn bài đăng chia sẻ mô hình nhé!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-[#E05638] object-cover shadow-[0_0_8px_rgba(224,86,56,0.5)]"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{post.author.displayName}</h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#E05638]/15 text-[#E05638] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-[#E05638]/30">
                    Collector
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <button className="flex items-center gap-1.5 hover:text-[#E05638] transition-colors font-semibold">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Yêu thích</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[#E05638] transition-colors font-semibold">
                    <MessageCircle className="w-4 h-4" />
                    <span>Bình luận</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[#E05638] transition-colors font-semibold">
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}