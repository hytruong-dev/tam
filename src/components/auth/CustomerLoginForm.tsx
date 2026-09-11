"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { customerLoginSchema, type CustomerLoginInput } from "@/lib/validations/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export function CustomerLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerLoginInput>({
    resolver: zodResolver(customerLoginSchema),
  });

  const onSubmit = async (data: CustomerLoginInput) => {
    try {
      const res = await fetch("/api/customer-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Đăng nhập thất bại");
        return;
      }

      toast.success(`Chào mừng ${json.data.displayName} trở lại!`);
      router.push("/community");
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md shadow-xl">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white mb-3 shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-gray-900 flex items-center gap-1">
          <span className="text-[#E05638]">THIEN</span>
          <span>TAM</span>
        </h1>
        <p className="text-gray-500 text-xs mt-1 font-medium">Đăng nhập tài khoản Collector</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="nhap@email.com"
            className="mt-1 text-xs py-2 bg-gray-50/50"
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-xs font-bold text-gray-700">Mật khẩu</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="pr-10 text-xs py-2 bg-gray-50/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-[#E05638] hover:bg-[#E05638]/90 text-white rounded-xl font-bold py-3 text-xs mt-2 shadow-md shadow-red-600/20"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</>
          ) : (
            "ĐĂNG NHẬP"
          )}
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
        Chưa có tài khoản?{" "}
        <Link href="/auth/register" className="text-[#E05638] hover:underline font-bold">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}