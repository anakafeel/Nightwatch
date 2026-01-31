"use client";

import { cn } from "@/lib/utils";

interface ToastProps {
  type?: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

function Toast({ type = "info", title, message, onClose, className }: ToastProps) {
  const variants = {
    info: {
      bg: "bg-blue-500/10 border-blue-500/20",
      icon: "info",
      iconColor: "text-blue-500",
      titleColor: "text-blue-400",
      textColor: "text-blue-300/80",
    },
    success: {
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icon: "check_circle",
      iconColor: "text-emerald-500",
      titleColor: "text-emerald-400",
      textColor: "text-emerald-300/80",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-600/30",
      icon: "warning",
      iconColor: "text-amber-500",
      titleColor: "text-amber-400",
      textColor: "text-amber-300/80",
    },
    error: {
      bg: "bg-rose-500/10 border-rose-500/20",
      icon: "error",
      iconColor: "text-rose-500",
      titleColor: "text-rose-400",
      textColor: "text-rose-300/80",
    },
  };

  const styles = variants[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right",
        styles.bg,
        className
      )}
      role="alert"
    >
      <span className={cn("material-symbols-outlined", styles.iconColor)}>
        {styles.icon}
      </span>
      <div className="flex flex-col flex-1">
        <p className={cn("text-sm font-bold", styles.titleColor)}>{title}</p>
        {message && (
          <p className={cn("text-xs", styles.textColor)}>{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded transition-colors hover:bg-white/10",
            styles.iconColor
          )}
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

export { Toast };
export type { ToastProps };
