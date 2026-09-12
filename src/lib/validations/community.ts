import { z } from "zod";
import { TargetType } from "@prisma/client";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung bài viết không được để trống")
    .max(5000, "Nội dung bài viết tối đa 5000 ký tự"),
  topic: z.string().max(50).optional().nullable(),
  mediaUrls: z.array(z.string().min(1)).max(10).optional().default([]),
});

export const commentSchema = z.object({
  postId: z.string().min(1, "ID bài viết không hợp lệ"),
  parentId: z.string().min(1).optional().nullable(),
  content: z
    .string()
    .min(1, "Bình luận không được để trống")
    .max(1000, "Bình luận tối đa 1000 ký tự"),
});

export const reactionSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().min(1, "ID mục tương tác không hợp lệ"),
});

export const reportSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().min(1, "ID mục báo cáo không hợp lệ"),
  reason: z.string().min(1, "Vui lòng chọn hoặc nhập lý do báo cáo").max(300),
});

export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
