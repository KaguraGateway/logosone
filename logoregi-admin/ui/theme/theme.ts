'use client';

import { createSystem, defaultConfig } from '@chakra-ui/react';
import { tokens } from './tokens';

// Create a minimal system with just the tokens
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: tokens,
    semanticTokens: tokens,
  },
});
