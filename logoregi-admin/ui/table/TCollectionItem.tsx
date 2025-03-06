import { Box, BoxProps } from '@chakra-ui/react';

export function TCollectionItem(props: BoxProps) {
  return (
    <Box
      {...props}
      borderBottomWidth="1px"
      borderColor="gray.300"
      pb={2}
      mb={2}
    />
  );
}
