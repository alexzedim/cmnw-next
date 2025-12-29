import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-sans-stack)"],
        mono: ["var(--font-mono)", "var(--font-mono-stack)"],
      },
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
        muted: "var(--text-muted)",
        divider: "var(--border)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        tremor: {
          brand: {
            faint: "#ffa50033",
            muted: "#ff8c0080",
            subtle: "#ff9900",
            DEFAULT: "#ff9900",
            emphasis: "#ff6600",
            inverted: "#ffffff",
          },
          background: {
            muted: "#0b0b0c",
            subtle: "#1f2126",
            DEFAULT: "#111216",
            emphasis: "#ffffff",
          },
          border: {
            DEFAULT: "#1f2126",
          },
          ring: {
            DEFAULT: "#ff9900",
          },
          content: {
            subtle: "#71717a",
            DEFAULT: "#ecedee",
            emphasis: "#ffffff",
            strong: "#ffffff",
            inverted: "#0b0b0c",
          },
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      container: {
        center: true,
      },
    },
  },
plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0b0b0c",
            foreground: "#ecedee",
            default: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
            },
            content1: "#111216",
            divider: "#1f2126",
            primary: {
              DEFAULT: "#7c8cff",
              foreground: "#0b0b0c",
            },
            focus: "#22d3ee",
          },
        },
      },
    }),
  ],
};

module.exports = config;
