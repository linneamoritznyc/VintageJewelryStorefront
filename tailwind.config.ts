import type { Config } from "tailwindcss";

/**
 * Design system for the storefront.
 *
 * One typeface (Cormorant), one accent (olive), paper and ink otherwise.
 * Flat: no gradients, no shadows, no rounded corners, 1px hairlines only.
 * Legibility floor: nothing under 16px; labels are 18-19px italic sentence
 * case, never a pale grey on cream.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Current tokens ---
        bg: "#F6F4EE",
        "bg-panel": "#E8E4DB",
        "bg-tile": "#EAE6DD",
        "bg-selected": "#EEEDE4",
        ink: {
          DEFAULT: "#1C1B17",
          // "muted" = secondary text, "label" = eyebrows/captions (legibility
          // floor: never lighter than this on cream).
          muted: "#57564E",
          label: "#5A5648",
        },
        placeholder: "#676352",
        line: "#DCD8CE",
        "input-border": "#C9C6BB",
        accent: {
          DEFAULT: "#4A4E3C",
          hover: "#3A3D30",
        },
        // Muted terracotta for coupon/form error states only.
        error: "#9A5A47",
      },
      fontFamily: {
        // One typeface everywhere.
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        wordmark: "0.16em",
      },
      // Disciplined Major Third scale (×1.25) anchored at 18px body: 16, 18,
      // 22, 27 (wordmark, the next step up). Only exceptions are the big
      // display clamps (hero/heading/lead) and the 40px price numeral.
      fontSize: {
        small: "16px",
        body: "18px",
        sub: "22px",
        wordmark: "27px",
        hero: "clamp(56px, 8vw, 128px)",
        heading: "clamp(30px, 3.4vw, 52px)",
        lead: "clamp(24px, 2.1vw, 32px)",
        numeral: "40px",
      },
      // Flat: hairlines only, never rounded.
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
        pill: "0",
      },
      // Flat, no elevation.
      boxShadow: {
        none: "none",
        DEFAULT: "none",
        card: "none",
        pop: "none",
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
      },
      animation: {
        "slide-in-right": "slide-in-right 0.28s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
