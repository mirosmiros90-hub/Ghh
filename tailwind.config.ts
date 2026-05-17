import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      colors: {
        ember: "#f59e0b",
        brass: "#c08437",
        oxide: "#a8552a",
        night: "#07080d",
        smoke: "#a8b0c3"
      },
      boxShadow: {
        glow: "0 0 50px rgba(245, 158, 11, 0.22)",
        glass: "0 30px 100px rgba(0, 0, 0, 0.42)"
      },
      animation: {
        'slow-pan': 'slowPan 18s ease-in-out infinite alternate',
        'grain': 'grain 1.8s steps(8) infinite'
      },
      keyframes: {
        slowPan: {
          '0%': { transform: 'translate3d(-2%, -1%, 0) scale(1.04)' },
          '100%': { transform: 'translate3d(2%, 1%, 0) scale(1.1)' }
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-3%, 2%)' },
          '40%': { transform: 'translate(2%, -3%)' },
          '60%': { transform: 'translate(-2%, -1%)' },
          '80%': { transform: 'translate(3%, 3%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
