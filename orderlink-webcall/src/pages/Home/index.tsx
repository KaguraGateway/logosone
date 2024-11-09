import {Box, Flex, Grid, GridItem, Heading, Icon, Text, VStack} from '@chakra-ui/react';
import {IconContext} from 'react-icons';
import {BiDish} from 'react-icons/bi';
import { FaBell } from "react-icons/fa";

import logo from '/logo.svg';

import {CallingOrderCard} from './_components/CallingOrderCard';
import {CookingOrderCard} from './_components/CookingOrderCard';
import {useCustomer} from './usecase.tsx';

export function Home() {
    const {cookingOrders, callingOrders} = useCustomer();

    return (
        <Box maxW="100vw" maxH="100vh" overflow="hidden">
            <Flex h="80px" px="12px" bg="white" alignItems="center" justifyContent="center" boxShadow="lg">
                <img src={logo} alt="logo"/>
            </Flex>
            <Flex flexDir="column" alignItems="center" justifyContent="center" px={4} mt={4} mb={2}>
                <Flex alignItems="center" justifyContent="center" mb={2} gap={1}>
                    <Icon color="gray.400">
                        <FaBell />
                    </Icon>
                    <Heading fontSize="xl">
                        注文状況
                    </Heading>
                </Flex>
                <Text fontSize="medium" fontWeight="semibold" color="gray.500" textAlign="center">
                    お待ちいただきありがとうございます。<br/>
                    お手持ちの番号が呼び出し中になりましたら、<br />
                    受け取り口までお越しください。
                </Text>
            </Flex>
            <Flex h="33px" boxShadow="lg" color="white">
                <Flex w="25%" h="full" bg="gray.500" alignItems="center" justifyContent="center">
                    <Heading fontSize="xl">調理中</Heading>
                </Flex>
                <Flex flex="1" h="full" bg="teal.600" alignItems="center" justifyContent="center">
                    <IconContext.Provider value={{size: '2rem'}}>
                        <BiDish/>
                    </IconContext.Provider>
                    <Heading fontSize="xl" ml="2">
                        呼出中
                    </Heading>
                </Flex>
            </Flex>
            <Grid mt="6" templateColumns="repeat(4, 1fr)" w="full" h="full">
                <GridItem rowSpan={1}>
                    <VStack alignItems="center">
                        {cookingOrders.map((order) => (
                            <CookingOrderCard key={order.OrderId} callNumber={order.TicketAddr}/>
                        ))}
                    </VStack>
                </GridItem>
                <GridItem rowSpan={3}>
                    <Flex flex="1" flexWrap="wrap">
                        {callingOrders.map((order) => (
                            <CallingOrderCard key={order.OrderId} callNumber={order.TicketAddr}/>
                        ))}
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
}
