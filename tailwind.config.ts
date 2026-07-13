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
        background: "#050505",
        primary: "#3B82F6",
        secondary: "#8B5CF6",
        accent: "#00E5FF",
        muted: "#9CA3AF",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        aurora:
          "radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.25), transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.2), transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(0,229,255,0.12), transparent 50%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        "glow-line":
          "linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        glow: "0 0 40px rgba(59,130,246,0.35)",
        "glow-accent": "0 0 40px rgba(0,229,255,0.3)",
        "glow-secondary": "0 0 40px rgba(139,92,246,0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marqueeReverse 40s linear infinite",
        grid: "gridMove 20s linear infinite",
        spinSlow: "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        gridMove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(60px)" },
        },
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
