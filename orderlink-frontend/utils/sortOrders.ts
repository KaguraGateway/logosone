import { Order } from '@/zod/orders';
 
export function compareByTicketAddr(a: Order, b: Order): number {
  return a.TicketAddr.localeCompare(b.TicketAddr, undefined, { numeric: true });
}



//注文番号を昇順にソートする関数compareByTicketAddrを作成しました。遅れてしまい申し訳ありません。