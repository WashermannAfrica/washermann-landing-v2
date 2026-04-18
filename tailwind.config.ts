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
        wm: {
          green:       "#08523C", // dark forest green — primary bg
          mint:        "#3ECFAB", // mint teal — CTAs, accents
          "mint-light":"#D4F5EC", // final CTA section bg
          pink:        "#E5177E", // hot pink — highlight blob, feature cards
          "blue-pale": "#B8D8F0", // how-it-works step 1
          "pink-pale":  "#F5C0D8", // how-it-works step 2
          "green-pale": "#C0E8C0", // how-it-works step 3
          "blush":      "#F5D0DA", // stats section bg
          maroon:      "#7A1A35", // stats numbers
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        body:    ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        arch: "50% 50% 0 0 / 40% 40% 0 0",
      },
      animation: {
        marquee:  "marquee 25s linear infinite",
        "marquee2": "marquee2 25s linear infinite",
        blob:     "blob 7s ease-in-out infinite",
        "float":  "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee2: {
          "0%":   { transform: "translateX(50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        blob: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%":      { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
