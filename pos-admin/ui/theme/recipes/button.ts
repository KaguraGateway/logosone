import { defineRecipe } from '@pandacss/dev';

export const button = defineRecipe({
  className: 'button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'semibold',
    borderRadius: 'md',
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'md',
  },
  variants: {
    variant: {
      secondary: {
        background: 'gray.300',
        _hover: {
          background: 'gray.400',
        },
      },
      success: {
        background: 'green.500',
        color: 'white',
        _hover: {
          background: 'green.600',
        },
      },
      error: {
        background: 'red.500',
        color: 'white',
        _hover: {
          background: 'red.600',
        },
      },
    },
    size: {
      md: {
        minW: '10',
        textStyle: 'md',
        py: '2',
      },
    },
  },
});
