export type Stock = {
  id: string;
  name: string;
  quantity: number;
};
export type StockResponse = {
  stocks: Stock[];
};
export type StockRequest = Omit<Stock, 'id'>;
