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
import { Box, Eye, EyeOff, Loader2 } from "lucide-react";

export default function CustomerRegisterPage() {
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
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="bg-white rounded border border-border p-8 w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Box className="w-10 h-10 text-copper mb-2" />
          <h1 className="font-heading text-2xl font-bold text-ink">ThienTam</h1>
          <p className="text-muted-foreground text-xs mt-1">Đăng ký tài khoản cộng đồng</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="displayName">Tên hiển thị / Biệt danh</Label>
            <Input
              id="displayName"
              {...register("displayName")}
              placeholder="VD: OtakuCollector99"
              className="mt-1"
            />
            {errors.displayName && <p className="text-destructive text-xs mt-1">{errors.displayName.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="nhap@email.com"
              className="mt-1"
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Tối thiểu 6 ký tự"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-copper hover:bg-copper/90 text-white rounded font-semibold mt-2"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang đăng ký...</> : "TẠO TÀI KHOẢN"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-copper hover:underline font-semibold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
