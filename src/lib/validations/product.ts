import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(200, "Tên sản phẩm không được quá 200 ký tự"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  author: z.string().max(100).optional().nullable(),
  shortDescription: z
    .string()
    .min(1, "Mô tả ngắn không được để trống")
    .max(500, "Mô tả ngắn không được quá 500 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả chi tiết không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePath: z.string().optional().nullable(),
  price: z
    .number({ required_error: "Giá bán không được để trống" })
    .positive("Giá bán phải lớn hơn 0")
    .int("Giá phải là số nguyên (VND)"),
  originalPrice: z
    .number()
    .positive("Giá gốc phải lớn hơn 0")
    .int("Giá phải là số nguyên (VND)")
    .optional()
    .nullable(),
  stock: z
    .number({ required_error: "Số lượng không được để trống" })
    .int("Số lượng phải là số nguyên")
    .min(0, "Số lượng không được âm"),
  categoryId: z.string().uuid("Danh mục không hợp lệ"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const productUpdateSchema = productSchema.partial().required({
  name: true,
  slug: true,
  shortDescription: true,
  description: true,
  imageUrl: true,
  price: true,
  stock: true,
  categoryId: true,
});

export const productQuerySchema = z.object({
  q: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  featured: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  admin: z.coerce.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
