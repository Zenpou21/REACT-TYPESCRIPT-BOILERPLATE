const defaultTheme = require("tailwindcss/defaultTheme");
const {heroui} = require("@heroui/react");

module.exports = {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        body: ['Montserrat', 'sans'],
        ph: ['Hind', 'sans'],

      },
      colors: {
        primary_dark: "#4e84c4",
        secondary_dark: "#474747",
        tertiary_dark: "#18181b",
        primary: "#0066ff",
        secondary: "#fcc036",
        success: "#27AE60", 
        info: "#2792ED",
        danger: "#EB5757",
        warning: "#FFBE0F",
        custom_th: "#f3e5e5",
        custom_th_dark: "#2f1316",
        th: "#fff2eb",
        th_dark: "#693b27",
      },
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        '2xs': '320px',
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '3xl': '1920px',
        ...defaultTheme.screens,
      },
 
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
         radius: {
          medium: "8px"
        },
      }
    }),
  ],
};
