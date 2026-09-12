import { prisma } from "@/lib/prisma";
import type { User, UserRole, UserStatus } from "@prisma/client";

export interface UserFilterOptions {
  search?: string;
  role?: string;
  status?: string;
  limit?: number;
}

export const FALLBACK_USERS: User[] = [
  {
    id: "u1-master",
    email: "admin@thientamfigure.com",
    passwordHash: "hash-secret",
    displayName: "ThienTam Admin Master",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MasterAdmin",
    role: "ADMIN" as UserRole,
    status: "ACTIVE" as UserStatus,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "u2-1",
    email: "minhtu.figure@gmail.com",
    passwordHash: "hash-secret",
    displayName: "MinhTu Collector PRO",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhTu",
    role: "MODERATOR" as UserRole,
    status: "ACTIVE" as UserStatus,
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-02-15"),
  },
  {
    id: "u3-2",
    email: "gundamfan99@gmail.com",
    passwordHash: "hash-secret",
    displayName: "Gundam Builder VN",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=GundamFan",
    role: "MEMBER" as UserRole,
    status: "ACTIVE" as UserStatus,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: "u4-3",
    email: "hottoys.lover@outlook.com",
    passwordHash: "hash-secret",
    displayName: "IronMan HotToys Collector",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=HotToys",
    role: "MEMBER" as UserRole,
    status: "ACTIVE" as UserStatus,
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-03-10"),
  },
];

export async function findAllUsers(options: UserFilterOptions = {}): Promise<User[]> {
  try {
    const where: any = {};
    if (options.role) where.role = options.role;
    if (options.status) where.status = options.status;
    if (options.search) {
      where.OR = [
        { displayName: { contains: options.search, mode: "insensitive" } },
        { email: { contains: options.search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options.limit || 50,
    });
    if (users.length > 0) return users;
  } catch {
    // Fallback
  }

  let filtered = [...FALLBACK_USERS];
  if (options.role) {
    filtered = filtered.filter((u) => u.role === options.role);
  }
  if (options.status) {
    filtered = filtered.filter((u) => u.status === options.status);
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function findUserById(id: string): Promise<User | null> {
  try {
    const res = await prisma.user.findUnique({ where: { id } });
    if (res) return res;
  } catch {
    // Fallback
  }
  return FALLBACK_USERS.find((u) => u.id === id) || null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const res = await prisma.user.findUnique({ where: { email } });
    if (res) return res;
  } catch {
    // Fallback
  }
  return FALLBACK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  role?: UserRole;
}): Promise<User> {
  const avatarUrl =
    data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.displayName)}`;

  try {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        avatarUrl,
        role: data.role || "MEMBER",
        status: "ACTIVE",
      },
    });
    FALLBACK_USERS.unshift(newUser);
    return newUser;
  } catch (err) {
    console.error("[createUser fallback]", err);
    const fallbackUser: User = {
      id: `u-${Date.now()}`,
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      avatarUrl,
      role: data.role || "MEMBER",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    FALLBACK_USERS.unshift(fallbackUser);
    return fallbackUser;
  }
}

export async function updateUser(
  id: string,
  data: { role?: UserRole; status?: UserStatus; displayName?: string; avatarUrl?: string }
): Promise<User> {
  try {
    const res = await prisma.user.update({
      where: { id },
      data,
    });
    const index = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) {
      FALLBACK_USERS[index] = res;
    }
    return res;
  } catch {
    const existing = FALLBACK_USERS.find((u) => u.id === id) || FALLBACK_USERS[0];
    const updated = { ...existing, ...data, updatedAt: new Date() };
    const index = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) {
      FALLBACK_USERS[index] = updated;
    }
    return updated;
  }
}

export async function deleteUser(id: string): Promise<User | null> {
  try {
    const res = await prisma.user.delete({ where: { id } });
    const index = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) FALLBACK_USERS.splice(index, 1);
    return res;
  } catch {
    const index = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) {
      const removed = FALLBACK_USERS[index];
      FALLBACK_USERS.splice(index, 1);
      return removed;
    }
    return null;
  }
}
