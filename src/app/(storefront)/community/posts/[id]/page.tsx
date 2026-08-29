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
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-copper animate-spin" />
      </div>
    );
  }

  if (!post) return notFound();

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-copper mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
      </Link>

      <PostCard post={post} currentUserId={currentUserId} />
      <CommentThread postId={post.id} currentUserId={currentUserId} />
    </div>
  );
}
