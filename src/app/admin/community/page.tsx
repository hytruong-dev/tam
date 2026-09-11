import { findPendingReports } from "@/lib/repositories/community.repository";
import { MessageSquare, ShieldAlert, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kiểm duyệt bài viết & báo cáo | ThienTam Admin" };

export default async function AdminCommunityPage() {
  const reports = await findPendingReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" /> KIỂM DUYỆT DIỄN ĐÀN COLLECTOR
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Quản Lý Báo Cáo Vi Phạm</h1>
          <p className="text-gray-400 text-xs">Hiện tại có {reports.length} báo cáo vi phạm cần duyệt</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-[#141824] rounded-3xl border border-emerald-500/30 p-12 text-center space-y-3 shadow-2xl">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
          <h3 className="font-bold text-white text-lg">Không Có Báo Cáo Vi Phạm Nào Pending</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Cộng đồng Collector ThienTam đang hoạt động lành mạnh và tích cực!
          </p>
        </div>
      ) : (
        <div className="bg-[#141824] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0E17] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Người báo cáo</th>
                  <th className="p-4">Loại nội dung</th>
                  <th className="p-4">Lý do báo cáo</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {r.reporter.displayName} <span className="text-gray-400 font-mono text-[11px]">({r.reporter.email})</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono border border-white/10">
                        {r.targetType}
                      </span>
                    </td>
                    <td className="p-4 text-red-400 font-bold">{r.reason}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-amber-400 hover:text-white font-bold underline text-xs">
                        Xem & Xử lý
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
