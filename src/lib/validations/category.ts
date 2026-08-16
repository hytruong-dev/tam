import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(100),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
