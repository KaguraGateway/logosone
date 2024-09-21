import { Button, Center, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { IoPeople } from 'react-icons/io5';

export default function staffSelection() {
  return (
    <>
      <Flex flexDir="column" padding={1} width="100%" gap={4}>
        <Center>
          <Text fontSize="2xl" fontWeight="semibold" color="gray.600" p={4}>
            担当者選択
          </Text>
        </Center>
        <Button size="lg" colorScheme="teal" h="100px" leftIcon={<IoPeople />} as={Link} href="/waiter">
          ロゴスメンバー
        </Button>
        <Button
          size="lg"
          bg="white"
          color="gray.600"
          whiteSpace="unset"
          width="100%"
          paddingY={8}
          boxShadow="base"
          border="1px"
          borderColor="gray.300"
          h="100px"
          leftIcon={<IoPeople />}
          as={Link}
          href="/waiter"
        >
          トレーニングモード
          <br />
          （注文は送信されません）
        </Button>
      </Flex>
    </>
  );
}
