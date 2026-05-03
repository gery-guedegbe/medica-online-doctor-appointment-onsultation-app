/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Poids standards
        "urbanist-thin": ["Urbanist-Thin"],
        "urbanist-extralight": ["Urbanist-Extra-Light"],
        "urbanist-light": ["Urbanist-Light"],
        "urbanist-regular": ["Urbanist-Regular"],
        "urbanist-medium": ["Urbanist-Medium"],
        "urbanist-semibold": ["Urbanist-Semi-Bold"],
        "urbanist-bold": ["Urbanist-Bold"],
        "urbanist-extrabold": ["Urbanist-Extra-Bold"],
        "urbanist-black": ["Urbanist-Black"],

        // Variantes Italiques
        "urbanist-thin-italic": ["Urbanist-Thin-Italic"],
        "urbanist-extralight-italic": ["Urbanist-Extra-Light-Italic"],
        "urbanist-italic": ["Urbanist-Italic"],
        "urbanist-medium-italic": ["Urbanist-Medium-Italic"],
        "urbanist-semibold-italic": ["Urbanist-Semi-Bold-Italic"],
        "urbanist-bold-italic": ["Urbanist-Bold-Italic"],
        "urbanist-extrabold-italic": ["Urbanist-Extra-Bold-Italic"],
        "urbanist-black-italic": ["Urbanist-Black-Italic"],
      },
      colors: {
        // Section: Main
        main: {
          primary: "#246BFD",
          secondary: "#FFD300",
        },

        // Section: Alert & Status
        status: {
          success: "#07BD74",
          info: "#246BFD",
          warning: "#FFD300",
          error: "#F75555",
          disabled: "#D8D8D8",
          disabledButton: "#3062C8",
        },

        // Section: Greyscale
        greyscale: {
          900: "#212121",
          800: "#424242",
          700: "#616161",
          600: "#757575",
          500: "#9E9E9E",
          400: "#BDBDBD",
          300: "#E0E0E0",
          200: "#EEEEEE",
          100: "#F5F5F5",
          50: "#FAFAFA",
        },

        // Section: Dark Colors
        dark: {
          1: "#181A20",
          2: "#1F222A",
          3: "#35383F",
        },

        // Section: Others
        others: {
          white: "#FFFFFF",
          black: "#000000",
          red: "#F44336",
          pink: "#E91E63",
          purple: "#9C27B0",
          deepPurple: "#673AB7",
          indigo: "#3F51B5",
          blue: "#2196F3",
          lightBlue: "#03A9F4",
          cyan: "#00BCD4",
          teal: "#009688",
          green: "#4CAF50",
          lightGreen: "#8BC34A",
          lime: "#CDDC39",
          yellow: "#FFEB3B",
          amber: "#FFC107",
          orange: "#FF9800",
          deepOrange: "#FF5722",
          brown: "#795548",
          blueGrey: "#607D8B",
        },

        // Section: Background
        background: {
          blue: "#F0F6FF",
          green: "#F1FFF1",
          orange: "#FFF8ED",
          pink: "#FFF5F5",
          yellow: "#FFFEE0",
          purple: "#FBF0FF",
        },

        // Section: Transparent (Base Color + Opacity)
        transparent: {
          blue: "rgba(36, 107, 253, 0.08)", // #246BFD à 8%
          orange: "rgba(255, 211, 0, 0.08)", // #FFD300 à 8%
          yellow: "rgba(255, 211, 0, 0.1)", // #FFD300 à 10%
          red: "rgba(247, 85, 85, 0.08)", // #F75555 à 8%
          green: "rgba(7, 189, 116, 0.08)", // #07BD74 à 8%
          purple: "rgba(156, 39, 176, 0.08)", // #9C27B0 à 8%
          cyan: "rgba(0, 188, 212, 0.08)", // #00BCD4 à 8%
        },
      },
      fontSize: {
        // Headings
        h1: ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["40px", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h4: ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        h5: ["20px", { lineHeight: "1.2", fontWeight: "700" }],
        h6: ["18px", { lineHeight: "1.2", fontWeight: "700" }],

        // Body
        "body-xl": ["18px", { lineHeight: "1.5" }],
        "body-l": ["16px", { lineHeight: "1.5" }],
        "body-m": ["14px", { lineHeight: "1.5" }],
        "body-s": ["12px", { lineHeight: "1.5" }],
        "body-xs": ["10px", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
