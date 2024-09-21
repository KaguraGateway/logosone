import clsx from 'clsx';

import { css } from '@/panda/css';
import { Shorthand } from '@/panda/types/prop-type';

type Props = React.ComponentProps<'div'> & {
  grow?: Shorthand<'minWidth'>;
};

export function Td(props: Props) {
  return (
    <div
      {...props}
      className={clsx(
        css({
          display: 'flex',
          alignItems: 'center',
          flex: `1 0 100px`,
          overflow: 'hidden',
          minWidth: props.grow ?? '100px',
        }),
        props.className
      )}
      style={{ flex: props.grow !== undefined ? `0 0 ${props.grow}` : undefined }}
    />
  );
}
