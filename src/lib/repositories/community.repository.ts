import { prisma } from "@/lib/prisma";
import type { Prisma, TargetType } from "@prisma/client";

export type PostWithAuthorAndMedia = Prisma.PostGetPayload<{
  include: {
    author: { select: { id: true; displayName: true; avatarUrl: true; role: true } };
    media: true;
    _count: { select: { comments: true } };
  };
}>;

export async function findCommunityFeed(options?: {
  cursor?: string;
  limit?: number;
  topic?: string;
}): Promise<{ posts: PostWithAuthorAndMedia[]; nextCursor: string | null }> {
  const limit = options?.limit ?? 10;
  const { cursor, topic } = options ?? {};

  const where: Prisma.PostWhereInput = {
    isPublished: true,
    ...(topic && { topic }),
  };

  const posts = await prisma.post.findMany({
    where,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true, role: true },
      },
      media: { orderBy: { sortOrder: "asc" } },
      _count: { select: { comments: true } },
    },
  });

  let nextCursor: string | null = null;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem?.id ?? null;
  }

  return { posts, nextCursor };
}

export async function createPost(data: {
  authorId: string;
  content: string;
  topic?: string | null;
  mediaUrls?: string[];
}): Promise<PostWithAuthorAndMedia> {
  const { mediaUrls, ...postData } = data;
  return prisma.post.create({
    data: {
      ...postData,
      ...(mediaUrls && mediaUrls.length > 0 && {
        media: {
          createMany: {
            data: mediaUrls.map((url, idx) => ({ url, sortOrder: idx })),
          },
        },
      }),
    },
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true, role: true },
      },
      media: { orderBy: { sortOrder: "asc" } },
      _count: { select: { comments: true } },
    },
  });
}

export async function findPostById(id: string): Promise<PostWithAuthorAndMedia | null> {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true, role: true },
      },
      media: { orderBy: { sortOrder: "asc" } },
      _count: { select: { comments: true } },
    },
  });
}

export async function deletePost(id: string, userId: string, isAdminOrMod = false): Promise<boolean> {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return false;
  if (post.authorId !== userId && !isAdminOrMod) return false;

  await prisma.post.delete({ where: { id } });
  return true;
}

export async function toggleReaction(
  userId: string,
  targetType: TargetType,
  targetId: string
): Promise<{ reacted: boolean; count: number }> {
  const existing = await prisma.reaction.findUnique({
    where: {
      userId_targetType_targetId: { userId, targetType, targetId },
    },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    if (targetType === "POST") {
      const updated = await prisma.post.update({
        where: { id: targetId },
        data: { likeCount: { decrement: 1 } },
      });
      return { reacted: false, count: Math.max(0, updated.likeCount) };
    }
    return { reacted: false, count: 0 };
  } else {
    await prisma.reaction.create({
      data: { userId, targetType, targetId },
    });
    if (targetType === "POST") {
      const updated = await prisma.post.update({
        where: { id: targetId },
        data: { likeCount: { increment: 1 } },
      });
      return { reacted: true, count: updated.likeCount };
    }
    return { reacted: true, count: 1 };
  }
}

export async function checkUserReacted(userId: string, targetType: TargetType, targetId: string): Promise<boolean> {
  const count = await prisma.reaction.count({
    where: { userId, targetType, targetId },
  });
  return count > 0;
}

export async function findPostComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, isPublished: true },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true, role: true },
      },
    },
  });
}

export async function createComment(data: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string | null;
}) {
  const comment = await prisma.comment.create({
    data,
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true, role: true },
      },
    },
  });

  await prisma.post.update({
    where: { id: data.postId },
    data: { commentCount: { increment: 1 } },
  });

  return comment;
}

export async function createReport(data: {
  reporterId: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
}) {
  return prisma.report.create({ data });
}

export async function findPendingReports() {
  return prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, displayName: true, email: true } },
    },
  });
}
