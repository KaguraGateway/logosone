import { Flex } from "@chakra-ui/react";
import ProductInfoButton from "./ProductInfoButton";
import QuantitySelector from "./QuantitySelector";

type Props = {
    name: string;
    quantity: number;
    stock?: number;
    onQuantityChange: (newQuantity: number) => void;
    isDisabled?: boolean;
}

export default function ProductQuantityControl(props: Props) {
    const isDisabled = props.stock === 0;
    return (
        <>
        <Flex flexDir="column" gap={3}>
            {/* quantity周りの処理はGPTに聞いた適当なコードなので、適当に修正してください。不要なら消してOK。 */}
            <ProductInfoButton name={props.name} quantity={props.quantity} onClick={() => {}} stock={props.stock} isDisabled={isDisabled}/>
            { props.quantity <= 0 ? (
                <></>
            ) : (
                <QuantitySelector quantity={props.quantity} onQuantityChange={() => {props.onQuantityChange}} />
            )}
        </Flex>
        </>
    );
}