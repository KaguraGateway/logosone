import { useMemo, useState } from 'react';

import { useOrderLink } from '@/jotai/orderlink';
import { useProduct } from '@/jotai/product';
import { FilterItem } from '@/usecase/Filter';
import { OrderStatusEnum, OrderTypeEnum } from '@/zod/orders';

export type StaffFilter = {
  items: FilterItem[];
  isTakeout: boolean;
  isEatIn: boolean;
};

export function useStaff() {
  const { getProductByProductId, getDefaultFilterItems } = useProduct();
  const [staffFilter, setStaffFilter] = useState({
    items: getDefaultFilterItems(),
    isTakeout: true,
    isEatIn: true,
  });
  const { orders } = useOrderLink();
  const [isOpenFilterModal, setIsFilterModal] = useState(false);

  const onOpenFilterModal = () => {
    setIsFilterModal(true);
  };
  const onCloseFilterModal = () => {
    setIsFilterModal(false);
  };
  const onConfirmFilterModal = (items: FilterItem[], takeout: boolean, eatIn: boolean) => {
    setStaffFilter({
      items,
      isTakeout: takeout,
      isEatIn: eatIn,
    });
  };
  const onAllTakeoutOnly = () => {
    setStaffFilter({
      items: getDefaultFilterItems(),
      isTakeout: true,
      isEatIn: false,
    });
  }
  const onAllEatInOnly = () => {
    setStaffFilter({
      items: getDefaultFilterItems(),
      isTakeout: false,
      isEatIn: true,
    });
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (order.OrderType === OrderTypeEnum.TakeOut && !staffFilter.isTakeout) {
        return false;
      } else if (order.OrderType === OrderTypeEnum.EatIn && !staffFilter.isEatIn) {
        return false;
      }

      return order.OrderItems.some((item) => {
        const product = getProductByProductId(item.ProductId);
        return staffFilter.items.some((filterItem) => {
          if (product?.productCategory.id !== filterItem.id) return false;
          if (filterItem.checked) return true;
          return (
            filterItem.children?.some((child) => {
              if (product.productId !== child.id) return false;
              if (child.checked) return true;
              return child.children?.some((grandChild) => {
                if (item.CoffeeBrewId !== grandChild.id) return false;
                if (grandChild.checked) return true;
                return false;
              });
            }) ?? false
          );
        });
      });
    });
  }, [getProductByProductId, orders, staffFilter.isEatIn, staffFilter.isTakeout, staffFilter.items]);
  const cookedOrdersLen = useMemo(
    () =>
      filteredOrders.filter(
        (order) => order.Status === OrderStatusEnum.Cooked || order.Status === OrderStatusEnum.Calling
      ).length,
    [filteredOrders]
  );
  const cookingOrdersLen = useMemo(
    () => filteredOrders.filter((order) => order.Status === OrderStatusEnum.Cooking).length,
    [filteredOrders]
  );
  const notYetOrdersLen = useMemo(
    () => filteredOrders.filter((order) => order.Status === OrderStatusEnum.NotYet).length,
    [filteredOrders]
  );

  return {
    cookedOrdersLen,
    cookingOrdersLen,
    notYetOrdersLen,
    isOpenFilterModal,
    onOpenFilterModal,
    onCloseFilterModal,
    onConfirmFilterModal,
    onAllEatInOnly,
    onAllTakeoutOnly,
    filteredOrders,
    staffFilter,
  };
}
