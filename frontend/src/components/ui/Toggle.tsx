"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center cursor-pointer group",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors",
            "bg-slate-700 peer-checked:bg-primary",
            "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30",
            "after:content-[''] after:absolute after:top-[2px] after:start-[2px]",
            "after:bg-white after:border-gray-300 after:border after:rounded-full",
            "after:h-5 after:w-5 after:transition-all",
            "peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full",
            "peer-checked:after:border-white peer-checked:shadow-glow-sm peer-checked:shadow-primary/50"
          )}
        />
        {(label || description) && (
          <div className="ms-3">
            {label && (
              <span className="text-base font-medium text-white group-hover:text-white/90">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-text-muted">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
export type { ToggleProps };
