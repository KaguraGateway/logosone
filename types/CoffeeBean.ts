export type CoffeeBean = {
  id: string;
  name: string;
  gramQuantity: number;
};

export type CoffeeBeanResponse = {
  coffeeBeans: CoffeeBean[];
};

export type CoffeeBeanRequest = Omit<CoffeeBean, 'id'>;
