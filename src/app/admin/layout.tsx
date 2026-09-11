export const dynamic = "force-dynamic";

import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070910] text-gray-100 selection:bg-[#E05638] selection:text-white flex flex-col">
      <AdminHeader />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl flex-1">
        {children}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500 bg-[#0B0E17]">
        ThienTam Figure Studio Admin Operations Suite &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
