"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ExternalLink, Link2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { videoSchema, type VideoInput, extractYoutubeId } from "@/lib/validations/video";
import { getErrorMessage } from "@/lib/utils";
import type { Video } from "@prisma/client";

interface VideoFormProps {
  video?: Video;
  mode: "create" | "edit";
}

export function VideoForm({ video, mode }: VideoFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [previewId, setPreviewId] = useState<string | null>(
    video?.youtubeId ?? null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema) as never,
    defaultValues: {
      title: video?.title ?? "",
      youtubeUrl: video?.youtubeUrl ?? "",
      description: video?.description ?? "",
      isActive: video?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");
  const youtubeUrl = watch("youtubeUrl");

  const handleUrlBlur = () => {
    const id = extractYoutubeId(youtubeUrl);
    setPreviewId(id);
  };

  const onSubmit = async (data: VideoInput) => {
    try {
      const url = isEdit ? `/api/videos/${video!.id}` : "/api/videos";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(getErrorMessage(json.error, "Có lỗi xảy ra khi lưu video"));
        return;
      }

      toast.success(isEdit ? "Đã cập nhật video" : "Đã thêm video mới");
      router.push("/admin/videos");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-white">
            {isEdit ? "Sửa video" : "Thêm video mới"}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#E05638] hover:bg-[#E05638]/90 text-white rounded-xl font-extrabold text-xs px-5 py-2.5 shadow-[0_0_15px_rgba(224,86,56,0.4)] transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
            </>
          ) : isEdit ? (
            "Lưu thay đổi"
          ) : (
            "Thêm video"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl text-white">
          <h2 className="font-extrabold text-white border-b border-white/10 pb-3 text-base">
            Thông tin video YouTube Review
          </h2>

          <div>
            <Label htmlFor="title" className="text-gray-300 text-xs font-bold">
              Tiêu đề <span className="text-[#E05638]">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="VD: Review Figure Naruto - Bandai S.H.Figuarts"
              className="mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs py-2.5 px-3.5"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="youtubeUrl" className="text-gray-300 text-xs font-bold">
              Link YouTube <span className="text-[#E05638]">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E05638]" />
              <Input
                id="youtubeUrl"
                {...register("youtubeUrl")}
                onBlur={handleUrlBlur}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-10 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs py-2.5 px-3.5"
              />
            </div>
            {errors.youtubeUrl && (
              <p className="text-red-400 text-xs mt-1">{errors.youtubeUrl.message}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Hỗ trợ: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300 text-xs font-bold">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả ngắn về nội dung video..."
              rows={3}
              className="mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs p-3.5"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3 text-white">
            <h2 className="font-extrabold text-white border-b border-white/10 pb-2 text-sm">
              Xem trước Video 4K
            </h2>
            {previewId ? (
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10">
                  <Image
                    src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${previewId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#E05638] hover:underline font-bold"
                >
                  <ExternalLink className="w-3 h-3" />
                  Mở trên YouTube
                </a>
              </div>
            ) : (
              <div className="aspect-video w-full bg-[#0B0E17] rounded-2xl border border-white/10 flex items-center justify-center">
                <p className="text-xs text-gray-400 text-center px-4">
                  Nhập link YouTube và click ra ngoài để xem trước
                </p>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white">
            <h2 className="font-extrabold text-white border-b border-white/10 pb-2 text-sm">
              Tùy chọn trạng thái
            </h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="font-normal cursor-pointer text-gray-300 text-xs">
                Hiển thị trên storefront
              </Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setValue("isActive", v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
