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
        // Primary Colors
        primary: "var(--color-primary)",
        "primary-glow": "var(--color-primary-glow)",
        "primary-dark": "var(--color-primary-dark)",

        // Accent Colors
        "noor-gold": "var(--color-noor-gold)",
        secondary: "var(--color-secondary)",

        // Background Colors
        "background-light": "var(--color-background-light)",
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
        "glow-primary": "0 0 15px rgba(19, 200, 236, 0.5)",
        "glow-secondary": "0 0 15px rgba(45, 212, 191, 0.4)",
        "glow-success": "0 0 12px rgba(52, 211, 153, 0.3)",
        "glow-warning": "0 0 12px rgba(251, 191, 36, 0.3)",
        "glow-danger": "0 0 12px rgba(244, 63, 94, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(to bottom, var(--color-background-dark), var(--color-background-dark-end))",
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
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 4px rgba(19, 200, 236, 0.8))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 8px rgba(19, 200, 236, 0.8))" },
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
