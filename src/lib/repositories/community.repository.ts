import { prisma } from "@/lib/prisma";
import type { Prisma, TargetType } from "@prisma/client";

export type PostWithAuthorAndMedia = Prisma.PostGetPayload<{
  include: {
    author: { select: { id: true; displayName: true; avatarUrl: true; role: true } };
    media: true;
    _count: { select: { comments: true } };
  };
}>;

export const FALLBACK_POSTS: PostWithAuthorAndMedia[] = [
  {
    id: "post-1",
    authorId: "user-1",
    content: "Vừa đập hộp em Luffy Gear 5 Thần Mặt Trời Nika siêu nét! Đường nét khói mờ bồng bềnh làm từ PVC trong suốt siêu xịn luôn anh em ạ 🔥💯",
    topic: "Khoe mô hình",
    likeCount: 42,
    commentCount: 18,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: "user-1",
      displayName: "MinhTuFigureCollector",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhTu",
      role: "MEMBER",
    },
    media: [
      {
        id: "m1",
        postId: "post-1",
        url: "/images/luffy-gear5.png",
        sortOrder: 0,
        createdAt: new Date(),
      },
    ],
    _count: { comments: 18 },
  },
  {
    id: "post-2",
    authorId: "user-2",
    content: "Góc học tập & làm việc phong cách Cyberpunk Gundam của mình. Em MGEX Strike Freedom lấp lánh nguyên góc góc phòng luôn!",
    topic: "Góc trưng bày",
    likeCount: 95,
    commentCount: 34,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: "user-2",
      displayName: "GundamBuilderVn",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gundam",
      role: "MODERATOR",
    },
    media: [
      {
        id: "m2",
        postId: "post-2",
        url: "/images/hero-gundam.jpg",
        sortOrder: 0,
        createdAt: new Date(),
      },
    ],
    _count: { comments: 34 },
  },
];

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

  let posts: PostWithAuthorAndMedia[] = [];
  try {
    posts = await prisma.post.findMany({
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
  } catch {
    posts = FALLBACK_POSTS;
  }

  if (posts.length === 0) {
    posts = FALLBACK_POSTS;
  }

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
