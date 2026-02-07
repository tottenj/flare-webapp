import { heroui } from '@heroui/react';

export default heroui({
  prefix: 'app',
  themes: {
    light: {
      colors: {
        default: {
          '50': '#f4f3f3',
          '100': '#dddada',
          '200': '#d1cece',
          '300': '#c5c2c2',
          '400': '#b9b6b6',
          '500': '#adabab',
          '600': '#908e8e',
          '700': '#737171',
          '800': '#565555',
          '900': '#3a3939',
          foreground: '#1d0b31',
          DEFAULT: '#dddada',
        },
        primary: {
          '50': '#f3f1f6',
          '100': '#ddd7e6',
          '200': '#c6bddd',
          '300': '#afa3d3',
          '400': '#9889ca',
          '500': '#1d0b31',
          '600': '#180928',
          '700': '#130720',
          '800': '#0e0517',
          '900': '#09030f',
          foreground: '#ffffff',
          DEFAULT: '#1d0b31',
        },
        secondary: {
          50: '#fde2ea', // pink
          100: '#eee6ff', // purple
          200: '#e6f0ff', // blue
          300: '#e6faf7', // teal
          400: '#fff6db', // yellow
          500: '#ffe9dc', // orange
          foreground: '#1d0b31',
          DEFAULT: '#8b5cf6',
        },
        success: {
          500: '#22c55e',
          foreground: '#ffffff',
        },
        warning: {
          500: '#f59e0b',
          foreground: '#000000',
        },
        danger: {
          500: '#ef4444',
          foreground: '#ffffff',
        },

        background: '#ffffff',
        foreground: {
          '50': '#f2f2f5',
          '100': '#e6e6eb',
          '200': '#ccccd6',
          '300': '#b3b3c2',
          '400': '#9999ad',
          '500': '#808099',
          '600': '#666680',
          '700': '#4d4d66',
          '800': '#33334d',
          '900': '#1d1d31',
          DEFAULT: '#1d0b31',
        },
        content1: {
          DEFAULT: '#ffffff',
          foreground: '#1d0b31',
        },
        content2: {
          DEFAULT: '#f4f4f5',
          foreground: '#1d0b31',
        },
        content3: {
          DEFAULT: '#e4e4e7',
          foreground: '#1d0b31',
        },
        focus: '#8b5cf6',
        overlay: '#000000',
      },
    },
  },
  layout: {
    disabledOpacity: '0.8',
    radius: {
      small: '1rem',
      medium: '1.5rem',
      large: '9999px',
    },
  },
});
