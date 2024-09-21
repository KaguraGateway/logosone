import { radioGroupAnatomy } from '@ark-ui/react';
import { defineParts, defineRecipe } from '@pandacss/dev';

const parts = defineParts(radioGroupAnatomy.build());

export const switchRadioGroup = defineRecipe({
  className: 'radio-group',
  base: parts({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      color: 'gray.500',
    },
    radio: {
      display: 'inline-flex',
      px: '2',
      borderRadius: 'md',
      _checked: {
        background: 'blue.300',
      },
    },
  }),
});
