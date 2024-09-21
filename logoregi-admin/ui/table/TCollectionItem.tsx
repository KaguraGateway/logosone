import clsx from 'clsx';

import { css } from '@/panda/css';

type Props = React.ComponentProps<'div'>;

export function TCollectionItem(props: Props) {
  return (
    <div
      {...props}
      className={clsx(
        css({
          borderBottomWidth: '1px',
          borderColor: 'gray.300',
          pb: '2',
          mb: '2',
        }),
        props.className
      )}
    />
  );
}
