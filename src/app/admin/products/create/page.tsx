import { findAllCategories } from "@/lib/repositories/category.repository";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thêm sản phẩm | Admin" };

export default async function AdminCreateProductPage() {
  const categories = await findAllCategories();

  return (
    <div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
