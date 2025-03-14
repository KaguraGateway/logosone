import { Discount as ProtoDiscount } from 'proto/scripts/pos/pos_service_pb';

export type Discount = {
  id: string;
  name: string;
  discountPrice: bigint;
};

export type DiscountBody = {
  name: string;
  discountPrice: bigint;
};

export function toDiscountFromProto(discount: ProtoDiscount): Discount {
  return {
    id: discount.id,
    name: discount.name,
    discountPrice: discount.discountPrice,
  };
}
