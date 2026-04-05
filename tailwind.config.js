/** @type {import('tailwindcss').Config} */
const config = {
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
};

module.exports = config;
