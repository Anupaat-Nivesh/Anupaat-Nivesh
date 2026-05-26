/** @type {import('tailwindcss').Config} */
module.exports = {
  important: "#mdif-root",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', "system-ui", "sans-serif"],
        display: ['"Poppins"', "system-ui", "sans-serif"],
        mono: ['ui-monospace', "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        mdif: {
          canvas: "#f1f3f5",
          surface: "#ffffff",
          muted: "#f7f8f9",
          line: "rgba(27, 27, 27, 0.1)",
          text: "#1b1b1b",
          textMuted: "#323232",
          textSoft: "#4a4a4a",
          brand: "#FE0101",
          brandDark: "#d80000",
          panel: "rgba(255, 255, 255, 0.98)",
          void: "#f1f3f5",
          ink: "#ffffff",
          bull: "#15803d",
          warn: "#b45309",
          risk: "#b91c1c",
        },
      },
      backgroundImage: {
        "terminal-grid":
          "linear-gradient(rgba(27,27,27,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,27,27,0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(254,1,1,0.08), transparent 52%)",
        "hero-wash": "linear-gradient(180deg, #ffffff 0%, #f1f3f5 55%, #eceef1 100%)",
      },
      keyframes: {
        gridDrift: {
          "0%": { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "80px 80px, 80px 80px" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "grid-drift": "gridDrift 24s linear infinite",
        shimmer: "shimmer 8s ease infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(27,27,27,0.07), 0 20px 50px -18px rgba(0,0,0,0.1)",
        lift: "0 14px 36px -10px rgba(254,1,1,0.22)",
      },
    },
  },
  plugins: [],
};
