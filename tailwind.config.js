/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './config/**/*.{js,html}',
    './index.js',
    './src/**/*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg':      '#030b1e',
        'mutual-navy':  '#161D33',
        'hero-bg':      '#0E162E',
        'card-bg':      '#111D35',
        'border-color': '#1B2A46',
        'heading':      '#EEF1F9',
        'muted':        '#8898C0',
        'gold':         '#FCB71B',
        'gold-hover':   '#e5a618',
        'brand-blue':   '#1E3490',
        'cyan':         '#11CFFA',
      }
    }
  },
  plugins: [],
}
