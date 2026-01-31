"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-dark-end flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />
          <span className="material-symbols-outlined text-[120px] text-rose-400/30 relative">
            error
          </span>
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Something went wrong</h1>
        <p className="text-text-muted text-lg mb-8">
          We encountered an unexpected error. Don&apos;t worry, your data is safe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
