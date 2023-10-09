import React from 'react';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import { DeleteIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';

export default function QuantitySelector() {
    return (
        <>
        <Flex flexDir="row" gap={3} m={2}>
                    <Button size="lg" bg="red" color="white">
                        <DeleteIcon />
                    </Button>
                    <Spacer />
                    <Button size="lg" bg="gray" color="white" paddingX={10}>
                        <MinusIcon />
                    </Button>
                    <Button size="lg" bg="gray" color="white" paddingX={10}>
                        <AddIcon />
                    </Button>
        </Flex>
        </>
    );
}