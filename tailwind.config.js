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
          gold:         '#56B7FF',  // primary accent
          'gold-light': '#EBF5FF',
          'gold-dark':  '#0C245A',
          black:        '#05122F',
          'black-soft': '#0C245A',
          cream:        '#EBF5FF',
          'cream-dark': '#D6EDFF',
        },

        audit: {
          positive: '#27AE60',
          negative: '#C0392B',
          warning:  '#56B7FF',   // aligned with primary now
          neutral:  '#64748B',
        },

        step: {
          bg:              '#F0F6FF',
          card:            '#FFFFFF',
          border:          '#C8DEFF',
          'border-active': '#56B7FF',
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
        card:        '0 1px 4px rgba(0,0,0,0.06)',
        'opt-active':'0 0 0 2px #56B7FF',
      },
    },
  },
  plugins: [],
};