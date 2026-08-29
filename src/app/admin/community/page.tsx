import { findPendingReports } from "@/lib/repositories/community.repository";
import { MessageSquare, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kiểm duyệt bài viết & báo cáo | Admin ThienTam" };

export default async function AdminCommunityPage() {
  const reports = await findPendingReports();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Kiểm duyệt Cộng đồng</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {reports.length} báo cáo vi phạm cần xử lý
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded border border-border p-12 text-center space-y-2">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-ink">Không có báo cáo nào pending</h3>
          <p className="text-xs text-muted-foreground">Cộng đồng đang hoạt động lành mạnh!</p>
        </div>
      ) : (
        <div className="bg-white rounded border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Người báo cáo</th>
                <th className="p-3">Loại nội dung</th>
                <th className="p-3">Lý do báo cáo</th>
                <th className="p-3">Thời gian</th>
                <th className="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-ivory/40">
                  <td className="p-3 font-semibold">{r.reporter.displayName} ({r.reporter.email})</td>
                  <td className="p-3">{r.targetType}</td>
                  <td className="p-3 text-destructive font-medium">{r.reason}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-gold font-semibold cursor-pointer hover:underline">Xem nội dung</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
