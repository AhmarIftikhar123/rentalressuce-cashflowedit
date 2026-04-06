/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.php',
    './inc/**/*.php',
    './template-parts/**/*.php',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold:         '#C9972A',
          'gold-light': '#F0C96A',
          'gold-dark':  '#A67A1A',
          black:        '#1A1A1A',
          'black-soft': '#2C2C2A',
          cream:        '#F5F3EE',
          'cream-dark': '#EDEAE3',
        },
        audit: {
          positive: '#2D7A2D',
          negative: '#E24B4A',
          warning:  '#C9972A',
          neutral:  '#888780',
        },
        step: {
          bg:             '#F7F5F0',
          card:           '#FFFFFF',
          border:         '#E8E5DE',
          'border-active':'#C9972A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn:  '10px',
        opt:  '10px',
        pill: '9999px',
      },
      boxShadow: {
        card:       '0 1px 4px rgba(0,0,0,0.06)',
        'opt-active':'0 0 0 2px #C9972A',
      },
    },
  },
  plugins: [],
};
