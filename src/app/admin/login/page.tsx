import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đăng nhập quản trị | ThienTam Studio" };

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) redirect("/admin/products");

  return (
    <div className="min-h-screen bg-[#070910] text-white flex items-center justify-center px-4">
      <div className="bg-[#141824] rounded-3xl border border-white/15 p-8 sm:p-9 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(224,86,56,0.4)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white flex items-center gap-1.5 tracking-wide">
            <span className="text-[#E05638]">THIENTAM</span>
            <span>ADMIN</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium text-center">Quản trị hệ thống mô hình & diễn đàn</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
