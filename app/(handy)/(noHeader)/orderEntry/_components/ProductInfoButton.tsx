import { Button, Flex, Text, Spacer, Badge, VisuallyHidden, Hide } from "@chakra-ui/react";

type Props = {
    name: string;
    quantity: number;
}


export default function ProductInfoButton(props: Props) {
    return (
        <>
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
                justifyContent="flex-start" 
            >
                        <Flex flexDir="row" width="100%">
                            <Text overflowWrap="anywhere">{props.name}</Text>
                            <Spacer />
                            {props.quantity == 0 ? (
                                <Spacer />
                            ):(
                                <Badge colorScheme='green'>
                                    <Text fontSize="lg">{props.quantity}</Text>
                                </Badge>
                            ) }
                        </Flex>
                    </Button>
        </>
    );
}