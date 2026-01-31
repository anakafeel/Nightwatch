"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  valueLabel?: string;
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      valueLabel,
      showLabels = false,
      minLabel,
      maxLabel,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-4">
        {(label || valueLabel) && (
          <div className="flex justify-between items-center">
            {label && (
              <label
                htmlFor={id}
                className="text-base font-medium text-white"
              >
                {label}
              </label>
            )}
            {valueLabel && (
              <span className="text-sm font-semibold text-primary">
                {valueLabel}
              </span>
            )}
          </div>
        )}
        <div className="relative w-full h-6 flex items-center">
          <input
            ref={ref}
            id={id}
            type="range"
            className={cn(
              "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer",
              className
            )}
            {...props}
          />
        </div>
        {showLabels && (minLabel || maxLabel) && (
          <div className="flex justify-between text-xs text-text-muted font-medium px-1">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
