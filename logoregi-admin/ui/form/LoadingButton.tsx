'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { FaApple } from 'react-icons/fa';

type Props = ButtonProps & {
  isLoading: boolean;
};

export function LoadingButton(props: Props) {
  const { isLoading, children, ...rest } = props;
  
  return (
    <Button
      {...rest}
      disabled={isLoading}
      style={{
        background: isLoading ? 'linear-gradient(to right, Magenta, yellow, Cyan, Magenta) 0% center/200%' : undefined,
      }}
    >
      {isLoading && (
        <IconContext.Provider value={{ 
          style: { 
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          } 
        }}>
          <FaApple />
        </IconContext.Provider>
      )}
      {children}
    </Button>
  );
}
