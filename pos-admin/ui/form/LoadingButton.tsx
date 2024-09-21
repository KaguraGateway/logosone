import { IconContext } from 'react-icons';
import { FaApple } from 'react-icons/fa';

import { css } from '@/panda/css';

import { Button } from './Button';

type Props = React.ComponentProps<typeof Button> & {
  isLoading: boolean;
};

export function LoadingButton(props: Props) {
  const { isLoading, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      style={{
        background: isLoading ? 'linear-gradient(to right, Magenta, yellow, Cyan, Magenta) 0% center/200%' : undefined,
      }}
      animation={props.isLoading ? 'gaming 2s linear infinite' : undefined}
    >
      {props.isLoading && (
        <IconContext.Provider value={{ className: css({ animation: 'spin 1s linear infinite' }) }}>
          <FaApple />
        </IconContext.Provider>
      )}
      {props.children}
    </Button>
  );
}
