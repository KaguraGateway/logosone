export type CoffeeBean = {
  id: string;
  name: string;
  quantity: number;
};

export type CoffeeBeanResponse = {
  coffeeBeans: CoffeeBean[];
};

export type CoffeeBeanRequest = Omit<CoffeeBean, 'id'>;
