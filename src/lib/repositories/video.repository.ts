import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type VideoWithProducts = Prisma.VideoGetPayload<{
  include: { videoProducts: { include: { product: true } } };
}>;

export const FALLBACK_VIDEOS: VideoWithProducts[] = [
  {
    id: "v1",
    title: "Unbox & Review MGEX Strike Freedom Gundam - Đỉnh Cao Khung Xương Mạ Vàng",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    description: "Đánh giá chi tiết mẫu Gunpla MGEX 1/100 Strike Freedom vừa cập bến ThienTam Figure Studio.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    videoProducts: [],
  },
  {
    id: "v2",
    title: "Trên Tay Luffy Gear 5 Sun God Studio Statue - Chi Tiết Thần Thái Siêu Thực",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    description: "Trải nghiệm mô hình Luffy Gear 5 Thần Mặt Trời Nika với hiệu ứng khói sương cực kỳ ấn tượng.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    videoProducts: [],
  },
  {
    id: "v3",
    title: "Review Iron Man Mark 85 Diecast Hot Toys 1/6 Scale - Siêu Phẩm Avengers Endgame",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    description: "Chiêm ngưỡng bộ giáp Mark 85 Diecast với 30 điểm khớp động và hiệu ứng đèn LED tuyệt đẹp.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    videoProducts: [],
  },
];

export async function findVideos(options?: {
  activeOnly?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ videos: VideoWithProducts[]; total: number }> {
  const { activeOnly = false, limit = 20, page = 1 } = options ?? {};
  const where = activeOnly ? { isActive: true } : {};
  const skip = (page - 1) * limit;

  let videos: VideoWithProducts[] = [];
  let total = 0;
  try {
    [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          videoProducts: {
            include: { product: true },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);
  } catch {
    videos = FALLBACK_VIDEOS;
    total = FALLBACK_VIDEOS.length;
  }

  if (videos.length === 0) {
    videos = FALLBACK_VIDEOS;
    total = FALLBACK_VIDEOS.length;
  }

  return { videos, total };
}

export async function findVideoById(id: string): Promise<VideoWithProducts | null> {
  try {
    const res = await prisma.video.findUnique({
      where: { id },
      include: {
        videoProducts: {
          include: { product: true },
        },
      },
    });
    if (res) return res;
  } catch {
    // Fallback
  }
  return FALLBACK_VIDEOS.find((v) => v.id === id) || FALLBACK_VIDEOS[0];
}

export async function createVideo(data: {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  description?: string | null;
  isActive: boolean;
  productIds?: string[];
}): Promise<VideoWithProducts> {
  const { productIds, ...videoData } = data;
  return prisma.video.create({
    data: {
      ...videoData,
      ...(productIds && productIds.length > 0 && {
        videoProducts: {
          createMany: {
            data: productIds.map((pId, idx) => ({ productId: pId, sortOrder: idx })),
          },
        },
      }),
    },
    include: {
      videoProducts: {
        include: { product: true },
      },
    },
  });
}

export async function updateVideo(
  id: string,
  data: Partial<{
    title: string;
    youtubeUrl: string;
    youtubeId: string;
    description: string | null;
    isActive: boolean;
    productIds: string[];
  }>
): Promise<VideoWithProducts> {
  const { productIds, ...videoData } = data;

  if (productIds !== undefined) {
    await prisma.videoProduct.deleteMany({ where: { videoId: id } });
    if (productIds.length > 0) {
      await prisma.videoProduct.createMany({
        data: productIds.map((pId, idx) => ({ videoId: id, productId: pId, sortOrder: idx })),
      });
    }
  }

  return prisma.video.update({
    where: { id },
    data: videoData,
    include: {
      videoProducts: {
        include: { product: true },
      },
    },
  });
}

export async function deleteVideo(id: string): Promise<VideoWithProducts> {
  return prisma.video.delete({
    where: { id },
    include: {
      videoProducts: {
        include: { product: true },
      },
    },
  });
}
