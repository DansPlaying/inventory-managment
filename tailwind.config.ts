import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic colors that change with theme
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        dark: "var(--color-dark)",
        light: "var(--color-light)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        card: "var(--color-card)",
        // Static accent colors (same in both modes)
        accentPrimary: "#7A23B9",
        accentSecondary: "rgba(122, 35, 185, 0.08)",
        accentTertiary: "#C58A42",
        accent: "#6B72FA",
      },
      backgroundImage:{
        'radial-gradient-blue': 'radial-gradient(rgba(27, 175, 170, .8), rgba(27, 175, 170, 0))',
        'radial-gradient-yellow': 'radial-gradient(rgba(175,98, 27, .8), rgba(175,98, 27, .8))'
      },
      gridTemplateColumns: {
        // Complex site-specific row configuration
        //'layout': '200px minmax(900px, 1fr) 100px',
        'main-layout' : '80px 1fr',
        'statistics-layout': '2fr 1fr',
        'table': 'auto auto auto auto auto',
      },
      gridTemplateRows: {
        // Complex site-specific row configuration
        //'layout': '200px minmax(900px, 1fr) 100px',
        'statistics-layout': '65% 35%',
        'statistics-layout-mobile': 'auto auto auto auto'
      }
    },
  },
  plugins: [],
};
export default config;
