import { Td as ChakraTd } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof ChakraTd> & {
  grow?: string | number;
};

export function Td(props: Props) {
  const { grow, ...rest } = props;
  
  return (
    <ChakraTd 
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flex: grow !== undefined ? `0 0 ${grow}` : '1 0 100px',
        overflow: 'hidden',
        minWidth: grow ?? '100px',
      }}
    />
  );
}
