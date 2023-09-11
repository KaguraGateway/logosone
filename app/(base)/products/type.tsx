export type CoffeeBrew = {
  name: string,
  amount: number,
  coffeeBeanQuantity: number,
};

export type Product = {
  name: string,
  amount: number,
  type: string,
  category: string,
  isNowSales: boolean,
  coffeeBrews?: Array<CoffeeBrew>
}