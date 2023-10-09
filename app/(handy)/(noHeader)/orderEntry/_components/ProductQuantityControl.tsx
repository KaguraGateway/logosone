import { Flex } from "@chakra-ui/react";
import ProductInfoButton from "./ProductInfoButton";
import QuantitySelector from "./QuantitySelector";

type Props = {
    name: string;
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
}

export default function ProductQuantityControl(props: Props) {
    return (
        <>
        <Flex flexDir="column" gap={3}>
            {/* quantity周りの処理はGPTに聞いた適当なコードなので、適当に修正してください。不要なら消してOK。 */}
            <ProductInfoButton name={props.name} quantity={props.quantity} />
            { props.quantity <= 0 ? (
                <></>
            ) : (
                <QuantitySelector quantity={props.quantity} onQuantityChange={() => {props.onQuantityChange}} />
            )}
        </Flex>
        </>
    );
}