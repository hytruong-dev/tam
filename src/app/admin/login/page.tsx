import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đăng nhập quản trị | Kaku Books" };

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) redirect("/admin/products");

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <BookOpen className="w-10 h-10 text-gold mb-2" />
          <h1 className="font-heading text-2xl font-bold text-ink">KAKU BOOKS</h1>
          <p className="text-muted-foreground text-xs mt-1">Quản trị hệ thống</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
