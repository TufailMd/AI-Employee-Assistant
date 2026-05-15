/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        error: "#ba1a1a",
        outline: "#76777d",
        "outline-variant": "#c6c6cd",
        primary: "#0b1220",
        secondary: "#4648d4",
        "secondary-container": "#e1e0ff",
        "on-secondary-container": "#07006c",
        surface: "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-variant": "#d3e4fe",
        background: "#f8f9ff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#45464d",
        "primary-container": "#131b2e",
        "on-primary": "#ffffff",
        "error-container": "#ffdad6",
        "tertiary-fixed": "#c9e6ff",
      },
      borderRadius: {
        lg: "0.25rem",
        xl: "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        panel: "0 1px 2px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
}
