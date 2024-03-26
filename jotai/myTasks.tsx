import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { MyTasks, MyTasksSchema } from '@/zod/my_tasks';
import { OrderItemId } from '@/zod/order_items';

const key = 'myTasks';
const myTasksStorage = createJSONStorage<MyTasks>(() => sessionStorage);
const myTasksAtom = atomWithStorage<MyTasks>(key, [], myTasksStorage);

export function useMyTasks() {
  const [myTasks, setMyTasks] = useAtom(myTasksAtom);

  const setMyTask = (orderItemId: OrderItemId) => {
    setMyTasks((prev) => {
      const newTasks = [...prev, orderItemId];
      return MyTasksSchema.safeParse(newTasks).success ? newTasks : prev;
    });
  };
  const isMyTask = (orderItemId: OrderItemId) => myTasks.includes(orderItemId);

  return { myTasks, isMyTask, setMyTask };
}
