import Image from 'next/image';
import Link from 'next/link';

import {
  Container, Grid, GridItem, Stack,
} from '@/panda/jsx';
import Sidebar from '@/ui/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid gridTemplateRows="76px 1fr" gridTemplateColumns="15rem 1fr" minH="100vh">
      <GridItem gridRow="1" gridColumn="1 / span 2">
        <Container boxShadow="md">
          <Stack direction="row" align="center" h="16" justify="space-between">
            <Link href="/">
              <Image src="/logo.svg" width={120} height={16} alt="logo" />
            </Link>
          </Stack>
        </Container>
      </GridItem>
      <GridItem gridRow="2" gridColumn="1">
        <Sidebar />
      </GridItem>
      <GridItem>{children}</GridItem>
    </Grid>
  );
}
