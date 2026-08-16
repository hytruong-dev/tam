import { notFound } from "next/navigation";
import { findCategoryById } from "@/lib/repositories/category.repository";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sửa danh mục | Admin" };

interface AdminEditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCategoryPage({ params }: AdminEditCategoryPageProps) {
  const { id } = await params;
  const category = await findCategoryById(id);

  if (!category) notFound();

  return (
    <div>
      <CategoryForm category={category} mode="edit" />
    </div>
  );
}
