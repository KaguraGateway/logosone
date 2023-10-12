import { useDisclosure } from '@chakra-ui/react';
import { CoffeeBrew, OrderType, Product, ProductType } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useClientId } from '@/jotai/clientId';
import { useErrorModal } from '@/jotai/errorModal';
import { useProductQuery } from '@/query/getProducts';
import { useSeatQuery } from '@/query/getSeats';
import { usePostOrderMutation } from '@/query/postOrder';

export type CategoryWithProducts = {
  id: string;
  name: string;
  products: Array<Product>;
};

export type Item = {
  productId: string;
  quantity: number;
  amount: number;
  coffeeBrewId?: string;
};

function rebuildMap<K, T>(map: Map<K, T>): Map<K, T> {
  return new Map(map.entries());
}

export function useOrderEntryUseCase() {
  const router = useRouter();
  const { onErrorModalOpen } = useErrorModal();
  const clientId = useClientId();
  const [currentSeatId, setCurrentSeatId] = useState('');
  const [currentSeatName, setCurrentSeatName] = useState('');
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [state, setState] = useState(0);
  const [isOrderSending, setIsOrderSending] = useState(false);

  const {
    isOpen: isOpenChooseOptionModal,
    onOpen: onOpenChooseOptionModal,
    onClose: onCloseChooseOptionModal,
  } = useDisclosure();
  const {
    isOpen: isOpenTicketNumberInputModal,
    onOpen: onOpenTicketNumberInputModal,
    onClose: onCloseTicketNumberInputModal,
  } = useDisclosure({
    defaultIsOpen: true, // この行を追加して初期値をtrueに設定
  });

  const seatQuery = useSeatQuery();
  const productQuery = useProductQuery();
  const orderMutate = usePostOrderMutation();

  const categories = useMemo(() => {
    if (productQuery.data == null) {
      return [];
    }
    const categoriesMap: Map<string, CategoryWithProducts> = new Map();
    for (const product of productQuery.data.products) {
      const category = product.productCategory!;
      if (!categoriesMap.has(category.id)) {
        categoriesMap.set(category.id, {
          id: category.id,
          name: category.name,
          products: [],
        });
      }

      categoriesMap.get(category.id)?.products.push(product);
    }
    return Array.from(categoriesMap.values());
  }, [productQuery.data]);
  const orderItems = useMemo(() => Array.from(items.values()), [items]);

  const onConfirmSeatName = (newSeatName: string) => {
    const seat = seatQuery.data?.seats.find((seat) => seat.name === newSeatName);
    if (seat == null) {
      onErrorModalOpen('存在しない番号', `${newSeatName} は存在しません`);
      onOpenTicketNumberInputModal();
      return;
    }
    setCurrentSeatId(seat.id);
    setCurrentSeatName(seat.name);
  };

  const onAddItem = (product: Product, coffeeBrew?: CoffeeBrew) => {
    console.log('onAdd');
    let key = product.productId;
    if (product.productType === ProductType.COFFEE) {
      key = `${product.productId}${coffeeBrew?.id}`;
    }

    if (items.has(key)) {
      items.get(key)!.quantity += 1;
      setItems(rebuildMap(items));
      return;
    }

    setItems((prev) => {
      return rebuildMap(
        prev.set(key, {
          productId: product.productId,
          quantity: 1,
          amount: Number(product.productType === ProductType.COFFEE ? coffeeBrew!.amount : product.amount),
          coffeeBrewId: coffeeBrew?.id,
        })
      );
    });
  };
  const onChangeQuantity = (product: Product, newQuantity: number, coffeeBrew?: CoffeeBrew) => {
    let key = product.productId;
    if (product.productType === ProductType.COFFEE) {
      key = `${product.productId}${coffeeBrew?.id}`;
    }
    if (items.has(key)) {
      setItems((prev) => {
        prev.get(key)!.quantity = newQuantity;
        return rebuildMap(prev);
      });
    }
  };
  const getQuantity = (product: Product, coffeeBrew?: CoffeeBrew) => {
    if (product.productType === ProductType.COFFEE && coffeeBrew == null) {
      return Array.from(items!.values())
        .filter((v) => v.productId === product.productId)
        .reduce((prev, item) => prev + item.quantity, 0);
    }

    let key = product.productId;
    if (product.productType === ProductType.COFFEE && coffeeBrew != null) {
      key = `${product.productId}${coffeeBrew?.id}`;
    }
    return items.get(key)?.quantity;
  };
  const getProductInfo = (productId: string, coffeeBrewId?: string) => {
    const product = productQuery.data?.products.find((v) => v.productId === productId);
    const coffeeBrew = coffeeBrewId != null ? product?.coffeeBrews.find((v) => v.id === coffeeBrewId) : undefined;
    return { product, coffeeBrew };
  };
  const backToOrderEntry = () => {
    setState(0);
  };
  const toOrderCheck = () => {
    setState(1);
  };
  const onPostOrder = () => {
    orderMutate.mutateAsync(
      {
        order: {
          items: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            amount: BigInt(item.amount),
            coffeeBrewId: item.coffeeBrewId,
          })),
          orderType: OrderType.EatIn,
          orderAt: new Date().toISOString(),
          clientId: clientId,
          seatId: currentSeatId,
        },
      },
      {
        onSuccess: () => {
          router.push('/waiter?isSendSuccess=true');
        },
        onSettled: () => {
          setIsOrderSending(false);
        },
        onError: (error) => {
          onErrorModalOpen('注文送信エラー', error.message);
        },
      }
    );
  };

  return {
    currentSeatId,
    currentSeatName,
    onConfirmSeatName,
    isOpenChooseOptionModal,
    onOpenChooseOptionModal,
    onCloseChooseOptionModal,
    isOpenTicketNumberInputModal,
    onOpenTicketNumberInputModal,
    onCloseTicketNumberInputModal,
    categories,
    onAddItem,
    onChangeQuantity,
    getQuantity,
    state,
    backToOrderEntry,
    toOrderCheck,
    onPostOrder,
    orderItems,
    getProductInfo,
    isOrderSending,
  };
}
