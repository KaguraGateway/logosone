import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { IoClipboard } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";


export default function Waiter() {
    return (
        <Flex flexDir="column" gap="26px">
            <Button size="lg" colorScheme="teal" h="100px" leftIcon={<IoClipboard />}>
                注文入力
            </Button>
            <Button size="lg" colorScheme="gray" h="100px" leftIcon={<IoClipboard />} bg="gray.500" color="gray.50">
                配膳管理
                <br />
                (OrderLinkスタッフ)
            </Button>
            <Flex flexDir="column" gap="3">
                <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                    テーブル
                </Text>
                <Grid templateColumns='repeat(3, 1fr)' gap="17px">
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        1
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        2
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        3
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        4
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        5
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        6
                    </Button>
                </Grid>
                <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                    カウンター
                </Text>
                <Grid templateColumns='repeat(3, 1fr)' gap="17px">
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        1
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        2
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        3
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        4
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        5
                    </Button>
                    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl">
                        6
                    </Button>
                </Grid>
            </Flex>
            <Button size="lg" colorScheme="orange" leftIcon={<BiLogOut />} >
                ホールを終了する
            </Button>
        </Flex>

    );
}
