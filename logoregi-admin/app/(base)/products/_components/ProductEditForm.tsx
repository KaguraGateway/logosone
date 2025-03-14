'use client';

import {
  Box,
  Button as ChakraButton, createListCollection,
  HStack,
  Input as ChakraInput,
  Stack,
  VStack,
} from '@chakra-ui/react';
import {
  CoffeeBrewSchema,
  ProductParamSchema,
  ProductType,
} from 'proto/scripts/pos/pos_service_pb';
import { create } from '@bufbuild/protobuf';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';

import { useMutationAddProduct } from '@/query/addProduct';
import { useQueryCategories } from '@/query/getCategories';
import { useQueryCoffeeBeans } from '@/query/getCoffeeBeans';
import { useQueryStock } from '@/query/getStocks';
import { useMutationUpdateProduct } from '@/query/updateProduct';
import { Category } from '@/types/Category';
import { CoffeeBean } from '@/types/CoffeeBean';
import { CoffeeBrew } from '@/types/CoffeeBrews';
import { Product } from '@/types/Product';
import { Stock } from '@/types/Stock';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';
import { Option, SelectWithAdd } from '@/ui/form/SelectWithAdd';
import { Switch } from '@/ui/form/Switch';
import { SwitchRadioGroup } from '@/ui/form/SwitchRadioGroup';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Th } from '@/ui/table/Th';
import { Tr } from '@/ui/table/Tr';

import { StockFormDialog } from '../../_components/StockForm';
import { CoffeeBeanFormDialog } from './CoffeeBeanForm';
import { ProductCategoryFormDialog } from './ProductCategoryForm';

const ProductTypeOptions = [
  {
    label: 'コーヒー',
    value: 'coffee',
  },
  {
    label: 'その他',
    value: 'other',
  },
];

const ProductSalesOptions = [
  {
    label: '販売中',
    value: 'true',
  },
  {
    label: '非公開',
    value: 'false',
  },
];

type Props = {
  product?: Product;
  onCancel: () => void;
};

function toOptionFromCategory(category: Category) {
  return {
    label: category.name,
    value: category.id,
  };
}
function toOptionFromStock(stock: Stock) {
  return {
    label: stock.name,
    value: stock.id,
  };
}
function toOptionFromCoffeeBean(v: CoffeeBean) {
  return {
    label: v.name,
    value: v.id,
  };
}

