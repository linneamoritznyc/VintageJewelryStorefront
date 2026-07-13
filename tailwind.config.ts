import type { Config } from "tailwindcss";

/**
 * Design system for the storefront: "Lagret" (the archive).
 *
 * The concept is inventory and archive, a liquidated stockroom of never-worn
 * pieces. Warm bone paper, near-black ink, catalogue typography (serif display
 * + grotesque interface + mono for the "record" voice). Flat, printed, matte:
 * no shadows, no gradients, 2px radius, 1px hairline rules.
 *
 * SIGNAL (--signal, a single red) is the ONLY accent and is reserved for things
 * that are factually true and genuinely scarce: real stock counts, a genuine
 * countdown, the active bundle-tray state. Never decoration, never buttons.
 *
 * Legacy token names (cream/sand/plum/fuchsia/gold/mint) are kept as aliases so
 * older surfaces keep rendering, but their VALUES are remapped onto the archive
 * palette, and crucially never onto the signal red, so the "red means scarce"
 * rule holds everywhere.
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
        // --- Archive palette (the real tokens) ---
        paper: {
          DEFAULT: "#F4F1EA", // page background. Warm bone, uncoated stock.
          raised: "#FFFFFF", // cards
          sunk: "#E4DFD2", // image placeholders, inset areas
        },
        ink: {
          DEFAULT: "#1A1A18", // primary text, buttons, nav
          muted: "#5C584E", // body text, descriptions
          faint: "#8A8577", // metadata, lot numbers, captions
        },
        rule: "#C4BDAB", // hairlines, borders. Always 1px.
        signal: "#D93A1F", // the ONLY accent. Real scarcity only.

        // --- Legacy aliases, remapped onto the archive palette. ---
        // Deliberately NEVER mapped to the signal red.
        cream: "#F4F1EA",
        sand: "#E4DFD2",
        plum: {
          DEFAULT: "#3A3833",
          soft: "#5C584E",
        },
        fuchsia: {
          brand: "#1A1A18",
          hot: "#3A3833",
          deep: "#1A1A18",
        },
        gold: {
          DEFAULT: "#8A8577",
          soft: "#E4DFD2",
        },
        mint: "#5C584E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        meta: "0.08em",
      },
      // Almost square. Nothing rounded reads friendly; this reads catalogued.
      // Every radius utility collapses to ~2px so the rule holds even where an
      // older class name lingers.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
        full: "2px",
        pill: "2px",
      },
      // Flat, printed, matte. No shadows anywhere.
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
        // Bundle tray: pieces animate into slots with a slight overshoot.
        "slot-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "70%": { opacity: "1", transform: "translateY(0) scale(1.03)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.28s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
        "slot-in": "slot-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
