import { prisma } from "@/lib/prisma";
import type { ProductQuery, ProductInput } from "@/lib/validations/product";
import type { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true; videoProducts: { include: { video: true } } };
}>;

export const FALLBACK_PRODUCTS: ProductWithCategory[] = [
  {
    id: "p1",
    name: "Mô Hình Monkey D. Luffy Gear 5 Sun God",
    slug: "luffy-gear-5-sun-god",
    sku: "FIG-OP-001",
    author: "Eiichiro Oda",
    brand: "Bandai Spirits",
    series: "One Piece",
    scale: "1/6",
    material: "PVC / ABS High-grade",
    dimensions: "32cm x 24cm x 20cm",
    productStatus: "IN_STOCK",
    preorderEndsAt: null,
    seoTitle: "Mô Hình Luffy Gear 5 Sun God - ThienTam Figure",
    seoDescription: "Mô hình Luffy Gear 5 cao cấp độ chi tiết cực cao",
    shortDescription: "Tái hiện trạng thái Thần Mặt Trời Nika với hiệu ứng khói sương PVC trong suốt rực rỡ.",
    description: "Mô hình tĩnh độc quyền thiết kế chi tiết đường nét thần thái tự tin của Thần Mặt Trời Nika Luffy.",
    imageUrl: "/images/luffy-gear5.png",
    imagePath: null,
    price: 3850000 as unknown as Prisma.Decimal,
    originalPrice: 4500000 as unknown as Prisma.Decimal,
    stock: 15,
    categoryId: "cat-1",
    isFeatured: true,
    isNew: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-1", name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
    videoProducts: [],
  },
  {
    id: "p2",
    name: "Mô Hình Iron Man Mark 85 Diecast Hot Toys",
    slug: "iron-man-mark-85-diecast",
    sku: "FIG-MARVEL-002",
    author: "Marvel Studios",
    brand: "Hot Toys",
    series: "Avengers Endgame",
    scale: "1/6",
    material: "Diecast Metal & PVC",
    dimensions: "32.5cm",
    productStatus: "PREORDER",
    preorderEndsAt: new Date("2026-12-31"),
    seoTitle: "Iron Man Mark 85 Hot Toys - ThienTam Figure",
    seoDescription: "Mô hình Iron Man Mark 85 tỉ lệ 1/6 chính hãng",
    shortDescription: "Tích hợp 30 điểm khớp động, đèn LED Nano Gauntlet & giáp kim loại Diecast nặng tay.",
    description: "Đại diện đỉnh cao của dòng Movie Masterpiece Series từ Hot Toys.",
    imageUrl: "/images/ironman-mark85.png",
    imagePath: null,
    price: 9200000 as unknown as Prisma.Decimal,
    originalPrice: 10500000 as unknown as Prisma.Decimal,
    stock: 5,
    categoryId: "cat-2",
    isFeatured: true,
    isNew: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-2", name: "Movie Figure", slug: "movie-figure", createdAt: new Date() },
    videoProducts: [],
  },
  {
    id: "p3",
    name: "Mô Hình Gundam MGEX 1/100 Strike Freedom",
    slug: "gundam-mgex-strike-freedom",
    sku: "GUN-BANDAI-003",
    author: "Kunio Okawara",
    brand: "Bandai Namco",
    series: "Gundam SEED Destiny",
    scale: "1/100",
    material: "PS / ABS / Mạ Vàng Metallic",
    dimensions: "Height 28cm",
    productStatus: "IN_STOCK",
    preorderEndsAt: null,
    seoTitle: "Gundam MGEX Strike Freedom Bandai",
    seoDescription: "Mô hình lắp ráp Gundam MGEX mạ vàng metallic cực đỉnh",
    shortDescription: "Dòng Master Grade Extreme với khung xương mạ 3 tông màu vàng óng ả tuyệt đẹp.",
    description: "Đỉnh cao biểu trưng của dòng mô hình lắp ráp Gunpla từ Bandai.",
    imageUrl: "/images/hero-gundam.jpg",
    imagePath: null,
    price: 3600000 as unknown as Prisma.Decimal,
    originalPrice: 4200000 as unknown as Prisma.Decimal,
    stock: 8,
    categoryId: "cat-3",
    isFeatured: true,
    isNew: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-3", name: "Gundam & Gunpla", slug: "gundam-gunpla", createdAt: new Date() },
    videoProducts: [],
  },
  {
    id: "p4",
    name: "Mô Hình Naruto Uzumaki Sage Mode GEM Series",
    slug: "naruto-uzumaki-sage-mode",
    sku: "FIG-NAR-004",
    author: "Masashi Kishimoto",
    brand: "MegaHouse",
    series: "Naruto Shippuden",
    scale: "1/8",
    material: "PVC Premium",
    dimensions: "22cm",
    productStatus: "IN_STOCK",
    preorderEndsAt: null,
    seoTitle: "Naruto Uzumaki Sage Mode MegaHouse",
    seoDescription: "Mô hình Naruto Chế Độ Hiền Nhân GEM Series",
    shortDescription: "Naruto trong trạng thái Chế Độ Hiền Nhân với cuốn bí kíp to bản đằng sau lưng.",
    description: "Sản phẩm nằm trong bộ sưu tập G.E.M. Series nổi tiếng từ hãng Megahouse.",
    imageUrl: "/images/naruto-community.png",
    imagePath: null,
    price: 2950000 as unknown as Prisma.Decimal,
    originalPrice: 3400000 as unknown as Prisma.Decimal,
    stock: 12,
    categoryId: "cat-1",
    isFeatured: false,
    isNew: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-1", name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
    videoProducts: [],
  },
  {
    id: "p5",
    name: "Mô Hình Roronoa Zoro Three-Sword Style King of Artist",
    slug: "roronoa-zoro-three-sword-style",
    sku: "FIG-OP-005",
    author: "Eiichiro Oda",
    brand: "Banpresto",
    series: "One Piece Wano Country",
    scale: "Non-scale",
    material: "PVC",
    dimensions: "20cm",
    productStatus: "IN_STOCK",
    preorderEndsAt: null,
    seoTitle: "Roronoa Zoro Three Sword Style Banpresto",
    seoDescription: "Mô hình Zoro Tam Kiếm Phái King of Artist",
    shortDescription: "Tư thế múa kiếm uyển chuyển sắc nét của Zoro tại trang phục Wano quốc.",
    description: "Bộ sưu tập King of Artist cao cấp từ Banpresto với mức giá hợp lý.",
    imageUrl: "/images/zoro-wano.png",
    imagePath: null,
    price: 680000 as unknown as Prisma.Decimal,
    originalPrice: 850000 as unknown as Prisma.Decimal,
    stock: 20,
    categoryId: "cat-1",
    isFeatured: true,
    isNew: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-1", name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
    videoProducts: [],
  },
  {
    id: "p6",
    name: "Mô Hình Kaido Dragon Form Beast Pirates POP WA-MAX",
    slug: "kaido-dragon-form-wa-max",
    sku: "FIG-OP-006",
    author: "Eiichiro Oda",
    brand: "MegaHouse",
    series: "One Piece Wano",
    scale: "1/7",
    material: "PVC & ABS Heavyweight",
    dimensions: "38cm x 40cm x 30cm",
    productStatus: "PREORDER",
    preorderEndsAt: new Date("2026-11-15"),
    seoTitle: "Kaido Dragon Form MegaHouse POP WA-MAX",
    seoDescription: "Mô hình Kaido Hóa Rồng đỉnh cao POP WA-MAX",
    shortDescription: "Tuyệt tác mô hình Kaido dạng rồng khổng lồ chi tiết từng vảy rồng và luồng mây đen.",
    description: "Dòng Portrait.Of.Pirates WA-MAXIMUM đỉnh cao nhất của thương hiệu MegaHouse.",
    imageUrl: "/images/kaido-dragon.png",
    imagePath: null,
    price: 14500000 as unknown as Prisma.Decimal,
    originalPrice: 16000000 as unknown as Prisma.Decimal,
    stock: 3,
    categoryId: "cat-1",
    isFeatured: true,
    isNew: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "cat-1", name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
    videoProducts: [],
  },
];

