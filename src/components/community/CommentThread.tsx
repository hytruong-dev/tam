"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

interface CommentThreadProps {
  postId: string;
  currentUserId?: string;
}

export function CommentThread({ postId, currentUserId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`);
      const json = await res.json();
      if (res.ok) {
        setComments(json.data);
      }
    } catch {
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const json = await res.json();

      if (res.ok) {
        setContent("");
        fetchComments();
      } else {
        toast.error(json.error || "Gửi bình luận thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141824] rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl space-y-4 text-white">
      <h3 className="font-extrabold text-white text-sm">Bình luận ({comments.length})</h3>

      {/* Input */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="text-xs flex-1 bg-[#0B0E17] border border-white/15 text-white placeholder:text-gray-500 rounded-xl"
          />
          <Button type="submit" disabled={submitting} className="bg-[#E05638] hover:bg-[#E05638]/90 text-white text-xs px-4 rounded-xl font-bold shadow-[0_0_10px_rgba(224,86,56,0.4)]">
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </Button>
        </form>
      ) : (
        <p className="text-xs text-gray-400 bg-[#0B0E17]/60 p-3.5 rounded-2xl border border-white/10 text-center">
          Vui lòng{" "}
          <a href="/auth/login" className="text-[#E05638] font-bold underline">
            Đăng nhập
          </a>{" "}
          để tham gia bình luận.
        </p>
      )}

      {/* List */}
      {loading ? (
        <p className="text-xs text-gray-400">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-500 italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-3 pt-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 text-xs bg-[#0B0E17]/80 p-3.5 rounded-2xl border border-white/10">
              <img
                src={c.author.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                alt={c.author.displayName}
                className="w-8 h-8 rounded-full border border-white/20 object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-white">{c.author.displayName}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
