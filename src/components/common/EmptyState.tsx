import { BookOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Không tìm thấy sản phẩm",
  description = "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <BookOpen className="w-14 h-14 text-muted-foreground mb-4" />
      <h3 className="font-heading text-xl font-semibold text-ink mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    </div>
  );
}
