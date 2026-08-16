import "server-only";
import { prisma } from "@/lib/prisma";
import type { Video } from "@prisma/client";

export type { Video };

export async function findVideos(options?: {
  activeOnly?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ videos: Video[]; total: number }> {
  const { activeOnly = false, limit = 20, page = 1 } = options ?? {};
  const where = activeOnly ? { isActive: true } : {};
  const skip = (page - 1) * limit;

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.video.count({ where }),
  ]);

  return { videos, total };
}

export async function findVideoById(id: string): Promise<Video | null> {
  return prisma.video.findUnique({ where: { id } });
}

export async function createVideo(data: {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  description?: string | null;
  isActive: boolean;
}): Promise<Video> {
  return prisma.video.create({ data });
}

export async function updateVideo(
  id: string,
  data: Partial<{
    title: string;
    youtubeUrl: string;
    youtubeId: string;
    description: string | null;
    isActive: boolean;
  }>
): Promise<Video> {
  return prisma.video.update({ where: { id }, data });
}

export async function deleteVideo(id: string): Promise<Video> {
  return prisma.video.delete({ where: { id } });
}
