import { notFound } from "next/navigation";
import { findAllCategories } from "@/lib/repositories/category.repository";
import { getProductById } from "@/lib/services/product.service";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sửa sản phẩm | Admin" };

interface AdminEditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    findAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <ProductForm categories={categories} product={product} mode="edit" />
    </div>
  );
}
