'use client';

import { Box, Grid, GridItem, Heading, Tabs } from '@chakra-ui/react';

import { PaymentTypeSalesSection } from './_components/PaymentTypeSalesSection';
import { ProductSalesSection } from './_components/ProductSalesSection';
import { TimeSlotSalesSection } from './_components/TimeSlotSalesSection';
import { TodaySalesSection } from './_components/TodaySalesSection';
import { TotalSalesSection } from './_components/TotalSalesSection';

export default function SalesAnalysis() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>売上分析</Heading>
      
      <Tabs.Root variant="enclosed" mb={6} defaultValue='common'>
        <Tabs.List>
          <Tabs.Trigger value='common'>総合</Tabs.Trigger>
          <Tabs.Trigger value='timeslot'>時間帯別</Tabs.Trigger>
          <Tabs.Trigger value='payment'>支払い方法別</Tabs.Trigger>
          <Tabs.Trigger value='product'>商品別</Tabs.Trigger>
        </Tabs.List>

        {/* 総合タブ */}
        <Tabs.Content value='common'>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <TotalSalesSection />
            </GridItem>
            <GridItem>
              <TodaySalesSection />
            </GridItem>
          </Grid>
        </Tabs.Content>

        {/* 時間帯別タブ */}
        <Tabs.Content value='timeslot'>
          <TimeSlotSalesSection />
        </Tabs.Content>

        {/* 支払い方法別タブ */}
        <Tabs.Content value='payment'>
          <PaymentTypeSalesSection />
        </Tabs.Content>

        {/* 商品別タブ */}
        <Tabs.Content value='product'>
          <ProductSalesSection />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
