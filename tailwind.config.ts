import type { Config } from "tailwindcss";

/** Reads a channel-triplet CSS variable as a Tailwind colour that supports
 *  the `/opacity` modifier. See the note at the top of globals.css. */
const t = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // `<alpha-value>` is what lets `text-clinical-300/80` and friends
        // generate at all. Without it Tailwind drops every opacity variant.
        paper: t("--paper"),
        surface: {
          DEFAULT: t("--surface"),
          sunk: t("--surface-sunk"),
        },
        line: {
          DEFAULT: t("--line"),
          strong: t("--line-strong"),
        },
        ink: {
          300: t("--ink-300"),
          400: t("--ink-400"),
          500: t("--ink-500"),
          600: t("--ink-600"),
          700: t("--ink-700"),
          800: t("--ink-800"),
          900: t("--ink-900"),
        },
        deep: {
          700: t("--deep-700"),
          800: t("--deep-800"),
          900: t("--deep-900"),
        },
        clinical: {
          50: t("--clinical-50"),
          100: t("--clinical-100"),
          200: t("--clinical-200"),
          300: t("--clinical-300"),
          500: t("--clinical-500"),
          600: t("--clinical-600"),
          700: t("--clinical-700"),
        },
        assay: {
          100: t("--assay-100"),
          400: t("--assay-400"),
          600: t("--assay-600"),
          700: t("--assay-700"),
        },
        flag: {
          100: t("--flag-100"),
          300: t("--flag-300"),
          600: t("--flag-600"),
          700: t("--flag-700"),
        },
        // `sky-*` is used across every interior page and the admin panel.
        // Remapping it onto the clinical ramp moves the whole site to the new
        // palette without touching those files.
        sky: {
          50: "#eff7fd",
          100: "#dcedf9",
          200: "#a9d5f0",
          300: "#7cc2ec",
          400: "#43a6e2",
          500: "#1e93dc",
          600: "#0c6faf",
          700: "#0a5b92",
          800: "#094568",
          900: "#06304f",
          950: "#04223a",
        },
      },
      fontSize: {
        // Typographic scale (kept — interior pages reference these)
        h1: ["2.25rem", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        h4: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-bold": ["1rem", { lineHeight: "1.65", fontWeight: "600" }],
        small: ["0.875rem", { lineHeight: "1.55", fontWeight: "400" }],
        "small-bold": ["0.875rem", { lineHeight: "1.55", fontWeight: "600" }],
        tiny: ["0.75rem", { lineHeight: "1.45", fontWeight: "400" }],
      },
      borderRadius: {
        xs: "var(--r-xs)",
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "2.5rem",
        "space-3xl": "3rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
