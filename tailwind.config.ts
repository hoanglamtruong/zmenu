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
        navy: "var(--color-navy)",
        teal: "var(--color-teal)",
        ice: "var(--color-ice)",
        orange: "var(--color-orange)",
        ink: "var(--color-ink)",
        ink2: "var(--color-ink2)",
        ink3: "var(--color-ink3)",
        line: "var(--color-line)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
