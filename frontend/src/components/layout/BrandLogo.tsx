"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "icon" | "lockup";
  size?: number;
  className?: string;
  href?: string;
  showGlow?: boolean;
}

/**
 * Owl SVG rendered inline for full CSS control.
 * Uses currentColor so parent text-color controls it.
 */
function OwlIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 372"
      width={size}
      height={size * (372 / 230)}
      className={className}
      fill="currentColor"
    >
      <g transform="translate(-141.145307,443.000000) scale(0.100000,-0.100000)">
        <path d="M1578 4403 c-7 -16 -12 -68 -13 -118 0 -81 3 -97 32 -157 67 -142 113 -177 376 -284 100 -41 214 -93 254 -116 85 -48 179 -139 270 -260 l66 -88 58 89 c128 199 211 258 537 382 163 63 234 103 295 165 62 64 107 178 106 269 -1 51 -21 127 -35 132 -6 2 -28 -32 -50 -74 -26 -52 -63 -104 -113 -156 -77 -81 -70 -76 -313 -190 -180 -84 -295 -181 -417 -351 -35 -47 -68 -86 -76 -86 -7 0 -48 48 -91 107 -120 162 -256 269 -445 349 -120 51 -160 73 -218 122 -65 55 -129 140 -172 228 -18 35 -33 64 -36 64 -2 0 -9 -12 -15 -27z"/>
        <path d="M2342 4279 c-187 -21 -377 -82 -426 -137 -18 -21 -18 -21 5 -31 13 -6 66 -28 118 -50 213 -91 384 -229 473 -385 l46 -78 38 73 c28 54 65 100 134 170 107 109 184 158 348 226 59 24 111 48 116 53 34 34 -143 113 -329 145 -108 19 -407 27 -523 14z"/>
        <path d="M3359 3871 c-16 -23 -46 -47 -75 -61 -27 -13 -51 -25 -53 -27 -3 -2 11 -20 30 -41 139 -147 166 -341 72 -514 -39 -71 -127 -150 -198 -178 -147 -58 -348 -5 -435 115 -14 19 -27 35 -30 35 -3 0 -19 -39 -34 -87 -49 -150 -68 -195 -77 -186 -6 6 -34 77 -63 158 l-54 149 -14 -34 c-31 -74 -147 -149 -262 -171 -197 -36 -400 128 -439 354 -9 53 -8 76 6 130 21 88 63 170 114 227 l43 47 -45 17 c-24 10 -60 35 -80 57 -35 39 -37 40 -56 23 -33 -30 -76 -114 -110 -214 -56 -167 -51 -309 17 -461 l26 -57 -43 -54 c-57 -71 -133 -233 -159 -338 -31 -121 -38 -317 -16 -445 52 -304 207 -598 435 -825 111 -110 224 -200 237 -187 3 3 1 29 -5 57 -14 66 -14 148 0 191 17 48 57 99 79 99 37 0 30 21 -33 93 -305 350 -379 788 -197 1172 39 83 61 103 101 99 18 -2 34 -6 36 -7 2 -2 -13 -39 -33 -83 -86 -186 -110 -302 -101 -482 16 -332 211 -657 521 -867 101 -69 87 -71 234 34 114 81 189 156 267 266 240 336 279 711 110 1047 l-44 86 40 7 c52 9 64 -2 110 -100 152 -323 118 -688 -95 -1032 -30 -48 -79 -116 -110 -150 -31 -33 -56 -63 -56 -66 0 -2 14 -10 31 -17 36 -15 74 -83 84 -151 6 -40 -6 -145 -22 -185 -19 -51 119 45 237 165 52 53 125 139 162 191 174 245 298 595 298 840 0 203 -73 429 -188 580 l-49 65 23 50 c57 125 69 271 34 411 -19 78 -116 285 -135 291 -5 1 -22 -15 -36 -36z"/>
        <path d="M2062 3609 c-114 -57 -125 -223 -19 -300 46 -33 118 -39 166 -14 42 21 98 91 105 130 14 75 -28 154 -98 186 -54 24 -101 24 -154 -2z"/>
        <path d="M2891 3608 c-101 -52 -125 -163 -56 -254 59 -78 155 -98 227 -49 77 52 105 143 68 220 -44 92 -152 129 -239 83z"/>
        <path d="M2224 1575 c-35 -24 -47 -68 -41 -150 6 -83 35 -158 67 -175 48 -26 99 44 108 146 6 82 -3 127 -34 164 -29 33 -66 39 -100 15z"/>
        <path d="M2790 1570 c-41 -41 -51 -117 -29 -219 29 -136 129 -136 158 0 15 70 14 145 -4 179 -30 59 -88 77 -125 40z"/>
        <path d="M2460 1383 c0 -25 -38 -122 -60 -153 -12 -17 -40 -40 -61 -51 l-40 -20 61 -117 c114 -216 175 -321 189 -327 8 -3 22 2 32 12 18 19 219 403 219 419 0 5 -16 18 -36 29 -43 23 -89 97 -105 171 l-11 50 -94 1 c-74 0 -94 -3 -94 -14z"/>
      </g>
    </svg>
  );
}

/**
 * Main brand logo component used across the app.
 * Renders the owl icon with optional "Nightwatch" wordmark.
 */
export function BrandLogo({
  variant = "icon",
  size = 32,
  className,
  href = "/",
  showGlow = true,
}: BrandLogoProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 group",
        href && "cursor-pointer",
        className
      )}
    >
      {/* Icon with glow effect */}
      <div className="relative flex items-center justify-center">
        {showGlow && (
          <div
            className="absolute rounded-full bg-primary/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{ width: size, height: size }}
          />
        )}
        <OwlIcon
          size={size}
          className={cn(
            "relative z-10 text-white transition-all duration-300",
            showGlow && [
              "drop-shadow-[0_0_8px_rgba(19,200,236,0.5)]",
              "group-hover:drop-shadow-[0_0_14px_rgba(19,200,236,0.7)]",
            ]
          )}
        />
      </div>

      {/* Wordmark for lockup variant */}
      {variant === "lockup" && (
        <span className="text-white font-bold text-xl tracking-tight group-hover:text-primary transition-colors duration-300">
          Nightwatch
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export { BrandLogo as Logo };
