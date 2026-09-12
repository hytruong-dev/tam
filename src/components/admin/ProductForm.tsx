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
import { slugify, getErrorMessage } from "@/lib/utils";
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
      sku: product?.sku ?? "",
      brand: product?.brand ?? "",
      series: product?.series ?? "",
      scale: product?.scale ?? "",
      material: product?.material ?? "",
      dimensions: product?.dimensions ?? "",
      productStatus: product?.productStatus ?? "IN_STOCK",
      author: product?.author ?? "",
      seoTitle: product?.seoTitle ?? "",
      seoDescription: product?.seoDescription ?? "",
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
        toast.error(getErrorMessage(json.error, "Có lỗi xảy ra khi lưu mô hình"));
        return;
      }

      toast.success(isEdit ? "Đã cập nhật mô hình" : "Đã thêm mô hình mới");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  const inputStyle = "mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs py-2.5 px-3.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-white">
            {isEdit ? "Sửa mô hình" : "Thêm mô hình mới"}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#E05638] hover:bg-[#E05638]/90 text-white rounded-xl font-extrabold text-xs px-5 py-2.5 shadow-[0_0_15px_rgba(224,86,56,0.4)] transition-all"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
          ) : isEdit ? "Lưu thay đổi" : "Thêm mô hình"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl text-white">
          <h2 className="font-extrabold text-white border-b border-white/10 pb-3 text-base flex items-center gap-2">
            Thông tin chính mô hình Figure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="name" className="text-gray-300 text-xs font-bold">Tên mô hình / Figure <span className="text-[#E05638]">*</span></Label>
              <Input id="name" {...register("name")} placeholder="VD: Figure Nendoroid Naruto Uzumaki" className={inputStyle} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="text-gray-300 text-xs font-bold">Slug <span className="text-[#E05638]">*</span></Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="figure-nendoroid-naruto-uzumaki"
                className={`${inputStyle} font-mono`}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  register("slug").onChange(e);
                }}
              />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            {/* SKU */}
            <div>
              <Label htmlFor="sku" className="text-gray-300 text-xs font-bold">Mã SKU / Kho</Label>
              <Input id="sku" {...register("sku")} placeholder="VD: FIG-NARUTO-001" className={`${inputStyle} font-mono`} />
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand" className="text-gray-300 text-xs font-bold">Hãng sản xuất (Brand)</Label>
              <Input id="brand" {...register("brand")} placeholder="VD: Good Smile Company, Bandai..." className={inputStyle} />
            </div>

            {/* Series */}
            <div>
              <Label htmlFor="series" className="text-gray-300 text-xs font-bold">Series / Anime</Label>
              <Input id="series" {...register("series")} placeholder="VD: Naruto Shippuden, One Piece..." className={inputStyle} />
            </div>

            {/* Scale */}
            <div>
              <Label htmlFor="scale" className="text-gray-300 text-xs font-bold">Tỷ lệ (Scale)</Label>
              <Input id="scale" {...register("scale")} placeholder="VD: 1/7, 1/8, Nendoroid..." className={inputStyle} />
            </div>

            {/* Material */}
            <div>
              <Label htmlFor="material" className="text-gray-300 text-xs font-bold">Chất liệu</Label>
              <Input id="material" {...register("material")} placeholder="VD: PVC & ABS" className={inputStyle} />
            </div>

            {/* Dimensions */}
            <div>
              <Label htmlFor="dimensions" className="text-gray-300 text-xs font-bold">Kích thước</Label>
              <Input id="dimensions" {...register("dimensions")} placeholder="VD: Cao 100mm" className={inputStyle} />
            </div>

            {/* Category */}
            <div>
              <Label className="text-gray-300 text-xs font-bold">Danh mục <span className="text-[#E05638]">*</span></Label>
              <Select
                defaultValue={product?.categoryId ?? ""}
                onValueChange={(v: string | null) => setValue("categoryId", v ?? "", { shouldDirty: true })}
              >
                <SelectTrigger className="mt-1.5 bg-[#0B0E17] border-white/15 text-white rounded-xl text-xs py-2.5 px-3.5">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-white/15 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* Product Status */}
            <div>
              <Label className="text-gray-300 text-xs font-bold">Trạng thái sản phẩm</Label>
              <Select
                defaultValue={product?.productStatus ?? "IN_STOCK"}
                onValueChange={(v: any) => setValue("productStatus", v, { shouldDirty: true })}
              >
                <SelectTrigger className="mt-1.5 bg-[#0B0E17] border-white/15 text-white rounded-xl text-xs py-2.5 px-3.5">
                  <SelectValue placeholder="Trạng thái kho" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-white/15 text-white">
                  <SelectItem value="IN_STOCK">Sẵn hàng (In Stock)</SelectItem>
                  <SelectItem value="PREORDER">Đặt trước (Pre-order)</SelectItem>
                  <SelectItem value="SOLD_OUT">Hết hàng (Sold Out)</SelectItem>
                  <SelectItem value="DISCONTINUED">Ngừng sản xuất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Short description */}
          <div>
            <Label htmlFor="shortDescription" className="text-gray-300 text-xs font-bold">Mô tả ngắn <span className="text-[#E05638]">*</span></Label>
            <Textarea
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="Một đoạn mô tả ngắn về mô hình..."
              rows={2}
              className="mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs p-3.5"
            />
            {errors.shortDescription && <p className="text-red-400 text-xs mt-1">{errors.shortDescription.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-gray-300 text-xs font-bold">Mô tả chi tiết <span className="text-[#E05638]">*</span></Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả đầy đủ chi tiết phế liệu, phụ kiện kèm theo..."
              rows={5}
              className="mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs p-3.5"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <Separator className="bg-white/10" />

          {/* Pricing */}
          <h2 className="font-extrabold text-white text-sm">Giá & Kho hàng</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price" className="text-gray-300 text-xs font-bold">Giá bán (đ) <span className="text-[#E05638]">*</span></Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="1090000"
                className={inputStyle}
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="originalPrice" className="text-gray-300 text-xs font-bold">Giá gốc (đ)</Label>
              <Input
                id="originalPrice"
                type="number"
                {...register("originalPrice", { valueAsNumber: true })}
                placeholder="1290000"
                className={inputStyle}
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-gray-300 text-xs font-bold">Số lượng <span className="text-[#E05638]">*</span></Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className={inputStyle}
              />
              {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Image upload */}
          <div className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white">
            <h2 className="font-extrabold text-white border-b border-white/10 pb-2 text-sm">Ảnh đại diện mô hình</h2>
            <ImageUpload
              currentUrl={product?.imageUrl}
              currentPath={product?.imagePath ?? undefined}
              onUpload={handleImageUpload}
            />
            {errors.imageUrl && (
              <p className="text-red-400 text-xs">{errors.imageUrl.message}</p>
            )}
            <Input
              {...register("imageUrl")}
              placeholder="Hoặc nhập URL ảnh trực tiếp..."
              className={inputStyle}
            />
          </div>

          {/* Options */}
          <div className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white">
            <h2 className="font-extrabold text-white border-b border-white/10 pb-2 text-sm">Tùy chọn trạng thái</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="font-normal cursor-pointer text-gray-300 text-xs">
                Hiển thị trên storefront
              </Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setValue("isActive", v, { shouldDirty: true })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured" className="font-normal cursor-pointer text-gray-300 text-xs">
                Đánh dấu mô hình Nổi bật / Bán chạy
              </Label>
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(v) => setValue("isFeatured", v, { shouldDirty: true })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isNew" className="font-normal cursor-pointer text-gray-300 text-xs">
                Đánh dấu mô hình Mới về
              </Label>
              <Switch
                id="isNew"
                checked={isNew}
                onCheckedChange={(v) => setValue("isNew", v, { shouldDirty: true })}
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white">
            <h2 className="font-extrabold text-white border-b border-white/10 pb-2 text-sm">SEO Metadata (Tùy chọn)</h2>
            <div>
              <Label htmlFor="seoTitle" className="text-gray-300 text-xs font-bold">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} placeholder="Tiêu đề SEO Google" className={inputStyle} />
            </div>
            <div>
              <Label htmlFor="seoDescription" className="text-gray-300 text-xs font-bold">SEO Description</Label>
              <Textarea id="seoDescription" {...register("seoDescription")} placeholder="Mô tả chuẩn SEO..." rows={2} className="mt-1.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl text-xs p-3.5" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
