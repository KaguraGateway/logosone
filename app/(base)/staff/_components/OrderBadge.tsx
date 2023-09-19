import { Box, Flex } from '@chakra-ui/react';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiCoffee } from 'react-icons/fi';

export function OrderBadge({ type, ...props }: React.ComponentProps<typeof Flex> & { type: 'takeout' | 'eat-in' }) {
  return (
    <Flex
      bg={type === 'takeout' ? 'orange.500' : 'teal.500'}
      color="white"
      alignItems="center"
      fontStyle="semibold"
      borderRadius="md"
      px={1}
      py={0.5}
      {...props}
    >
      <Box mr="0.5">{type === 'takeout' ? <BiCoffeeTogo /> : <FiCoffee />}</Box>
      {type === 'takeout' ? 'テイクアウト' : 'イートイン'}
    </Flex>
  );
}
