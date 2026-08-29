import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type VideoWithProducts = Prisma.VideoGetPayload<{
  include: { videoProducts: { include: { product: true } } };
}>;

export async function findVideos(options?: {
  activeOnly?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ videos: VideoWithProducts[]; total: number }> {
  const { activeOnly = false, limit = 20, page = 1 } = options ?? {};
  const where = activeOnly ? { isActive: true } : {};
  const skip = (page - 1) * limit;

  const [videos, total] = await Promise.all([
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

  return { videos, total };
}

export async function findVideoById(id: string): Promise<VideoWithProducts | null> {
  return prisma.video.findUnique({
    where: { id },
    include: {
      videoProducts: {
        include: { product: true },
      },
    },
  });
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
