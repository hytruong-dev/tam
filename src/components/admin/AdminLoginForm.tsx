"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Đăng nhập thất bại");
        return;
      }

      toast.success("Đăng nhập quản trị thành công!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="password" className="text-gray-300 mb-1.5 block text-xs font-bold">
          Mật khẩu quản trị
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Nhập mật khẩu..."
            className="pr-10 text-xs py-2.5 px-3.5 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] rounded-xl"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#E05638] to-[#C83E20] hover:from-[#f06345] hover:to-[#e04928] text-white rounded-xl font-extrabold py-3 text-xs shadow-[0_0_20px_rgba(224,86,56,0.35)] transition-all uppercase tracking-wider"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</>
        ) : (
          "ĐĂNG NHẬP ADMIN"
        )}
      </Button>
    </div>
  );
}
