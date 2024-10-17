import { Flex } from '@chakra-ui/react';

import ProductInfoButton from './ProductInfoButton';
import QuantitySelector from './QuantitySelector';

type Props = {
  name: string;
  quantity: number;
  stock?: number;
  onQuantityChange?: (newQuantity: number) => void;
  onClick?: () => void;
  isDisabled?: boolean;
};

export default function ProductQuantityControl(props: Props) {
  const onClick = () => {
    props.onClick?.();
  };

  const isDisabled = props.stock === 0;
  return (
    <>
      <Flex flexDir="column" gap={3}>
        <ProductInfoButton
          name={props.name}
          quantity={props.quantity}
          onClick={onClick}
          stock={props.stock}
          isDisabled={isDisabled}
        />
        {props.quantity > 0 && (
          <QuantitySelector
            quantity={props.quantity}
            onQuantityChange={(newQuantity) => {
              props.onQuantityChange?.(newQuantity);
            }}
          />
        )}
      </Flex>
    </>
  );
}
