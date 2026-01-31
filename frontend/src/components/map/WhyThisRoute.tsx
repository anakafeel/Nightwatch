"use client";

import { cn } from "@/lib/utils";

interface WhyThisRouteProps {
  reasons?: string[];
  className?: string;
}

function WhyThisRoute({ reasons, className }: WhyThisRouteProps) {
  const defaultReason = "High visibility zone, 12+ streetlights.";

  return (
    <div
      className={cn(
        "animate-fade-in",
        className
      )}
    >
      <div className="bg-background-dark border border-primary/30 text-white text-xs px-3 py-2 rounded-lg shadow-glow-primary max-w-[180px]">
        <p className="font-medium mb-1 text-primary">Why this route?</p>
        <p className="text-gray-300 leading-tight">
          {reasons && reasons.length > 0 ? reasons[0] : defaultReason}
        </p>
      </div>
      {/* Triangle Pointer */}
      <div className="size-3 bg-background-dark border-r border-b border-primary/30 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
    </div>
  );
}

export { WhyThisRoute };
