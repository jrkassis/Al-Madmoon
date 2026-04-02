// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#5876e4", // Primary brand color
          700: "#4c5dd4",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.5s ease-out",
        popIn: "popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        popIn: {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.1)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      boxShadow: {
        sm: "0 2px 12px rgba(0, 0, 0, 0.04)",
        md: "0 4px 16px rgba(0, 0, 0, 0.08)",
        lg: "0 10px 40px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}