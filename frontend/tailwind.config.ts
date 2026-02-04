import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (soft violet)
        primary: "var(--color-primary)",
        "primary-glow": "var(--color-primary-glow)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-hover": "var(--color-primary-hover)",

        // Secondary (muted blue)
        secondary: "var(--color-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",

        // Accent Colors
        "noor-gold": "var(--color-noor-gold)",

        // Background Colors
        "background-dark": "var(--color-background-dark)",
        "background-dark-end": "var(--color-background-dark-end)",

        // Surface Colors
        "surface-dark": "var(--color-surface-dark)",
        "surface-darker": "var(--color-surface-darker)",

        // Border Colors
        "border-dark": "var(--color-border-dark)",
        "glass-border": "var(--color-glass-border)",
        "glass-bg": "var(--color-glass-bg)",

        // Text Colors
        "text-muted": "var(--color-text-muted)",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 20px -5px var(--tw-shadow-color)",
        "glow-lg": "0 0 40px -10px var(--tw-shadow-color)",
        "glow-sm": "0 0 8px var(--tw-shadow-color)",
        "glow-primary": "0 10px 30px rgba(0, 0, 0, 0.35)",
        "glow-secondary": "0 10px 30px rgba(0, 0, 0, 0.35)",
        "glow-success": "0 0 10px rgba(60, 203, 154, 0.12)",
        "glow-warning": "0 0 10px rgba(242, 193, 78, 0.12)",
        "glow-danger": "0 0 10px rgba(255, 107, 138, 0.12)",
        "premium": "0 10px 30px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(to bottom, var(--color-background-dark), var(--color-background-dark-end))",
        "grad-primary": "linear-gradient(135deg, #7C5CFF 0%, #4C7DFF 100%)",
        "grad-hero": "linear-gradient(90deg, rgba(124,92,255,0.95) 0%, rgba(76,125,255,0.95) 60%, rgba(255,255,255,0.92) 120%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s infinite",
        "dash": "dash 3s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 4px rgba(124, 92, 255, 0.12))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 6px rgba(124, 92, 255, 0.12))" },
        },
        dash: {
          to: { strokeDashoffset: "-100" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
