"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentUrl?: string;
  currentPath?: string;
  onUpload: (url: string, path: string) => void;
}

export function ImageUpload({ currentUrl, onUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/uploads/product-image", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Upload thất bại");
        return;
      }

      setPreviewUrl(json.data.url);
      onUpload(json.data.url, json.data.path);
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Lỗi kết nối khi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onUpload("", "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative inline-block">
          <div className="relative w-40 h-60 overflow-hidden border border-border rounded">
            <Image
              src={previewUrl}
              alt="Ảnh bìa"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center shadow hover:bg-destructive/90"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "w-40 h-60 border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold hover:bg-ivory"
          )}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center px-2">
                Kéo thả hoặc click để chọn ảnh
              </p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG, WebP — tối đa 5 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs"
        >
          {uploading ? (
            <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Đang upload...</>
          ) : (
            <><Upload className="w-3 h-3 mr-1" /> Chọn ảnh</>
          )}
        </Button>
      )}
    </div>
  );
}
