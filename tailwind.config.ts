import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#A7A8AB",
        tertiary: '#1D1D1D',
        accentPrimary: "#7A23B9",
        accentSecondary: "#C58A42",
        accentTertiary: "#C58A42",
        accent: "#6B72FA",
        dark: "#262525",
        light: "#FFFFFF",
        // You can add more colors as needed
      },
      backgroundImage:{
        'radial-gradient-blue': 'radial-gradient(rgba(27, 175, 170, .8), rgba(27, 175, 170, 0))',
        'radial-gradient-yellow': 'radial-gradient(rgba(175,98, 27, .8), rgba(175,98, 27, .8))'
      },
      gridTemplateColumns: {
        // Complex site-specific row configuration
        //'layout': '200px minmax(900px, 1fr) 100px',
        'main-layout' : '80px 1fr'
      }

    },
  },
  plugins: [],
};
export default config;
