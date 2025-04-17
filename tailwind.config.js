/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-dark': 'hsl(var(--primary-dark) / <alpha-value>)',
        'primary-light': 'hsl(var(--primary-light) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        dark: 'hsl(var(--dark) / <alpha-value>)',
        light: 'hsl(var(--light) / <alpha-value>)',
        added: 'hsl(var(--added) / <alpha-value>)',
        removed: 'hsl(var(--removed) / <alpha-value>)',
        unchanged: 'hsl(var(--unchanged) / <alpha-value>)',
        updated: 'hsl(var(--updated) / <alpha-value>)',
        gray: {
          50: 'hsl(var(--gray-50) / <alpha-value>)',
          100: 'hsl(var(--gray-100) / <alpha-value>)',
          200: 'hsl(var(--gray-200) / <alpha-value>)',
          300: 'hsl(var(--gray-300) / <alpha-value>)',
          400: 'hsl(var(--gray-400) / <alpha-value>)',
          500: 'hsl(var(--gray-500) / <alpha-value>)',
          600: 'hsl(var(--gray-600) / <alpha-value>)',
          700: 'hsl(var(--gray-700) / <alpha-value>)',
          800: 'hsl(var(--gray-800) / <alpha-value>)',
          900: 'hsl(var(--gray-900) / <alpha-value>)',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} 