"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PostComposerProps {
  onPostCreated?: () => void;
  currentUser?: { displayName: string; avatarUrl?: string | null } | null;
}

export function PostComposer({ onPostCreated, currentUser }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-white rounded border border-border p-6 text-center space-y-3 mb-6 shadow-sm">
        <Sparkles className="w-8 h-8 text-gold mx-auto" />
        <h3 className="font-heading text-lg font-bold text-ink">Tham gia cộng đồng ThienTam</h3>
        <p className="text-muted-foreground text-xs max-w-sm mx-auto">
          Đăng nhập ngay để chia sẻ góc trưng bày mô hình, viết bài review và thảo luận cùng người chơi khác.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 bg-copper text-white font-semibold text-xs rounded hover:bg-copper/90 transition-colors"
          >
            Đăng nhập
          </a>
          <a
            href="/auth/register"
            className="inline-flex items-center px-4 py-2 border border-border text-ink font-semibold text-xs rounded hover:bg-black/5 transition-colors"
          >
            Đăng ký
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    try {
      setSubmitting(true);
      const mediaUrls = imageUrl.trim() ? [imageUrl.trim()] : [];

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          topic: topic.trim() || undefined,
          mediaUrls,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Không thể đăng bài viết");
        return;
      }

      toast.success("Đã đăng bài viết mới!");
      setContent("");
      setTopic("");
      setImageUrl("");
      if (onPostCreated) onPostCreated();
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded border border-border p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={currentUser.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
          alt="Avatar"
          className="w-9 h-9 rounded-full border border-border object-cover"
        />
        <div>
          <p className="text-xs font-semibold text-ink">{currentUser.displayName}</p>
          <p className="text-[10px] text-muted-foreground">Chia sẻ đam mê mô hình</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hãy chia sẻ góc trưng bày figure, cảm nhận hoặc thắc mắc của bạn..."
          rows={3}
          className="text-sm bg-ivory/30"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Chủ đề (VD: ShowGocTrungBay, ReviewFigure)..."
            className="text-xs"
          />
          <div className="relative">
            <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL hình ảnh đính kèm (nếu có)"
              className="text-xs pl-8"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-copper hover:bg-copper/90 text-white rounded text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
          >
            {submitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang đăng...</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> ĐĂNG BÀI</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
