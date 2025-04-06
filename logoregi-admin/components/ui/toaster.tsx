'use client';

import { createToaster } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top',
  duration: 5000,
});

export const toast = {
  success: (options: any) => toaster.create({ 
    description: options.title || options.description 
  }),
  error: (options: any) => toaster.create({ 
    description: options.title || options.description,
    type: 'error'
  }),
};
