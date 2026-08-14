import "server-only";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase-admin";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(
  file: File
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP",
    };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: "Ảnh không được vượt quá 5 MB",
    };
  }
  return { valid: true };
}

export async function uploadProductImage(file: File): Promise<{
  url: string;
  path: string;
}> {
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `products/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return { url: data.publicUrl, path };
}

export async function deleteProductImage(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    // Log but don't throw — caller decides error handling
    console.error(`[storage] Failed to delete image at "${path}":`, error.message);
  }
}
