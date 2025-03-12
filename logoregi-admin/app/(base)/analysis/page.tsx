'use client';

import { Box, Flex, Grid, GridItem, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { CoffeeBrewSalesSection } from './_components/CoffeeBrewSalesSection';
import { PaymentTypeSalesSection } from './_components/PaymentTypeSalesSection';
import { ProductSalesSection } from './_components/ProductSalesSection';
import { TimeSlotSalesSection } from './_components/TimeSlotSalesSection';
import { TodaySalesSection } from './_components/TodaySalesSection';
import { TotalSalesSection } from './_components/TotalSalesSection';

export default function SalesAnalysis() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>売上分析</Heading>
      
      <Tabs variant="enclosed" index={tabIndex} onChange={setTabIndex} mb={6}>
        <TabList>
          <Tab>総合</Tab>
          <Tab>時間帯別</Tab>
          <Tab>支払い方法別</Tab>
          <Tab>商品別</Tab>
          <Tab>コーヒー淹れ方別</Tab>
        </TabList>
        
        <TabPanels>
          {/* 総合タブ */}
          <TabPanel>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <TotalSalesSection />
              </GridItem>
              <GridItem>
                <TodaySalesSection />
              </GridItem>
            </Grid>
          </TabPanel>
          
          {/* 時間帯別タブ */}
          <TabPanel>
            <TimeSlotSalesSection />
          </TabPanel>
          
          {/* 支払い方法別タブ */}
          <TabPanel>
            <PaymentTypeSalesSection />
          </TabPanel>
          
          {/* 商品別タブ */}
          <TabPanel>
            <ProductSalesSection />
          </TabPanel>
          
          {/* コーヒー淹れ方別タブ */}
          <TabPanel>
            <CoffeeBrewSalesSection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
