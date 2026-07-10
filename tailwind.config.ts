import type { Config } from "tailwindcss";

/**
 * Design system for the storefront.
 *
 * Brand direction: playful "treasure hunt" + "last chance", Gen-Z-aware,
 * mobile-first. Warm cream base, punchy fuchsia/magenta primary, deep plum
 * ink, and a soft gold accent that nods to the vintage-jewelry product without
 * tipping into quiet-luxury heritage territory.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE",
        sand: "#F3E9DA",
        ink: "#2A1B2E",
        plum: {
          DEFAULT: "#5B2A57",
          soft: "#7A3E75",
        },
        fuchsia: {
          brand: "#E23E8C",
          hot: "#F4478A",
          deep: "#C42C74",
        },
        gold: {
          DEFAULT: "#C9A24B",
          soft: "#E6CF95",
        },
        mint: "#3BB6A0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        card: "0 6px 24px -12px rgba(42, 27, 46, 0.35)",
        pop: "0 12px 40px -12px rgba(226, 62, 140, 0.45)",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.28s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "pop-in": "pop-in 0.25s ease-out",
        marquee: "marquee 22s linear infinite",
        sparkle: "sparkle 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
