import { defineRecipe } from '@pandacss/dev';

export const input = defineRecipe({
  className: 'input',
  base: {
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'gray.300',
    color: 'neutral.950',
    px: '2',
    py: '2',
  },
});
