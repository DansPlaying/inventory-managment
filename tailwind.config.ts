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
    },
  },
  plugins: [],
};
export default config;
