// tailwind.config.js
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: "#0f172a", // slate-900
              color: "#f8fafc", // slate-50
              borderRadius: "0.5rem",
              padding: "1rem",
            },
            code: {
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              borderRadius: "0.375rem",
              padding: "0.2rem 0.4rem",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
