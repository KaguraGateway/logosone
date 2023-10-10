import { Button, Flex, Spacer } from '@chakra-ui/react';
import { DeleteIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';

type Props = {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
}

export default function QuantitySelector(props: Props) {
    const handleDeleteClick = () => {
        props.onQuantityChange(0);
    };

    const handleMinusClick = () => {
        if (props.quantity > 0) {
            props.onQuantityChange(props.quantity - 1);
        }
    };

    const handleAddClick = () => {
        props.onQuantityChange(props.quantity + 1);
    };

    return (
        <Flex flexDir="row" gap={3} m={2}>
            <Button size="lg" bg="red" color="white" onClick={handleDeleteClick}>
                <DeleteIcon />
            </Button>
            <Spacer />
            <Button size="lg" bg="gray" color="white" paddingX={10} onClick={handleMinusClick}>
                <MinusIcon />
            </Button>
            <Button size="lg" bg="gray" color="white" paddingX={10} onClick={handleAddClick}>
                <AddIcon />
            </Button>
        </Flex>
    );
}
