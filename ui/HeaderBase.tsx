import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { IconContext } from 'react-icons';
import { MdOutlineArrowBackIos } from 'react-icons/md';

type Props = {
  name: string;
  children: React.ReactNode;
};

export function HeaderBase(props: Props) {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      h="80px"
      px="12px"
      bg="white"
      boxShadow="lg"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex alignItems="center">
        <Button as={Link} href="/" variant="link" color="gray.800" mr="12px">
          <IconContext.Provider value={{ size: '24px' }}>
            <MdOutlineArrowBackIos />
          </IconContext.Provider>
        </Button>
        <Text fontSize="3xl" fontWeight="semibold" color="gray.700">
          {props.name}
        </Text>
      </Flex>
      {props.children}
    </Flex>
  );
}
