import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember:   "#ff6b2b",
        fire:    "#ef4444",
        smoke:   "#6b7280",
        ash:     "#374151",
      },
      backgroundImage: {
        "gradient-card": "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
