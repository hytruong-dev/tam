import { findCommunityFeed } from "@/lib/repositories/community.repository";
import { CommunityFeedClient } from "@/components/community/CommunityFeedClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diễn Đàn Cộng Đồng Collector Figure | ThienTam Studio",
  description: "Cộng đồng chia sẻ góc trưng bày mô hình figure, review sản phẩm, thảo luận và giao lưu collector Việt Nam.",
};

export default async function CommunityPage() {
  const { posts } = await findCommunityFeed({ limit: 30 });

  return <CommunityFeedClient initialPosts={posts} />;
}
