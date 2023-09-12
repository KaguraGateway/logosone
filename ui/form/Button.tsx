import clsx from 'clsx';

import { styled } from '@/panda/jsx';
import { button, type ButtonVariantProps } from '@/panda/recipes';

export function Button(props: React.ComponentProps<typeof styled.button> & ButtonVariantProps) {
  return (
    <styled.button {...props} className={clsx(button({ size: props.size, variant: props.variant }), props.className)} />
  );
}
