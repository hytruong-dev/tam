import { prisma } from "@/lib/prisma";
import type { ProductQuery, ProductInput } from "@/lib/validations/product";
import type { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true; videoProducts: { include: { video: true } } };
}>;

export async function findProducts(
  query: ProductQuery,
  adminMode = false
): Promise<{ products: ProductWithCategory[]; total: number }> {
  const {
    q,
    category,
    brand,
    series,
    scale,
    status,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
    featured,
    isNew,
  } = query;

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
  if (status) {
    where.productStatus = status;
  }
  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }
  if (series) {
    where.series = { contains: series, mode: "insensitive" };
  }
  if (scale) {
    where.scale = scale;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { series: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
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
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
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
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
  });
}

export async function findProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
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
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
  });
}

export async function createProduct(
  data: ProductInput
): Promise<ProductWithCategory> {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku ?? null,
      author: data.author ?? null,
      brand: data.brand ?? null,
      series: data.series ?? null,
      scale: data.scale ?? null,
      material: data.material ?? null,
      dimensions: data.dimensions ?? null,
      productStatus: data.productStatus,
      preorderEndsAt: data.preorderEndsAt ? new Date(data.preorderEndsAt) : null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
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
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
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
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.series !== undefined && { series: data.series }),
      ...(data.scale !== undefined && { scale: data.scale }),
      ...(data.material !== undefined && { material: data.material }),
      ...(data.dimensions !== undefined && { dimensions: data.dimensions }),
      ...(data.productStatus !== undefined && { productStatus: data.productStatus }),
      ...(data.preorderEndsAt !== undefined && {
        preorderEndsAt: data.preorderEndsAt ? new Date(data.preorderEndsAt) : null,
      }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
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
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
  });
}

export async function deleteProduct(id: string): Promise<ProductWithCategory> {
  return prisma.product.delete({
    where: { id },
    include: {
      category: true,
      videoProducts: {
        include: { video: true },
      },
    },
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
