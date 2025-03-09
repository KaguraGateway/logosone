'use client';

import { defineTokens } from '@chakra-ui/react';

export const tokens = defineTokens({
  colors: {
    neutral: {
      50: { value: '#fafafa' },
      100: { value: '#f5f5f5' },
      200: { value: '#e5e5e5' },
      300: { value: '#d4d4d4' },
      400: { value: '#a3a3a3' },
      500: { value: '#737373' },
      600: { value: '#525252' },
      700: { value: '#404040' },
      800: { value: '#262626' },
      900: { value: '#171717' },
      950: { value: '#0a0a0a' },
    },
  },
  semanticTokens: {
    colors: {
      text: {
        default: { value: 'black' },
        _dark: { value: 'neutral.200' },
      },
      bg: {
        default: { value: 'white' },
        _dark: { value: 'neutral.900' },
      },
      card: {
        default: { value: 'neutral.200' },
        _dark: { value: 'neutral.800' },
      },
      border: {
        default: { value: 'neutral.300' },
        _dark: { value: 'neutral.700' },
      },
    },
  },
});
