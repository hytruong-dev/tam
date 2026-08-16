import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thêm danh mục | Admin" };

export default function AdminCreateCategoryPage() {
  return (
    <div>
      <CategoryForm mode="create" />
    </div>
  );
}
