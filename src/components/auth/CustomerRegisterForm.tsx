"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export function CustomerRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch("/api/customer-auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Đăng ký thất bại");
        return;
      }

      toast.success("Tạo tài khoản thành công!");
      router.push("/community");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-[#141824] rounded-3xl border border-white/15 p-7 sm:p-9 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden text-white">
      {/* Top Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E05638]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(224,86,56,0.4)]">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-white flex items-center gap-1.5 tracking-wide">
          <span className="text-[#E05638]">THIEN</span>
          <span>TAM</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1 font-medium">Tạo tài khoản Cộng đồng Collector</p>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <Label htmlFor="displayName" className="text-xs font-bold text-gray-300 mb-1.5 block">Tên hiển thị / Biệt danh</Label>
          <Input
            id="displayName"
            {...register("displayName")}
            placeholder="VD: FigureCollector99"
            className="text-xs py-2.5 px-3.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] rounded-xl shadow-inner"
          />
          {errors.displayName && <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.displayName.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-xs font-bold text-gray-300 mb-1.5 block">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="nhap@email.com"
            className="text-xs py-2.5 px-3.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] rounded-xl shadow-inner"
          />
          {errors.email && <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-xs font-bold text-gray-300 mb-1.5 block">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Tối thiểu 6 ký tự"
              className="pr-10 text-xs py-2.5 px-3.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] rounded-xl shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#E05638] to-[#C83E20] hover:from-[#f06345] hover:to-[#e04928] text-white rounded-xl font-extrabold py-3 text-xs mt-3 shadow-[0_0_20px_rgba(224,86,56,0.35)] transition-all uppercase tracking-wider"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tạo tài khoản...</>
          ) : (
            "TẠO TÀI KHOẢN"
          )}
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400 relative z-10">
        Đã có tài khoản?{" "}
        <Link href="/auth/login" className="text-[#E05638] hover:text-red-400 hover:underline font-extrabold transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
