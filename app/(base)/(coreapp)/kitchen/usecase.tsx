import { useMemo, useState } from 'react';

import { useOrderLink } from '@/jotai/orderlink';
import { useProduct } from '@/jotai/product';
import { FilterItem } from '@/usecase/Filter';
import { OrderItemStatusEnum, OrderItemStatusSchema } from '@/zod/order_items';

export type KitchenFilter = {
  items: FilterItem[];
};

export function useKitchen() {
  const { orders, UpdateOrderItemStatus } = useOrderLink();
  const { getDefaultFilterItems, getProductByProductId, getCoffeeBrew } = useProduct();
  const [kitchenFilter, setKitchenFilter] = useState({
    items: getDefaultFilterItems(),
  });

  const [isOpenFilterModal, setIsFilterModal] = useState(false);

  const onOpenFilterModal = () => {
    setIsFilterModal(true);
  };
  const onCloseFilterModal = () => {
    setIsFilterModal(false);
  };
  const onConfirmFilterModal = (items: FilterItem[]) => {
    setKitchenFilter({ items: items });
  };

  const filteredOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        OrderItems: order.OrderItems.filter((item) => {
          const product = getProductByProductId(item.ProductId);
          const coffeeBrew = item.CoffeeBrewId != null ? getCoffeeBrew(item.CoffeeBrewId) : null;

          return kitchenFilter.items.some((category) => {
            if (category.id !== product?.productCategory.id) return false;
            if (category.checked) return true;
            return category.children?.some((child) => {
              if (child.id !== product.productId) return false;
              if (child.checked) return true;
              return (
                child.children?.some((brew) => {
                  if (brew.id !== coffeeBrew?.id) return false;
                  return brew.checked;
                }) ?? false
              );
            });
          });
        }),
      })),
    [getCoffeeBrew, getProductByProductId, kitchenFilter.items, orders]
  );
  const filteredOrderItems = useMemo(() => filteredOrders.flatMap((order) => order.OrderItems), [filteredOrders]);
  const cookingItemsLen = useMemo(
    () => filteredOrderItems.filter((item) => item.Status === OrderItemStatusEnum.Cooking).length,
    [filteredOrderItems]
  );
  const notYetItemsLen = useMemo(
    () => filteredOrderItems.filter((item) => item.Status === OrderItemStatusEnum.NotYet).length,
    [filteredOrderItems]
  );
  const getOrderItem = (itemId: string) => {
    return filteredOrderItems.find((item) => item.Id === itemId);
  };

  const onCancelState = (itemId: string) => {
    const item = getOrderItem(itemId);
    if (item == null) {
      return;
    }
    const newStatus = OrderItemStatusSchema.parse(item.Status - 1);
    UpdateOrderItemStatus(itemId, newStatus);
  };
  const onNextState = (itemId: string) => {
    const item = getOrderItem(itemId);
    if (item == null) {
      return;
    }
    const result = OrderItemStatusSchema.safeParse(item.Status + 1);
    if (result.success) {
      UpdateOrderItemStatus(itemId, result.data);
    }
  };

  return {
    filteredOrders,
    cookingItemsLen,
    notYetItemsLen,
    onCancelState,
    onNextState,
    kitchenFilter,
    isOpenFilterModal,
    onOpenFilterModal,
    onCloseFilterModal,
    onConfirmFilterModal,
  };
}
