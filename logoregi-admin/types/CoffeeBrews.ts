import { CoffeeBrew as ProtoCoffeeBrew } from 'proto/scripts/pos/pos_service_pb';

export type CoffeeBrew = {
  id: string;
  name: string;
  beanQuantityGrams: number;
  amount: number;
  brewingTime: number;
};

export function toCoffeeBrewFromProto(coffeeBrew: ProtoCoffeeBrew): CoffeeBrew {
  return {
    id: coffeeBrew.id,
    name: coffeeBrew.name,
    beanQuantityGrams: coffeeBrew.beanQuantityGrams,
    amount: Number(coffeeBrew.amount),
    brewingTime: coffeeBrew.brewingTime,
  };
}

export type CoffeeBrews = CoffeeBrew[];
