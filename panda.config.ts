import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

import { recipes } from '@/ui/theme/recipes';

const globalCss = defineGlobalStyles({
  body: {
    backgroundColor: 'neutral.100',
    color: 'neutral.950',
  }
})

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
      tokens: {
        fonts: {
          noto: {
            value: 'var(--font-noto-sans-jp)'
          }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: 'panda',

  jsxFramework: 'react',
  globalCss,
});
