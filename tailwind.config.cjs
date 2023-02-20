/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '0rem',
        },
      },
      colors: {
        pink: 'rgb(var(--pink) / <alpha-value>)',
        mauve: 'rgb(var(--mauve) / <alpha-value>)',
        lavender: 'rgb(var(--lavender) / <alpha-value>)',
      },
      textColor: {
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
      },
      backgroundColor: {
        base: 'rgb(var(--base) / <alpha-value>)',
        crust: 'rgb(var(--crust) / <alpha-value>)',
      },
      borderColor: {
        base: 'rgb(var(--base) / <alpha-value>)',
        crust: 'rgb(var(--crust) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
