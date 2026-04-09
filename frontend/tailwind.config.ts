import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090f",
        panel: "#11131b",
        soft: "#171a23",
        accent: "#ff6b2c"
      },
      fontFamily: {
        heading: ["Switzer", "ui-sans-serif", "system-ui"],
        body: ["Geist", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        premium: "0 20px 80px rgba(17, 24, 39, 0.45)"
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at top, rgba(255, 120, 43, 0.12), transparent 34%), radial-gradient(circle at 20% 20%, rgba(204, 204, 255, 0.15), transparent 30%), linear-gradient(180deg, #05060a 0%, #090b10 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
