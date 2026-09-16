/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-blue-600", "bg-orange-500", "bg-emerald-600", "bg-purple-600",
    "bg-blue-50", "bg-orange-50", "bg-emerald-50", "bg-purple-50",
    "text-blue-600", "text-orange-600", "text-emerald-600", "text-purple-600",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  
};