import type { Config } from "tailwindcss";

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
        paper: "var(--paper)",
        surface: {
          DEFAULT: "var(--surface)",
          sunk: "var(--surface-sunk)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        ink: {
          300: "var(--ink-300)",
          400: "var(--ink-400)",
          500: "var(--ink-500)",
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          800: "var(--ink-800)",
          900: "var(--ink-900)",
        },
        clinical: {
          50: "var(--clinical-50)",
          100: "var(--clinical-100)",
          200: "var(--clinical-200)",
          500: "var(--clinical-500)",
          600: "var(--clinical-600)",
          700: "var(--clinical-700)",
        },
        assay: {
          100: "var(--assay-100)",
          600: "var(--assay-600)",
          700: "var(--assay-700)",
        },
        flag: {
          100: "var(--flag-100)",
          600: "var(--flag-600)",
          700: "var(--flag-700)",
        },
        // `sky-*` is used across every interior page and the admin panel.
        // Remapping it onto the clinical ramp moves the whole site to the new
        // palette without touching those files.
        sky: {
          50: "#f1f7fc",
          100: "#e1eef7",
          200: "#b9d8ec",
          300: "#8bbcdd",
          400: "#4c9bcd",
          500: "#1782c6",
          600: "#0e6ba8",
          700: "#0a4e7a",
          800: "#0a3f61",
          900: "#0b3450",
          950: "#062134",
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
