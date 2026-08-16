"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";

interface CategoryFormProps {
  category?: Category;
  mode: "create" | "edit";
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!category);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema) as never,
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      setValue("slug", slugify(nameValue), { shouldDirty: true });
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  const onSubmit = async (data: CategoryInput) => {
    try {
      const url = isEdit ? `/api/categories/${category!.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Slug đã tồn tại, vui lòng chọn slug khác");
        } else if (json.error?.fieldErrors) {
          const firstError = Object.values(
            json.error.fieldErrors as Record<string, string[]>
          )[0]?.[0];
          toast.error(firstError || "Dữ liệu không hợp lệ");
        } else {
          toast.error(json.error || "Có lỗi xảy ra");
        }
        return;
      }

      toast.success(isEdit ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-8 h-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-ink">
            {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gold hover:bg-gold/90 text-charcoal rounded-none font-semibold text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
            </>
          ) : isEdit ? (
            "Lưu thay đổi"
          ) : (
            "Thêm danh mục"
          )}
        </Button>
      </div>

      <div className="max-w-lg bg-white p-6 rounded shadow-sm space-y-5">
        <h2 className="font-semibold text-ink border-b border-border pb-2">Thông tin danh mục</h2>

        <div>
          <Label htmlFor="name">
            Tên danh mục <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="VD: Nendoroid"
            className="mt-1.5"
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">
            Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="nendoroid"
            className="mt-1.5 font-mono text-sm"
            onChange={(e) => {
              setSlugManuallyEdited(true);
              register("slug").onChange(e);
            }}
          />
          {errors.slug && (
            <p className="text-destructive text-xs mt-1">{errors.slug.message}</p>
          )}
          <p className="text-muted-foreground text-xs mt-1">
            Slug dùng trong URL. Tự tạo từ tên, chỉnh tay nếu cần.
          </p>
        </div>
      </div>
    </form>
  );
}
