import { Category } from './Category';
import { CoffeeBean } from './CoffeeBean';
import { CoffeeBrew } from './CoffeeBrews';
import { Stock } from './Stock';

export type Product = {
  id: string;
  name: string;
  category: Category;
  type: string;
  isNowSales: boolean;
  // Coffee
  coffeeBean?: CoffeeBean;
  coffeeBrews?: CoffeeBrew[];
  // Other
  amount?: number;
  stock?: Stock;
};

export type ProductsResponse = {
  products: Product[];
};

export type ProductBody = {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  isNowSales: boolean;
  // Coffee
  coffeeBeanId?: string;
  coffeeBrews?: Array<CoffeeBrew>;
  // Other
  amount?: number;
  stockId?: string;
};

export type ProductPostRequest = Omit<ProductBody, 'id'>;
export type ProductPatchRequest = ProductBody;
