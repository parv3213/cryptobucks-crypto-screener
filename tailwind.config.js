/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { nunito: 'Nunito' },
      colors: {
        gray: { 100: '#808080', 200: '#323232', 300: '#212121' },
        white: '#fff',
        cyan: '#14ffec',
        red: '#d6436e',
        green: '#25da72',
      },
      fontSize: {
        sm: '14px',
        md: '18px',
        lg: '24px',
        xl: '32px',
        base: '16px',
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
