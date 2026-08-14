import "server-only";
import {
  findProducts,
  findProductBySlug,
  findProductById,
  findRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  checkSlugExists,
  type ProductWithCategory,
} from "@/lib/repositories/product.repository";
import type { ProductQuery, ProductInput } from "@/lib/validations/product";
import { deleteProductImage } from "@/lib/services/storage.service";

export async function getProducts(
  query: ProductQuery,
  adminMode = false
): Promise<{ products: ProductWithCategory[]; total: number; totalPages: number }> {
  const { products, total } = await findProducts(query, adminMode);
  const totalPages = Math.ceil(total / query.limit);
  return { products, total, totalPages };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  return findProductBySlug(slug);
}

export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return findProductById(id);
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  return findRelatedProducts(categoryId, excludeId, limit);
}

export async function createNewProduct(
  data: ProductInput
): Promise<ProductWithCategory> {
  const slugTaken = await checkSlugExists(data.slug);
  if (slugTaken) {
    throw new Error("SLUG_EXISTS");
  }
  return createProduct(data);
}

export async function updateExistingProduct(
  id: string,
  data: Partial<ProductInput>
): Promise<ProductWithCategory> {
  if (data.slug) {
    const slugTaken = await checkSlugExists(data.slug, id);
    if (slugTaken) {
      throw new Error("SLUG_EXISTS");
    }
  }

  const existing = await findProductById(id);
  if (!existing) throw new Error("NOT_FOUND");

  const updated = await updateProduct(id, data);

  // Clean up old image if replaced
  if (
    data.imageUrl &&
    data.imageUrl !== existing.imageUrl &&
    existing.imagePath
  ) {
    await deleteProductImage(existing.imagePath);
  }

  return updated;
}

export async function deleteExistingProduct(
  id: string
): Promise<ProductWithCategory> {
  const existing = await findProductById(id);
  if (!existing) throw new Error("NOT_FOUND");

  const deleted = await deleteProduct(id);

  // Attempt to clean up image; log failure but don't rollback
  if (deleted.imagePath) {
    await deleteProductImage(deleted.imagePath);
  }

  return deleted;
}
