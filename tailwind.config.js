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
            faint: "var(--tremor-brand-faint)",
            muted: "var(--tremor-brand-muted)",
            subtle: "var(--tremor-brand-subtle)",
            DEFAULT: "var(--tremor-brand)",
            emphasis: "var(--tremor-brand-emphasis)",
            inverted: "var(--tremor-brand-inverted)",
          },
          background: {
            muted: "var(--tremor-bg-muted)",
            subtle: "var(--tremor-bg-subtle)",
            DEFAULT: "var(--tremor-bg)",
            emphasis: "var(--tremor-bg-emphasis)",
          },
          border: {
            DEFAULT: "var(--tremor-border)",
          },
          ring: {
            DEFAULT: "var(--tremor-ring)",
          },
          content: {
            subtle: "var(--tremor-content-subtle)",
            DEFAULT: "var(--tremor-content)",
            emphasis: "var(--tremor-content-emphasis)",
            strong: "var(--tremor-content-strong)",
            inverted: "var(--tremor-content-inverted)",
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
