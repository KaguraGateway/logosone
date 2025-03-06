'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      sizes: {
        logos: {
          w: '450px',
          h: '128px',
          fontSize: '6xl',
        },
      },
    },
    Spinner: {
      sizes: {
        '2xl': {
          w: '6rem',
          h: '6rem',
        },
      },
    },
    Checkbox: {
      sizes: {
        xl: {
          control: {
            w: '1.75rem',
            h: '1.75rem',
          },
          icon: {
            fontSize: '1.25rem',
          },
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
