import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

import { recipes } from '@/ui/theme/recipes';

const globalCss = defineGlobalStyles({
  body: {
    backgroundColor: 'neutral.100',
    color: 'neutral.950',
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./ui/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      recipes,
      keyframes: {
        gaming: {
          '100%': {
            backgroundPositionX: '200%',
          },
        },
      },
      tokens: {
        animations: {
          gaming: {
            value: 'gaming 1s ease-in-out infinite',
          },
        },
        fonts: {
          noto: {
            value: 'var(--font-noto-sans-jp)',
          },
        },
      },
    },
  },

  staticCss: {
    recipes: {
      button: [
        {
          size: ['md'],
        },
        {
          variant: ['*'],
        },
      ],
    },
  },

  // The output directory for your css system
  outdir: 'panda',

  jsxFramework: 'react',
  globalCss,
});
