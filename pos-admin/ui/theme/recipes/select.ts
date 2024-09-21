import { selectAnatomy } from '@ark-ui/react';
import { defineParts, defineRecipe } from '@pandacss/dev';

const parts = defineParts(selectAnatomy.build());

export const select = defineRecipe({
  className: 'select',
  base: parts({
    content: {
      background: 'white',
      borderRadius: 'md',
      boxShadow: 'lg',
      px: '6',
      py: '2',
    },
    label: {
      color: 'gray.500',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 'md',
      borderColor: 'gray.300',
      borderWidth: '1px',
      p: '2',
      gap: '1',
    },
    option: {
      borderBottom: '1px solid',
      borderColor: 'gray.300',
      pb: '2',
      mb: '2',
      _last: {
        border: 'none',
        mb: 0,
      },
    },
  }),
});
