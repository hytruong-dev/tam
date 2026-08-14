"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";
import type { ProductWithCategory } from "@/lib/repositories/product.repository";

interface ProductFormProps {
  categories: Category[];
  product?: ProductWithCategory;
  mode: "create" | "edit";
}

export function ProductForm({ categories, product, mode }: ProductFormProps) {
  const router = useRouter();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!product);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      author: product?.author ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
      imagePath: product?.imagePath ?? "",
      price: product ? Number(product.price) : undefined,
      originalPrice: product?.originalPrice ? Number(product.originalPrice) : undefined,
      stock: product ? product.stock : undefined,
      categoryId: product?.categoryId ?? "",
      isFeatured: product?.isFeatured ?? false,
      isNew: product?.isNew ?? false,
      isActive: product?.isActive ?? true,
    },
  });

  const nameValue = watch("name");
  const isFeatured = watch("isFeatured");
  const isNew = watch("isNew");
  const isActive = watch("isActive");

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      setValue("slug", slugify(nameValue), { shouldDirty: true });
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  const handleImageUpload = useCallback(
    (url: string, path: string) => {
      setValue("imageUrl", url, { shouldDirty: true });
      setValue("imagePath", path, { shouldDirty: true });
    },
    [setValue]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
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
          const firstError = Object.values(json.error.fieldErrors as Record<string, string[]>)[0]?.[0];
          toast.error(firstError || "Dữ liệu không hợp lệ");
        } else {
          toast.error(json.error || "Có lỗi xảy ra");
        }
        return;
      }

      toast.success(isEdit ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới");
      router.push("/admin/products");
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
            {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gold hover:bg-gold/90 text-charcoal rounded-none font-semibold text-sm"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
          ) : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded shadow-sm">
          <h2 className="font-semibold text-ink border-b border-border pb-2">Thông tin sản phẩm</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="name">Tên sản phẩm <span className="text-destructive">*</span></Label>
              <Input id="name" {...register("name")} placeholder="VD: Bóng Tối Trong Mưa — Tập 1" className="mt-1.5" />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="sm:col-span-2">
              <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="bong-toi-trong-mua-tap-1"
                className="mt-1.5 font-mono text-sm"
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  register("slug").onChange(e);
                }}
              />
              {errors.slug && <p className="text-destructive text-xs mt-1">{errors.slug.message}</p>}
              <p className="text-muted-foreground text-xs mt-1">Slug tự tạo từ tên. Chỉnh tay sau khi nhập nếu cần.</p>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Tác giả</Label>
              <Input id="author" {...register("author")} placeholder="Tên tác giả" className="mt-1.5" />
            </div>

            {/* Category */}
            <div>
              <Label>Danh mục <span className="text-destructive">*</span></Label>
              <Select
                defaultValue={product?.categoryId ?? ""}
                onValueChange={(v: string | null) => setValue("categoryId", v ?? "", { shouldDirty: true })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-destructive text-xs mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          {/* Short description */}
          <div>
            <Label htmlFor="shortDescription">Mô tả ngắn <span className="text-destructive">*</span></Label>
            <Textarea
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="Một đoạn mô tả ngắn về sản phẩm..."
              rows={2}
              className="mt-1.5"
            />
            {errors.shortDescription && <p className="text-destructive text-xs mt-1">{errors.shortDescription.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Mô tả chi tiết <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả đầy đủ về nội dung sản phẩm..."
              rows={5}
              className="mt-1.5"
            />
            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
          </div>

          <Separator />

          {/* Pricing */}
          <h2 className="font-semibold text-ink">Giá & Kho hàng</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Giá bán (đ) <span className="text-destructive">*</span></Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="109000"
                className="mt-1.5"
              />
              {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="originalPrice">Giá gốc (đ)</Label>
              <Input
                id="originalPrice"
                type="number"
                {...register("originalPrice", { valueAsNumber: true })}
                placeholder="129000"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="stock">Số lượng <span className="text-destructive">*</span></Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className="mt-1.5"
              />
              {errors.stock && <p className="text-destructive text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Image upload */}
          <div className="bg-white p-5 rounded shadow-sm space-y-4">
            <h2 className="font-semibold text-ink border-b border-border pb-2">Ảnh bìa</h2>
            <ImageUpload
              currentUrl={product?.imageUrl}
              currentPath={product?.imagePath ?? undefined}
              onUpload={handleImageUpload}
            />
            {errors.imageUrl && (
              <p className="text-destructive text-xs">{errors.imageUrl.message}</p>
            )}
            {/* Hidden input for imageUrl fallback */}
            <Input
              {...register("imageUrl")}
              placeholder="Hoặc nhập URL ảnh..."
              className="text-xs"
            />
          </div>

          {/* Options */}
          <div className="bg-white p-5 rounded shadow-sm space-y-4">
            <h2 className="font-semibold text-ink border-b border-border pb-2">Tùy chọn</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="font-normal cursor-pointer">
                Hiển thị trên storefront
              </Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setValue("isActive", v, { shouldDirty: true })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                Đánh dấu bán chạy
              </Label>
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(v) => setValue("isFeatured", v, { shouldDirty: true })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isNew" className="font-normal cursor-pointer">
                Đánh dấu sản phẩm mới
              </Label>
              <Switch
                id="isNew"
                checked={isNew}
                onCheckedChange={(v) => setValue("isNew", v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
