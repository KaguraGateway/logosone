'use client';

import { Box, Flex, List, Text, defineRecipe, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export type Navigation = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function NavItem(link: Navigation) {
  const pathname = usePathname();
  const isVisited = pathname === link.href;

  return (
    <Box
      as='li'
      px={6}
      py={2.5}
      borderRadius="24px"
      backgroundColor={isVisited ? 'gray.200' : undefined}
      _hover={{ backgroundColor: 'gray.200' }}
      listStyleType="none"
    >
      <ChakraLink asChild textDecoration='none' color='gray.600' fontSize={18} fontWeight={800} _focus={{ outline: 0 }} w='full'>
        <NextLink href={link.href}>
          <Flex gap={3} alignItems="center">
            <Box>{link.icon}</Box>
            <Text>{link.label}</Text>
          </Flex>
        </NextLink>
      </ChakraLink>
    </Box>
  );
}
