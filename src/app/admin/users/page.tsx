import { prisma } from "@/lib/prisma";
import { Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý thành viên | Admin ThienTam" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Thành viên Cộng đồng</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{users.length} tài khoản đã đăng ký</p>
        </div>
      </div>

      <div className="bg-white rounded border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-charcoal text-white uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Thành viên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-ivory/40">
                <td className="p-3 flex items-center gap-2 font-semibold text-ink">
                  <img
                    src={u.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full border border-border"
                  />
                  {u.displayName}
                </td>
                <td className="p-3 font-mono">{u.email}</td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">
                    {u.role}
                  </Badge>
                </td>
                <td className="p-3">
                  <span className={`font-semibold ${u.status === "ACTIVE" ? "text-green-600" : "text-destructive"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
