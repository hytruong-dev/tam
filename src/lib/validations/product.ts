import { z } from "zod";
import { ProductStatus } from "@prisma/client";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Tên mô hình không được để trống")
    .max(200, "Tên mô hình không được quá 200 ký tự"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  sku: z.string().max(100).optional().nullable(),
  author: z.string().max(100).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  series: z.string().max(100).optional().nullable(),
  scale: z.string().max(50).optional().nullable(),
  material: z.string().max(100).optional().nullable(),
  dimensions: z.string().max(100).optional().nullable(),
  productStatus: z.nativeEnum(ProductStatus).default(ProductStatus.IN_STOCK),
  preorderEndsAt: z.string().optional().nullable(),
  seoTitle: z.string().max(150).optional().nullable(),
  seoDescription: z.string().max(300).optional().nullable(),
  shortDescription: z
    .string()
    .min(1, "Mô tả ngắn không được để trống")
    .max(500, "Mô tả ngắn không được quá 500 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả chi tiết không được để trống"),
  imageUrl: z.string().min(1, "URL hoặc đường dẫn ảnh không hợp lệ"),
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
  categoryId: z.string().min(1, "Danh mục không hợp lệ"),
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
  brand: z.string().max(100).optional(),
  series: z.string().max(100).optional(),
  scale: z.string().max(50).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
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
