import { prisma } from "@/lib/prisma";
import type { ProductQuery, ProductInput } from "@/lib/validations/product";
import type { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export async function findProducts(
  query: ProductQuery,
  adminMode = false
): Promise<{ products: ProductWithCategory[]; total: number }> {
  const { q, category, sort, page, limit, featured, isNew } = query;

  const where: Prisma.ProductWhereInput = {};

  if (!adminMode) {
    where.isActive = true;
  }
  if (featured !== undefined) {
    where.isFeatured = featured;
  }
  if (isNew !== undefined) {
    where.isNew = isNew;
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export async function findProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });
}

export async function findProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function findRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function createProduct(
  data: ProductInput
): Promise<ProductWithCategory> {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      author: data.author ?? null,
      shortDescription: data.shortDescription,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath ?? null,
      price: data.price,
      originalPrice: data.originalPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      isActive: data.isActive ?? true,
    },
    include: { category: true },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<ProductInput>
): Promise<ProductWithCategory> {
  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.shortDescription !== undefined && {
        shortDescription: data.shortDescription,
      }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.originalPrice !== undefined && {
        originalPrice: data.originalPrice,
      }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.isNew !== undefined && { isNew: data.isNew }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { category: true },
  });
}

export async function deleteProduct(id: string): Promise<ProductWithCategory> {
  return prisma.product.delete({
    where: { id },
    include: { category: true },
  });
}

export async function checkSlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const count = await prisma.product.count({
    where: { slug, ...(excludeId && { id: { not: excludeId } }) },
  });
  return count > 0;
}
