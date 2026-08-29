import { z } from "zod";
import { TargetType } from "@prisma/client";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung bài viết không được để trống")
    .max(5000, "Nội dung bài viết tối đa 5000 ký tự"),
  topic: z.string().max(50).optional().nullable(),
  mediaUrls: z.array(z.string().url()).max(10).optional().default([]),
});

export const commentSchema = z.object({
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional().nullable(),
  content: z
    .string()
    .min(1, "Bình luận không được để trống")
    .max(1000, "Bình luận tối đa 1000 ký tự"),
});

export const reactionSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().uuid(),
});

export const reportSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().uuid(),
  reason: z.string().min(1, "Vui lòng chọn hoặc nhập lý do báo cáo").max(300),
});

export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
