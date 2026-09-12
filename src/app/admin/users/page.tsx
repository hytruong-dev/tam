import { findAllUsers } from "@/lib/repositories/user.repository";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý thành viên | ThienTam Admin" };

export default async function AdminUsersPage() {
  const users = await findAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Users className="w-4 h-4" /> QUẢN LÝ THÀNH VIÊN
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Danh Sách Collector Registered</h1>
          <p className="text-gray-400 text-xs">Tổng cộng {users.length} tài khoản thành viên trong hệ thống Studio</p>
        </div>
      </div>

      <div className="bg-[#141824] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0E17] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Thành viên Collector</th>
                <th className="p-4">Địa chỉ Email</th>
                <th className="p-4">Vai trò Phân quyền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3 font-bold text-white">
                    <img
                      src={u.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                    />
                    <span>{u.displayName}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-300">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                        u.role === "ADMIN"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : u.role === "MODERATOR"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-white/10 text-gray-300 border-white/10"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
