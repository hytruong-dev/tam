"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-14 h-14 text-destructive mx-auto mb-4" />
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">Đã xảy ra lỗi</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Có lỗi không mong muốn xảy ra. Vui lòng thử lại.
        </p>
        <button
          onClick={reset}
          className="bg-charcoal hover:bg-charcoal/90 text-ivory font-semibold px-6 py-2.5 text-sm transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
