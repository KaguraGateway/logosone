'use client';
import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { FiCheckSquare, FiRepeat } from 'react-icons/fi';
import { IoReloadOutline } from 'react-icons/io5';

import { FilterModal } from '@/app/(base)/(coreapp)/kitchen/_components/FilterModal';
import { useMyTasks } from '@/jotai/myTasks';
import { useProduct } from '@/jotai/product';
import { ElapsedMinTime } from '@/ui/ElapsedMinTime';
import { HeaderBase } from '@/ui/HeaderBase';
import { MainBox } from '@/ui/MainBox';
import { isSomeChecked } from '@/usecase/Filter';
import { ToRomazi } from '@/utils/romazi';
import { OrderItemStatus, OrderItemStatusEnum } from '@/zod/order_items';
import { Order } from '@/zod/orders';

import { FilterText } from './_components/FilterText';
import { ItemInfoCard, ItemInfoCardProps } from './_components/ItemInfoCard';
import { KitchenFilter, useKitchen } from './usecase';

function fromItemStatus(itemStatus: OrderItemStatus): 'notyet' | 'cooking' | 'done' {
  switch (itemStatus) {
    case OrderItemStatusEnum.NotYet:
      return 'notyet';
    case OrderItemStatusEnum.Cooking:
      return 'cooking';
    case OrderItemStatusEnum.Cooked:
      return 'done';
  }
}
type FilteredItemsProps = {
  filteredOrders: Array<Order>;
  onCancelState?: (itemId: string) => void;
  onNextState?: (itemId: string) => void;
};
function FilteredItems({ filteredOrders, onCancelState, onNextState }: FilteredItemsProps) {
  const { getProductByProductId, getCoffeeBrew } = useProduct();
  const { isMyTask } = useMyTasks();

  const items: Array<ItemInfoCardProps> = filteredOrders
    .flatMap((order) =>
      order.OrderItems.map((item) => {
        const product = getProductByProductId(item.ProductId);
        const coffeeBrew = item.CoffeeBrewId != null ? getCoffeeBrew(item.CoffeeBrewId) : null;
        const prefix = coffeeBrew != null ? ToRomazi(coffeeBrew.name).toLocaleUpperCase()[0] : '';
        const isMyTaskFlag = isMyTask(item.Id);

        return {
          itemId: item.Id,
          callNumber: order.TicketAddr,
          productName: product?.productName || 'undefined',
          subTtitle: coffeeBrew?.name != null ? `（${coffeeBrew?.name}）` : '',
          prefix: prefix,
          productColor: product?.productColor ?? 'blue.500',
          waitingTime: <ElapsedMinTime dateISO={order.OrderAt} />,
          cookingStatus: fromItemStatus(item.Status),
          isMyTask: isMyTaskFlag,
          onCancelState: onCancelState,
          onNextState: onNextState,
        };
      })
    )
    .sort((a, b) => {
      if (
        (a.cookingStatus === 'notyet' && b.cookingStatus === 'cooking') ||
        (a.cookingStatus === 'cooking' && b.cookingStatus === 'done') ||
        (a.cookingStatus === 'notyet' && b.cookingStatus === 'done')
      ) {
        return 1;
      }
      if (
        (a.cookingStatus === 'cooking' && b.cookingStatus === 'notyet') ||
        (a.cookingStatus === 'done' && b.cookingStatus === 'cooking') ||
        (a.cookingStatus === 'done' && b.cookingStatus === 'notyet')
      ) {
        return -1;
      }
      return 0;
    });

  return items.map((item) => <ItemInfoCard key={item.itemId} {...item} />);
}

function FilterTexts({ kitchenFilter }: { kitchenFilter: KitchenFilter }) {
  return kitchenFilter.items.map((item) => {
    if (!item.checked) return null;

    return (
      <FilterText
        key={item.id}
        categoryName={item.name}
        texts={
          item.children
            ?.filter((v) => isSomeChecked(v))
            .map((child) => {
              if (child.children == null || child.children.length === 0) return child.name;
              return `${child.name} (${child.children
                .filter((v) => isSomeChecked(v))
                .map((brew) => brew.name)
                .join(',')})`;
            }) ?? []
        }
      />
    );
  });
}

export default function KitchenPage() {
  const {
    filteredOrders,
    notYetItemsLen,
    cookingItemsLen,
    onCancelState,
    onNextState,
    isOpenFilterModal,
    onOpenFilterModal,
    onCloseFilterModal,
    onConfirmFilterModal,
    kitchenFilter,
    isOnlyMyTasks,
    onToggleShowOnlyMyTasks,
  } = useKitchen();

  return (
    <>
      <HeaderBase name="キッチン">
        <HStack>
          <Button
            leftIcon={<IoReloadOutline />}
            color="white"
            size="lg"
            bg="red.500"
            onClick={() => {
              window.location.reload();
            }}
          >
            再読込
          </Button>
          <Button leftIcon={<FiCheckSquare />} color="white" size="lg" bg="blue.500" onClick={onOpenFilterModal}>
            絞り込み
          </Button>
          <Button leftIcon={<FiRepeat />} color="white" size="lg" bg="orange.500" onClick={onToggleShowOnlyMyTasks}>
            担当分表示{isOnlyMyTasks ? '中' : ''}
          </Button>
        </HStack>
      </HeaderBase>
      <MainBox>
        <FilterTexts kitchenFilter={kitchenFilter} />
        <Flex py="16px" alignItems="center" justifyContent="center">
          <Text fontSize="3xl" fontWeight="semibold" color="orange.700" mr="8">
            調理中: {cookingItemsLen}
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="gray.600">
            未調理: {notYetItemsLen}
          </Text>
        </Flex>
        <VStack>
          <FilteredItems filteredOrders={filteredOrders} onCancelState={onCancelState} onNextState={onNextState} />
        </VStack>
      </MainBox>
      <FilterModal
        isOpen={isOpenFilterModal}
        onClose={onCloseFilterModal}
        filter={kitchenFilter}
        onConfirm={onConfirmFilterModal}
      />
    </>
  );
}
