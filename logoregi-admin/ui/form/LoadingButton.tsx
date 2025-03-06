'use client';

import { Button, ButtonProps, keyframes, Spinner } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { FaApple } from 'react-icons/fa';

type Props = ButtonProps & {
  isLoading: boolean;
};

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gamingAnimation = keyframes`
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
`;

export function LoadingButton(props: Props) {
  const { isLoading, children, ...rest } = props;
  
  return (
    <Button
      {...rest}
      disabled={isLoading}
      style={{
        background: isLoading ? 'linear-gradient(to right, Magenta, yellow, Cyan, Magenta) 0% center/200%' : undefined,
      }}
      animation={isLoading ? `${gamingAnimation} 2s linear infinite` : undefined}
    >
      {isLoading && (
        <IconContext.Provider value={{ style: { animation: `${spinAnimation} 1s linear infinite` } }}>
          <FaApple style={{ marginRight: '8px' }} />
        </IconContext.Provider>
      )}
      {children}
    </Button>
  );
}
