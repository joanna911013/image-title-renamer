import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f8fb",
          100: "#e6eef5",
          200: "#cddbea",
          300: "#aec2db",
          400: "#6f95bd",
          500: "#3f6fa1",
          600: "#2f5a8b",
          700: "#264974",
          800: "#1f3b5e",
          900: "#182f4c",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
