const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      sm: "2px",
      md: "4px",
      lg: "6px",
    },
    extend: {},
  },
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "2px", // rounded-small
          medium: "4px", // rounded-medium
          large: "6px", // rounded-large
        },
      },
      prefix: "wb",
    }),
  ],
};
