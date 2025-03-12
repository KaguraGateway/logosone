'use client';

import { Box, Container, Grid, GridItem, Stack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

import Sidebar from '@/ui/nav/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid templateRows="80px 1fr" templateColumns="16rem 1fr" minH="100vh">
      <GridItem gridRow="1" gridColumn="1 / span 2">
        <Box boxShadow="md" bg='white'>
          <Stack direction="row" align="center" h="16" px={12}>
            <Link href="/">
              <Image src="/logo.svg" width={300} height={32} alt="logo" />
            </Link>
          </Stack>
        </Box>
        <Box h='8px' w='full' background='linear-gradient(90deg, #704040 -5.23%, #431A1A 101.64%)' />
      </GridItem>
      <GridItem gridRow="2" gridColumn="1" ml={4}>
        <Sidebar />
      </GridItem>
      <GridItem px={4}>
        <Box bg='white' borderRadius='24px' p={4}>
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
}
