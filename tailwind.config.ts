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
      // Brand palette (Fyndlådan): warm, light, fyndjakt-coded. Token names are
      // kept stable across the codebase; the VALUES map to the brand colours.
      //   cream  = créme (light background)
      //   sand   = warm neutral (sections)
      //   ink    = espresso (text)
      //   plum   = oliv (dark blocks / secondary text)
      //   fuchsia= terrakotta (accent / CTA / sale price)
      //   gold   = restrained warm metallic accent
      //   mint   = muted olive (success)
      colors: {
        cream: "#FCFAF5",
        sand: "#F4ECDF",
        ink: "#2B2320",
        plum: {
          DEFAULT: "#3E4328",
          soft: "#6E7355",
        },
        fuchsia: {
          brand: "#B4573A",
          hot: "#C56A4B",
          deep: "#8F4026",
        },
        gold: {
          DEFAULT: "#B98C4A",
          soft: "#E7D3B0",
        },
        mint: "#5F7A52",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        card: "0 6px 24px -12px rgba(43, 35, 32, 0.30)",
        pop: "0 12px 40px -12px rgba(180, 87, 58, 0.40)",
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
