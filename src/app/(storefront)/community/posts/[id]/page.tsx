"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/community/PostCard";
import { CommentThread } from "@/components/community/CommentThread";
import type { PostWithAuthorAndMedia } from "@/lib/repositories/community.repository";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<PostWithAuthorAndMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/customer-auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.data?.id) setCurrentUserId(j.data.id);
      });

    fetch(`/api/community/posts/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) setPost(j.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0B0E17] min-h-screen py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-[#E05638] animate-spin" />
      </div>
    );
  }

  if (!post) return notFound();

  return (
    <div className="bg-[#0B0E17] min-h-screen py-8 text-gray-100">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E05638] font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
        </Link>

        <PostCard post={post} currentUserId={currentUserId} />
        <CommentThread postId={post.id} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
