import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        // Typographic Scale
        "h1": ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }], // 36px - Page/Hero titles
        "h2": ["1.875rem", { lineHeight: "1.3", fontWeight: "700" }], // 30px - Section titles
        "h3": ["1.5rem", { lineHeight: "1.4", fontWeight: "700" }], // 24px - Subsection titles
        "h4": ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }], // 20px - Card/component titles
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }], // 18px - Large body text
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }], // 16px - Regular body text
        "body-bold": ["1rem", { lineHeight: "1.6", fontWeight: "600" }], // 16px - Bold body text
        "small": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }], // 14px - Small text
        "small-bold": ["0.875rem", { lineHeight: "1.5", fontWeight: "600" }], // 14px - Bold small text
        "tiny": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }], // 12px - Tiny text
      },
      spacing: {
        // Consistent spacing scale
        "space-xs": "0.25rem", // 4px
        "space-sm": "0.5rem", // 8px
        "space-md": "1rem", // 16px
        "space-lg": "1.5rem", // 24px
        "space-xl": "2rem", // 32px
        "space-2xl": "2.5rem", // 40px
        "space-3xl": "3rem", // 48px
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        bounce: "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;

