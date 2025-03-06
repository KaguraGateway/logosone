'use client';

import { Box, Flex, ListItem, Text } from '@chakra-ui/react';
import Link from 'next/link';
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
    <ListItem
      px={6}
      py={2.5}
      borderRadius="md"
      backgroundColor={isVisited ? 'gray.200' : undefined}
      _hover={{ backgroundColor: 'gray.200' }}
      listStyleType="none"
    >
      <Link href={link.href}>
        <Flex gap={3} alignItems="center">
          <Box>{link.icon}</Box>
          <Text>{link.label}</Text>
        </Flex>
      </Link>
    </ListItem>
  );
}
