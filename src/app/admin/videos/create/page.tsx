import { VideoForm } from "@/components/admin/VideoForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thêm video | Admin" };

export default function AdminCreateVideoPage() {
  return (
    <div>
      <VideoForm mode="create" />
    </div>
  );
}
