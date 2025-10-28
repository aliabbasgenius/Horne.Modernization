/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'body.dark-theme'],
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'var(--mat-sys-surface)',
        'surface-container': 'var(--mat-sys-surface-container)',
        'surface-container-low': 'var(--mat-sys-surface-container-low)',
        'surface-container-high': 'var(--mat-sys-surface-container-high)',
        primary: 'var(--mat-sys-primary)',
        'on-primary': 'var(--mat-sys-on-primary)',
        'primary-container': 'var(--mat-sys-primary-container)',
        'on-primary-container': 'var(--mat-sys-on-primary-container)',
        tertiary: 'var(--mat-sys-tertiary)',
        error: 'var(--mat-sys-error)',
        outline: 'var(--mat-sys-outline)',
        'outline-variant': 'var(--mat-sys-outline-variant)',
        'on-surface': 'var(--mat-sys-on-surface)',
        'on-surface-variant': 'var(--mat-sys-on-surface-variant)',
      },
      fontFamily: {
        sans: ['Roboto', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 24px 60px -40px rgba(12, 62, 140, 0.55)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};
