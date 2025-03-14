import { CoffeeBrew as ProtoCoffeeBrew } from 'proto/scripts/pos/pos_service_pb';

export type CoffeeBrew = {
  id: string;
  name: string;
  beanQuantityGrams: number;
  amount: number;
};

export function toCoffeeBrewFromProto(coffeeBrew: ProtoCoffeeBrew): CoffeeBrew {
  return {
    id: coffeeBrew.id,
    name: coffeeBrew.name,
    beanQuantityGrams: coffeeBrew.beanQuantityGrams,
    amount: Number(coffeeBrew.amount),
  };
}

export type CoffeeBrews = CoffeeBrew[];
