/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-chill': {
          '50': '#f2f9f9',
          '100': '#ddeff0',
          '200': '#bfe0e2',
          '300': '#92cace',
          '400': '#5faab1',
          '500': '#438e96',
          '600': '#3b757f',
          '700': '#356169',
          '800': '#325158',
          '900': '#2d464c',
          '950': '#1a2c32',
      },
        'highland': {
          '50': '#f4f6ef',
          '100': '#e6eadd',
          '200': '#cfd7bf',
          '300': '#b0be98',
          '400': '#93a576',
          '500': '#718355',
          '600': '#5b6c44',
          '700': '#475437',
          '800': '#3b452f',
          '900': '#343c2b',
          '950': '#1a1f14',
      },
    },
    gridTemplateColumns: {
      'auto-fit': 'repeat(auto-fit, minmax(300px,1fr))'
    }
    }
  },
  plugins: [],
}

