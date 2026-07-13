import type { Config } from "tailwindcss";

/**
 * Design system: "Lagret" (the warehouse/archive).
 *
 * Visual language of stock records and catalogue typography: warm bone paper,
 * near-black ink, hairline rules, and a single red signal reserved strictly
 * for things that are factually scarce (real stock counts, a genuine deadline,
 * the active bundle slot). Flat and matte: no shadows, no gradients, almost
 * square corners (2px). Serif display + grotesque interface + mono inventory.
 *
 * The semantic tokens (paper/ink/rule/signal) are the source of truth. The
 * legacy names (cream/sand/plum/fuchsia/gold/mint) are kept as aliases mapped
 * onto the new palette so older markup adopts the system automatically; new
 * code should use the semantic names.
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
        // Surfaces
        paper: {
          DEFAULT: "#F4F1EA",
          raised: "#FFFFFF",
          sunk: "#E4DFD2",
        },
        // Ink
        ink: {
          DEFAULT: "#1A1A18",
          muted: "#5C584E",
          faint: "#8A8577",
        },
        // Structure
        rule: "#C4BDAB",
        // Signal: the only accent. Real scarcity only.
        signal: "#D93A1F",

        // --- Legacy aliases mapped onto the new palette ---
        cream: "#F4F1EA",
        sand: "#E4DFD2",
        plum: { DEFAULT: "#5C584E", soft: "#5C584E" },
        // The old terracotta accent is neutralised to ink: buttons/links must
        // never be red (signal is reserved for scarcity).
        fuchsia: { brand: "#1A1A18", hot: "#1A1A18", deep: "#1A1A18" },
        gold: { DEFAULT: "#8A8577", soft: "#E4DFD2" },
        mint: "#5C584E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        meta: "0.08em",
      },
      borderRadius: {
        // Almost square everywhere. Catalogued, not friendly.
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
        pill: "2px",
        full: "9999px",
      },
      boxShadow: {
        // No shadows. Ever. Separation comes from rules and the paper stack.
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
        "slot-in": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "70%": { transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.28s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
        "slot-in": "slot-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
