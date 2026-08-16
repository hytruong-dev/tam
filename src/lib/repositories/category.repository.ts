import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export async function findAllCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { slug } });
}

export async function findCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(data: {
  name: string;
  slug: string;
}): Promise<Category> {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string }
): Promise<Category> {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string): Promise<Category> {
  return prisma.category.delete({ where: { id } });
}

export async function checkCategorySlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const count = await prisma.category.count({
    where: { slug, ...(excludeId && { id: { not: excludeId } }) },
  });
  return count > 0;
}

export async function getCategoryProductCount(id: string): Promise<number> {
  return prisma.product.count({ where: { categoryId: id } });
}
