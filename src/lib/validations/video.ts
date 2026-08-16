import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(200),
  youtubeUrl: z
    .string()
    .min(1, "Link YouTube không được để trống")
    .refine(
      (url) => extractYoutubeId(url) !== null,
      "Link YouTube không hợp lệ. Hỗ trợ: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/..."
    ),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

export type VideoInput = z.infer<typeof videoSchema>;

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  // youtube.com/embed/ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}
