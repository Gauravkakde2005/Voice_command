import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#112A46",
          teal: "#1D7874",
          cream: "#F7F4EA",
          coral: "#F25F5C",
          gold: "#F7B267"
        }
      },
      boxShadow: {
        card: "0 24px 80px rgba(17, 42, 70, 0.12)"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
