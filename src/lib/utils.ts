import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";
import type { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
}

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatZodError(error: ZodError): string {
  const issues = error.issues.map((issue) => {
    const pathStr = issue.path.length > 0 ? issue.path.join(".") : "";
    return pathStr ? `${pathStr}: ${issue.message}` : issue.message;
  });
  return issues.join("; ");
}

export function getErrorMessage(err: unknown, defaultMessage = "Có lỗi xảy ra"): string {
  if (!err) return defaultMessage;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.error === "string") return anyErr.error;
    if (typeof anyErr.message === "string") return anyErr.message;
    if (anyErr.fieldErrors) {
      const msgs: string[] = [];
      Object.entries(anyErr.fieldErrors).forEach(([field, errors]) => {
        if (Array.isArray(errors) && errors.length > 0) {
          msgs.push(`${field}: ${errors.join(", ")}`);
        }
      });
      if (msgs.length > 0) return msgs.join("; ");
    }
    try {
      return JSON.stringify(err);
    } catch {
      return defaultMessage;
    }
  }
  return String(err);
}
