'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { css } from '@/panda/css';
import { Box, HStack, styled } from '@/panda/jsx';

export type Navigation = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function NavItem(link: Navigation) {
  const pathname = usePathname();
  const isVisited = pathname === link.href;

  return (
    <li
      className={css({
        px: '6',
        py: '2.5',
        borderRadius: 'md',
        backgroundColor: isVisited ? 'gray.200' : undefined,
        _hover: { backgroundColor: 'gray.200' },
      })}
    >
      <Link href={link.href}>
        <HStack gap="3">
          <Box>{link.icon}</Box>
          <styled.span>{link.label}</styled.span>
        </HStack>
      </Link>
    </li>
  );
}