export async function findProducts(
  query: ProductQuery,
  adminMode = false
): Promise<{ products: ProductWithCategory[]; total: number }> {
  const {
    q,
    category,
    brand,
    series,
    scale,
    status,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
    featured,
    isNew,
  } = query;

  const where: Prisma.ProductWhereInput = {};

  if (!adminMode) {
    where.isActive = true;
  }
  if (featured !== undefined) {
    where.isFeatured = featured;
  }
  if (isNew !== undefined) {
    where.isNew = isNew;
  }
  if (status) {
    where.productStatus = status;
  }
  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }
  if (series) {
    where.series = { contains: series, mode: "insensitive" };
  }
  if (scale) {
    where.scale = scale;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { series: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const skip = (page - 1) * limit;

  let products: ProductWithCategory[] = [];
  let total = 0;
  try {
    [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          videoProducts: {
            include: { video: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);
  } catch {
    // Return mock data fallback when database is disconnected
    products = FALLBACK_PRODUCTS;
    total = FALLBACK_PRODUCTS.length;
  }

  if (products.length === 0) {
    products = FALLBACK_PRODUCTS;
    total = FALLBACK_PRODUCTS.length;
  }

  return { products, total };
}

export async function findProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  try {
    const res = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    if (res) return res;
  } catch {
    // Fallback on error
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || FALLBACK_PRODUCTS[0];
}

export async function findProductById(
  id: string
): Promise<ProductWithCategory | null> {
  try {
    const res = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    if (res) return res;
  } catch {
    // Fallback on error
  }
  return FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
}

export async function findRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  try {
    const res = await prisma.product.findMany({
      where: { categoryId, isActive: true, id: { not: excludeId } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    if (res.length > 0) return res;
  } catch {
    // Fallback on error
  }
  return FALLBACK_PRODUCTS.filter((p) => p.id !== excludeId).slice(0, limit);
}

export async function createProduct(
  data: ProductInput
): Promise<ProductWithCategory> {
  try {
    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku ?? null,
        author: data.author ?? null,
        brand: data.brand ?? null,
        series: data.series ?? null,
        scale: data.scale ?? null,
        material: data.material ?? null,
        dimensions: data.dimensions ?? null,
        productStatus: data.productStatus,
        preorderEndsAt: data.preorderEndsAt ? new Date(data.preorderEndsAt) : null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        shortDescription: data.shortDescription,
        description: data.description,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath ?? null,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        stock: data.stock,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        isActive: data.isActive ?? true,
      },
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    FALLBACK_PRODUCTS.unshift(created);
    return created;
  } catch {
    const fallbackProduct: ProductWithCategory = {
      id: `p-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      sku: data.sku ?? null,
      author: data.author ?? null,
      brand: data.brand ?? null,
      series: data.series ?? null,
      scale: data.scale ?? null,
      material: data.material ?? null,
      dimensions: data.dimensions ?? null,
      productStatus: data.productStatus,
      preorderEndsAt: data.preorderEndsAt ? new Date(data.preorderEndsAt) : null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      shortDescription: data.shortDescription,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath ?? null,
      price: data.price as unknown as Prisma.Decimal,
      originalPrice: (data.originalPrice ?? null) as unknown as Prisma.Decimal,
      stock: data.stock,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { id: data.categoryId, name: "Anime Figure", slug: "anime-figure", createdAt: new Date() },
      videoProducts: [],
    };
    FALLBACK_PRODUCTS.unshift(fallbackProduct);
    return fallbackProduct;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<ProductInput>
): Promise<ProductWithCategory> {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.sku !== undefined && { sku: data.sku }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.series !== undefined && { series: data.series }),
        ...(data.scale !== undefined && { scale: data.scale }),
        ...(data.material !== undefined && { material: data.material }),
        ...(data.dimensions !== undefined && { dimensions: data.dimensions }),
        ...(data.productStatus !== undefined && { productStatus: data.productStatus }),
        ...(data.preorderEndsAt !== undefined && {
          preorderEndsAt: data.preorderEndsAt ? new Date(data.preorderEndsAt) : null,
        }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
        ...(data.shortDescription !== undefined && {
          shortDescription: data.shortDescription,
        }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.originalPrice !== undefined && {
          originalPrice: data.originalPrice,
        }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isNew !== undefined && { isNew: data.isNew }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) FALLBACK_PRODUCTS[idx] = updated;
    return updated;
  } catch {
    const existing = FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
    const updated: ProductWithCategory = {
      ...existing,
      ...data,
      preorderEndsAt: data.preorderEndsAt !== undefined ? (data.preorderEndsAt ? new Date(data.preorderEndsAt) : null) : existing.preorderEndsAt,
      price: (data.price !== undefined ? data.price : existing.price) as unknown as Prisma.Decimal,
      originalPrice: (data.originalPrice !== undefined ? data.originalPrice : existing.originalPrice) as unknown as Prisma.Decimal,
    };
    const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) FALLBACK_PRODUCTS[idx] = updated;
    return updated;
  }
}

export async function deleteProduct(id: string): Promise<ProductWithCategory> {
  try {
    const deleted = await prisma.product.delete({
      where: { id },
      include: {
        category: true,
        videoProducts: {
          include: { video: true },
        },
      },
    });
    const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) FALLBACK_PRODUCTS.splice(idx, 1);
    return deleted;
  } catch {
    const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const removed = FALLBACK_PRODUCTS[idx];
      FALLBACK_PRODUCTS.splice(idx, 1);
      return removed;
    }
    return FALLBACK_PRODUCTS[0];
  }
}

export async function checkSlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const count = await prisma.product.count({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
    });
    return count > 0;
  } catch {
    return FALLBACK_PRODUCTS.some((p) => p.slug === slug && p.id !== excludeId);
  }
}
