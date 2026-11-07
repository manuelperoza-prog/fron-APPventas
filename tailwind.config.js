export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        sage: '#687F6E',
        moss: '#A7B8A7',
        mist: '#D9E1D9',
        ivory: '#F4EFE6',
        sand: '#C9BDAF',
        darkbg: '#3A403C',
        darkcard: '#292E2B',
        darkaccent: '#8CA392',
        amberwarn: '#D97706'
      },
      boxShadow: {
        'soft': '6px 6px 12px #e3ded6, -6px -6px 12px #ffffff',
        'soft-pressed': 'inset 4px 4px 8px #e3ded6, inset -4px -4px 8px #ffffff'
      }
    },
  },
  plugins: [],
}