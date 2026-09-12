import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
  { id: "cat-2", name: "Movie Figure", slug: "movie-figure", createdAt: new Date() },
  { id: "cat-3", name: "Gundam & Gunpla", slug: "gundam-gunpla", createdAt: new Date() },
];

export async function findAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    if (categories.length > 0) return categories;
  } catch {
    // Fallback
  }
  return FALLBACK_CATEGORIES;
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await prisma.category.findUnique({ where: { slug } });
    if (res) return res;
  } catch {
    // Fallback
  }
  return FALLBACK_CATEGORIES.find((c) => c.slug === slug) || FALLBACK_CATEGORIES[0];
}

export async function findCategoryById(id: string): Promise<Category | null> {
  try {
    const res = await prisma.category.findUnique({ where: { id } });
    if (res) return res;
  } catch {
    // Fallback
  }
  return FALLBACK_CATEGORIES.find((c) => c.id === id) || FALLBACK_CATEGORIES[0];
}

export async function createCategory(data: {
  name: string;
  slug: string;
}): Promise<Category> {
  try {
    const newCat = await prisma.category.create({ data });
    FALLBACK_CATEGORIES.push(newCat);
    return newCat;
  } catch {
    const fallbackCat: Category = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      createdAt: new Date(),
    };
    FALLBACK_CATEGORIES.push(fallbackCat);
    return fallbackCat;
  }
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string }
): Promise<Category> {
  try {
    const res = await prisma.category.update({ where: { id }, data });
    const idx = FALLBACK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) FALLBACK_CATEGORIES[idx] = res;
    return res;
  } catch {
    const existing = FALLBACK_CATEGORIES.find((c) => c.id === id) || FALLBACK_CATEGORIES[0];
    const updated = { ...existing, ...data };
    const idx = FALLBACK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) FALLBACK_CATEGORIES[idx] = updated;
    return updated;
  }
}

export async function deleteCategory(id: string): Promise<Category> {
  try {
    const res = await prisma.category.delete({ where: { id } });
    const idx = FALLBACK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) FALLBACK_CATEGORIES.splice(idx, 1);
    return res;
  } catch {
    const idx = FALLBACK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const removed = FALLBACK_CATEGORIES[idx];
      FALLBACK_CATEGORIES.splice(idx, 1);
      return removed;
    }
    return FALLBACK_CATEGORIES[0];
  }
}

export async function checkCategorySlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const count = await prisma.category.count({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
    });
    return count > 0;
  } catch {
    return FALLBACK_CATEGORIES.some((c) => c.slug === slug && c.id !== excludeId);
  }
}

export async function getCategoryProductCount(id: string): Promise<number> {
  try {
    return await prisma.product.count({ where: { categoryId: id } });
  } catch {
    return 0;
  }
}
