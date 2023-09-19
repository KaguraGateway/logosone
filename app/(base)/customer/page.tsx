'use client';

import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { IconContext } from 'react-icons';
import { BiDish } from 'react-icons/bi';

import Logo from '@/svg/logo_unit.svg';
import LogosLogo from '@/svg/logos_logo.svg';
import PoweredBy from '@/svg/powered_by.svg';

export default function CustomerPage() {
  return (
    <Box maxW="100vw" maxH="100vh" overflow="hidden">
      <Flex h="80px" px="12px" bg="white" alignItems="center" justifyContent="flex-end">
        <Box position="absolute" left="50%" transform="translateX(-50%)">
          <LogosLogo />
        </Box>
        <Link href="/">
          <Flex h="full" alignItems="center" justifyContent="flex-end">
            <Logo />
            <PoweredBy />
          </Flex>
        </Link>
      </Flex>
      <Flex h="80px" boxShadow="lg" color="white">
        <Flex w="25%" h="full" bg="gray.500" alignItems="center" justifyContent="center">
          <Heading fontSize="4xl">調理中</Heading>
        </Flex>
        <Flex flex="1" h="full" bg="teal.500" alignItems="center" justifyContent="center">
          <IconContext.Provider value={{ size: '2.5rem' }}>
            <BiDish />
          </IconContext.Provider>
          <Heading fontSize="4xl" ml="2">
            呼出中
          </Heading>
        </Flex>
      </Flex>
      <Flex mt="6">
        <VStack w="25%" alignItems="center">
          <Flex
            bg="gray.50"
            w="177px"
            h="62px"
            borderRadius="md"
            boxShadow="lg"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="5xl" fontWeight="bold" color="gray.600">
              L-103
            </Text>
          </Flex>
        </VStack>
        <Flex flex="1">
          <Flex
            w="277px"
            h="124px"
            bg="gray.50"
            border="4px"
            borderColor="teal.600"
            borderRadius="md"
            boxShadow="lg"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="6xl" fontWeight="bold" color="teal.600">
              L-102
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
