/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          bg:              "#FBFBF9",
          primary:         "#1A5B5E",
          primaryHover:    "#154849",
          primaryDark:     "#0E3739",
          secondary:       "#E8F4F4",
          accent:          "#D4A85C",
          accentDark:      "#B8893E",
          text:            "#1B2421",
          textSecondary:   "#51625D",
          textMuted:       "#8FA89F",
          subtle:          "#F0F5F5",
          success:         "#1E8C5C",
          emergency:       "#C8352D",
          emergencyDark:   "#A5221A",
          dark:            "#0E1B19",
          darkSurface:     "#152720",
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.8s ease-out forwards",
        "marquee":   "marquee 30s linear infinite",
        "marqueeR":  "marqueeR 30s linear infinite",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        marquee:  { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        marqueeR: { "0%": { transform: "translateX(-50%)" }, "100%": { transform: "translateX(0)" } },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
