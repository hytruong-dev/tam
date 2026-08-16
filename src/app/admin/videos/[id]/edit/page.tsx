import { notFound } from "next/navigation";
import { findVideoById } from "@/lib/repositories/video.repository";
import { VideoForm } from "@/components/admin/VideoForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sửa video | Admin" };

interface AdminEditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditVideoPage({ params }: AdminEditVideoPageProps) {
  const { id } = await params;
  const video = await findVideoById(id);

  if (!video) notFound();

  return (
    <div>
      <VideoForm video={video} mode="edit" />
    </div>
  );
}
