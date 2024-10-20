import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen1: "#00764F",
        customGreen2: "#8CC1B0",
        customGreen3: "#001E14",
        customGreen4: "#D9EAE5",
        customGreen5: "#E6F1ED",
      },
    },
  },
  plugins: [],
};

export default config;
