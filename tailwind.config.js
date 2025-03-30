/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--sidebar-border))",
        ring: "hsl(var(--sidebar-ring))",
        background: "hsl(var(--sidebar-background))",
        foreground: "hsl(var(--sidebar-foreground))",
        primary: {
          DEFAULT: "hsl(var(--sidebar-primary))",
          foreground: "hsl(var(--sidebar-primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--sidebar-accent))",
          foreground: "hsl(var(--sidebar-accent-foreground))",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
