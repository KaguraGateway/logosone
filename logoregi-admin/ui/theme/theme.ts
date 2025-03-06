'use client';

import { createSystem } from '@chakra-ui/react';
import { tokens } from './tokens';

// Create a minimal system with just the tokens
export const system = createSystem({
  theme: {
    tokens: tokens,
  },
});
