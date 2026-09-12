"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, Camera, MessageSquare, Loader2 } from "lucide-react";
import { PostComposer } from "@/components/community/PostComposer";
import { PostCard } from "@/components/community/PostCard";
import type { PostWithAuthorAndMedia } from "@/lib/repositories/community.repository";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
}

interface CommunityFeedClientProps {
  initialPosts: PostWithAuthorAndMedia[];
}

export function CommunityFeedClient({ initialPosts }: CommunityFeedClientProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userChecked, setUserChecked] = useState(false);
  const [posts, setPosts] = useState<PostWithAuthorAndMedia[]>(initialPosts);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const fetchUser = useCallback(() => {
    fetch("/api/customer-auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setUser(json.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setUserChecked(true));
  }, []);

  const fetchFeed = useCallback(async () => {
    try {
      setLoadingFeed(true);
      const res = await fetch("/api/community/feed?limit=30");
      const json = await res.json();
      if (res.ok && json.data?.posts) {
        setPosts(json.data.posts);
      }
    } catch (err) {
      console.error("Failed to fetch feed", err);
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

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

        {/* Dynamic Post Composer or Login Banner */}
        {userChecked && (
          <>
            {user ? (
              /* User logged in -> Render PostComposer with active user */
              <PostComposer currentUser={user} onPostCreated={fetchFeed} />
            ) : (
              /* User NOT logged in -> Render Login CTA Banner */
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
            )}
          </>
        )}

        {/* Posts List */}
        {loadingFeed ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-[#E05638] animate-spin mx-auto" />
            <p className="text-xs text-gray-400 mt-2">Đang làm mới bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#141824] p-12 text-center rounded-3xl border border-white/10 shadow-xl space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="font-extrabold text-white text-base">Chưa có bài viết nào trong diễn đàn</h3>
            <p className="text-gray-400 text-xs">Hãy là người đầu tiên mở màn bài đăng chia sẻ mô hình nhé!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