export function ProductEditForm(props: Props) {
  // Product Input
  const [name, setName] = useState(props.product?.name ?? '');
  const [isNowOnSale, setIsNowOnSale] = useState(props.product?.isNowSales ?? true);
  const [type, setType] = useState(props.product?.type ?? 'coffee');
  const [category, setCategory] = useState<Option | undefined>(
    props.product != null
      ? toOptionFromCategory({ id: props.product.categoryId, name: props.product.categoryName })
      : undefined
  );
  const [isManagingOrder, setIsManagingOrder] = useState(props.product?.isManagingOrder ?? true);
  const [isOlUseKitchen, setIsOlUseKitchen] = useState(props.product?.isOlUseKitchen ?? true);

  // Coffee
  const [coffeeBean, setCoffeeBean] = useState<Option | undefined>(
    props.product?.coffeeBeanId != null
      ? toOptionFromCoffeeBean({
          id: props.product.coffeeBeanId,
          name: props.product.coffeeBeanName ?? '',
          gramQuantity: props.product.coffeeBeanGramQuantity ?? 0,
        })
      : undefined
  );
  const [brews, setBrews] = useState<Array<CoffeeBrew>>(props.product?.coffeeBrews ?? []);
  // Other
  const [amount, setAmount] = useState(props.product?.amount ?? 0);
  const [stock, setStock] = useState<Option | undefined>(
    props.product?.stockId != null && props.product.stockName != null && props.product.stockQuantity
      ? toOptionFromStock({
          id: props.product.stockId,
          name: props.product.stockName,
          quantity: props.product.stockQuantity,
        })
      : undefined
  );

  // Dialog
  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState(false);
  const [isOpenStockForm, setIsOpenStockForm] = useState(false);
  const [isOpenCoffeeBeanForm, setIsOpenCoffeeBeanForm] = useState(false);
  // Submit Loading
  const [isLoading, setIsLoading] = useState(false);

  // Query
  const categoryQuery = useQueryCategories();
  const categories = categoryQuery.data?.productCategories.map((v) => toOptionFromCategory(v)) ?? [];

  const stockQuery = useQueryStock();
  const stocks = stockQuery.data?.stocks.map((v) => toOptionFromStock(v)) ?? [];

  const coffeeBeansQuery = useQueryCoffeeBeans();
  const coffeeBeans = coffeeBeansQuery.data?.coffeeBeans.map((v) => toOptionFromCoffeeBean(v)) ?? [];

  const postMutation = useMutationAddProduct();
  const updateMutation = useMutationUpdateProduct();

  const router = useRouter();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeType = (value: string) => {
    setType(value);
  };
  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };
  const onAddCategory = () => {
    setIsOpenCategoryForm(true);
  };
  const onCloseCategoryForm = () => {
    setIsOpenCategoryForm(false);
  };
  const onAddStock = () => {
    setIsOpenStockForm(true);
  };
  const onAddCoffeeBean = () => {
    setIsOpenCoffeeBeanForm(true);
  };
  const onClickAddBrew = () => {
    setBrews([...brews, { id: '', name: '', amount: 0, beanQuantityGrams: 0 }]);
  };
  const onChangeBrew = (index: number, brew: CoffeeBrew) => {
    setBrews((prev) => {
      if (isNaN(brew.amount) || isNaN(brew.beanQuantityGrams)) return prev;
      prev[index] = brew;
      return [...prev];
    });
  };
  const onRemoveBrew = (index: number) => {
    setBrews((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (category == null) {
      return;
    }
    setIsLoading(true);
    const data = create(ProductParamSchema, {
      productName: name,
      isNowSales: isNowOnSale || false,
      productType: type === 'coffee' ? ProductType.COFFEE : ProductType.OTHER,
      productCategoryId: category.value,
      coffeeBeanId: coffeeBean?.value ?? '',
      coffeeBrews: brews.map((v) => {
        return create(CoffeeBrewSchema, {
          id: v.id,
          name: v.name,
          beanQuantityGrams: v.beanQuantityGrams,
          amount: BigInt(v.amount),
        });
      }),
      amount: BigInt(amount),
      stockId: stock?.value ?? '',
      isManagingOrder: isManagingOrder,
      isOlUseKitchen: isOlUseKitchen,
    });
    const onSuccess = () => {
      props.onCancel();
      router.refresh();
    };
    const onSettled = () => {
      setIsLoading(false);
    };
    if (props.product != null) {
      updateMutation.mutateAsync({ product: data, productId: props.product.id }, { onSuccess, onSettled });
    } else {
      postMutation.mutateAsync({ product: data }, { onSuccess, onSettled });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <HStack>
            <Input
              label="商品名"
              placeholder="コーヒ"
              onChange={onChangeName}
              value={name}
              root={{ width: '50%' }}
            />
            <SwitchRadioGroup
              label="販売中"
              defaultValue="true"
              onChange={() => setIsNowOnSale(!isNowOnSale)}
              value={`${isNowOnSale}`}
              options={ProductSalesOptions}
            />
          </HStack>
          <HStack>
            <SwitchRadioGroup
              label="商品種類"
              defaultValue="coffee"
              value={type}
              onChange={onChangeType}
              options={ProductTypeOptions}
            />
            <SelectWithAdd
              label="商品カテゴリ"
              items={createListCollection({items: categories})}
              onAdd={onAddCategory}
              selectedOption={category}
              onChange={(details) => setCategory(details)}
            />
          </HStack>
          {type === 'coffee' && (
            <>
              <SelectWithAdd
                label="豆の種類"
                items={createListCollection({items: coffeeBeans})}
                onAdd={onAddCoffeeBean}
                selectedOption={coffeeBean}
                onChange={(details) => setCoffeeBean(details)}
              />
              <Table>
                <TableHeader>
                  <Th>淹れ方</Th>
                  <Th>必要な豆の量</Th>
                  <Th>価格（円）</Th>
                  <Th grow="64px">削除</Th>
                </TableHeader>
                <Tbody>
                  {brews.map((brew, index) => (
                    <TCollectionItem key={index}>
                      <Tr>
                        <Td>
                          <ChakraInput
                            display="flex"
                            outline="0"
                            placeholder="ネル"
                            value={brew.name}
                            onChange={(event) =>
                              onChangeBrew(index, {
                                ...brew,
                                name: event.target.value,
                              })
                            }
                          />
                        </Td>
                        <Td>
                          <ChakraInput
                            display="flex"
                            outline="0"
                            placeholder="40"
                            value={brew.beanQuantityGrams}
                            onChange={(event) =>
                              onChangeBrew(index, {
                                ...brew,
                                beanQuantityGrams: Number(event.target.value),
                              })
                            }
                          />
                        </Td>
                        <Td>
                          <ChakraInput
                            display="flex"
                            outline="0"
                            placeholder="500"
                            value={brew.amount}
                            onChange={(event) =>
                              onChangeBrew(index, {
                                ...brew,
                                amount: Number(event.target.value),
                              })
                            }
                          />
                        </Td>
                        <Td grow="64px">
                          <ChakraButton
                            type="button"
                            color="red.500"
                            variant="ghost"
                            onClick={() => onRemoveBrew(index)}
                          >
                            <FaRegTrashCan />
                          </ChakraButton>
                        </Td>
                      </Tr>
                    </TCollectionItem>
                  ))}
                  <TCollectionItem>
                    <Tr>
                      <Td>
                        <ChakraButton
                          type="button"
                          onClick={onClickAddBrew}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color="gray.500"
                          variant="ghost"
                        >
                          <FaPlus />
                          <span>淹れ方を追加</span>
                        </ChakraButton>
                      </Td>
                    </Tr>
                  </TCollectionItem>
                </Tbody>
              </Table>
            </>
          )}
          {type === 'other' && (
            <HStack>
              <Input
                label="価格（円）"
                onChange={onChangeAmount}
                value={amount.toString()}
                root={{ width: '33.33%' }}
              />
              <SelectWithAdd
                label="在庫"
                items={createListCollection({items: stocks})}
                onAdd={onAddStock}
                selectedOption={stock}
                onChange={(details) => setStock(details)}
              />
            </HStack>
          )}
          <VStack alignItems="flex-start">
            <Switch
              label="OrderLinkでの注文管理を利用するか"
              onChange={(v) => setIsManagingOrder(v)}
              checked={isManagingOrder}
            />
            <Switch
              label="OrderLinkでのキッチン機能を利用するか"
              onChange={(v) => setIsOlUseKitchen(v)}
              checked={isOlUseKitchen}
            />
          </VStack>
          <HStack width='full'>
            <Button type="button" variant='outline' onClick={() => props.onCancel()}>
              キャンセル
            </Button>
            <LoadingButton type="submit" colorScheme="green" isLoading={isLoading}>
              作成
            </LoadingButton>
          </HStack>
        </Stack>
      </form>
      <ProductCategoryFormDialog isOpen={isOpenCategoryForm} onClose={onCloseCategoryForm} />
      <StockFormDialog isOpen={isOpenStockForm} onClose={() => setIsOpenStockForm(false)} />
      <CoffeeBeanFormDialog isOpen={isOpenCoffeeBeanForm} onClose={() => setIsOpenCoffeeBeanForm(false)} />
    </>
  );
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
};

export function ProductEditFormDialog(props: DialogProps) {
  if (!props.isOpen) return null;
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.4)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={props.onClose}
    >
      <Box
        bg="white"
        color='black'
        borderRadius="md"
        width="auto"
        minW="2xl"
        maxW="90%"
        maxH="90%"
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          商品を追加 / 編集
        </Box>
        <Box p={4}>
          <ProductEditForm product={props.product} onCancel={() => props.onClose()} />
        </Box>
      </Box>
    </Box>
  );
}
