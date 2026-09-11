import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/product.service";
import { findAllCategories } from "@/lib/repositories/category.repository";
import { findVideos } from "@/lib/repositories/video.repository";
import { findAllUsers } from "@/lib/repositories/user.repository";
import { findCommunityFeed } from "@/lib/repositories/community.repository";
import { findAllOrders } from "@/lib/repositories/order.repository";

export async function GET() {
  try {
    const [productsResult, categories, videosResult, users, feed, orders] = await Promise.all([
      getProducts({ page: 1, limit: 100 }, false),
      findAllCategories(),
      findVideos({ limit: 100 }),
      findAllUsers(),
      findCommunityFeed({ limit: 50 }),
      findAllOrders(),
    ]);

    const totalProducts = productsResult.total;
    const totalCategories = categories.length;
    const totalVideos = videosResult.videos.length;
    const totalUsers = users.length;
    const totalPosts = feed.posts.length;
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== "CANCELLED" ? o.totalAmount : 0), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalVideos,
        totalUsers,
        totalPosts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        systemStatus: "ONLINE",
        recentOrders: orders.slice(0, 5),
        recentProducts: productsResult.products.slice(0, 5),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
