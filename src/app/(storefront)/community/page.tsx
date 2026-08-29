"use client";

import { useEffect, useState } from "react";
import { PostComposer } from "@/components/community/PostComposer";
import { PostCard } from "@/components/community/PostCard";
import type { PostWithAuthorAndMedia } from "@/lib/repositories/community.repository";
import { Sparkles, MessageSquare, Users } from "lucide-react";

interface UserInfo {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
}

export default function CommunityPage() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<PostWithAuthorAndMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/customer-auth/me");
      const json = await res.json();
      if (res.ok) setCurrentUser(json.data);
    } catch {
      setCurrentUser(null);
    }
  };

  const fetchFeed = async (topic?: string | null) => {
    setLoading(true);
    try {
      const url = topic ? `/api/community/feed?topic=${encodeURIComponent(topic)}` : "/api/community/feed";
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.data) {
        setPosts(json.data.posts);
      }
    } catch {
      console.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFeed();
  }, []);

  const handleTopicChange = (topic: string | null) => {
    setActiveTopic(topic);
    fetchFeed(topic);
  };

  const topics = [
    { label: "Tất cả", value: null },
    { label: "ShowGocTrungBay", value: "ShowGocTrungBay" },
    { label: "ReviewFigure", value: "ReviewFigure" },
    { label: "SanHangHopLy", value: "SanHangHopLy" },
    { label: "GundamModelKit", value: "GundamModelKit" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8 text-center sm:text-left">
        <p className="text-copper text-xs tracking-widest uppercase mb-1 font-semibold flex items-center justify-center sm:justify-start gap-1">
          <Users className="w-4 h-4" /> Cộng đồng sưu tầm ThienTam
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink">Góc Giao Lưu & Review</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nơi giao lưu, khoe góc trưng bày mô hình, hỏi đáp và trao đổi đam mê cùng hàng ngàn collector.
        </p>
      </div>

      {/* Topic Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {topics.map((t) => (
          <button
            key={t.label}
            onClick={() => handleTopicChange(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeTopic === t.value
                ? "bg-copper text-white border-copper"
                : "bg-white text-ink border-border hover:border-copper"
            }`}
          >
            {t.value ? `#${t.label}` : t.label}
          </button>
        ))}
      </div>

      {/* Post Composer */}
      <PostComposer currentUser={currentUser} onPostCreated={() => fetchFeed(activeTopic)} />

      {/* Feed list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded border border-border space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-16 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-border space-y-2">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-ink">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground text-xs">Hãy là người đầu tiên mở màn chủ đề này!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUser?.id}
            onDeleted={() => fetchFeed(activeTopic)}
          />
        ))
      )}
    </div>
  );
}
