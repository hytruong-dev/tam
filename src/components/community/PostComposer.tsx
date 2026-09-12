"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Send, Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";

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
      <div className="bg-[#141824] rounded-3xl border border-white/10 p-6 text-center space-y-3 mb-6 shadow-xl text-white">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white mx-auto shadow-[0_0_15px_rgba(224,86,56,0.4)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white">Tham gia diễn đàn ThienTam Studio</h3>
        <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
          Đăng nhập ngay để chia sẻ góc trưng bày mô hình, viết bài review và giao lưu thảo luận cùng các Collector khác.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E05638] text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(224,86,56,0.4)] hover:bg-[#E05638]/90 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" /> Đăng nhập
          </a>
          <a
            href="/auth/register"
            className="inline-flex items-center px-4 py-2 border border-white/20 text-white font-extrabold text-xs rounded-xl bg-white/5 hover:bg-white/15 transition-all"
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
        toast.error(getErrorMessage(json.error, "Không thể đăng bài viết"));
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
    <div className="bg-[#141824] rounded-3xl border border-white/10 p-5 sm:p-6 mb-6 shadow-xl text-white space-y-4">
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-[#E05638] object-cover shadow-[0_0_10px_rgba(224,86,56,0.4)]"
        />
        <div>
          <p className="text-xs font-extrabold text-white">{currentUser.displayName}</p>
          <p className="text-[10px] text-gray-400">Chia sẻ đam mê mô hình figure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hãy chia sẻ góc trưng bày figure, cảm nhận hoặc thắc mắc của bạn..."
          rows={3}
          className="text-xs bg-[#0B0E17] border border-white/15 text-white placeholder:text-gray-500 focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] rounded-xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Chủ đề (VD: ShowGocTrungBay, ReviewFigure)..."
            className="text-xs bg-[#0B0E17] border border-white/15 text-white placeholder:text-gray-500 rounded-xl"
          />
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL hình ảnh đính kèm (nếu có)"
              className="text-xs pl-8 bg-[#0B0E17] border border-white/15 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#E05638] hover:bg-[#E05638]/90 text-white rounded-xl text-xs px-5 py-2.5 font-extrabold shadow-[0_0_15px_rgba(224,86,56,0.4)] flex items-center gap-1.5 transition-all"
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
