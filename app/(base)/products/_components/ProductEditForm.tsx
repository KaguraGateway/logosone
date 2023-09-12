'use client';
import { Dialog, DialogBackdrop, DialogContainer, DialogContent, DialogTitle, Portal } from '@ark-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';

import { css } from '@/panda/css';
import { styled } from '@/panda/jsx';
import { HStack, Stack } from '@/panda/jsx';
import { dialog } from '@/panda/recipes';
import { useMutationAddProduct } from '@/query/addProduct';
import { useQueryCategories } from '@/query/getCategories';
import { useQueryCoffeeBeans } from '@/query/getCoffeeBeans';
import { useQueryStock } from '@/query/getStocks';
import { useMutationUpdateProduct } from '@/query/updateProduct';
import { Category } from '@/types/Category';
import { CoffeeBean } from '@/types/CoffeeBean';
import { CoffeeBrew } from '@/types/CoffeeBrews';
import { Product, ProductBody } from '@/types/Product';
import { Stock } from '@/types/Stock';
import { Button } from '@/ui/form/Button';
import { Input } from '@/ui/form/Input';
import { LoadingButton } from '@/ui/form/LoadingButton';
import { Option, SelectWithAdd } from '@/ui/form/SelectWithAdd';
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
  const [category, setCategory] = useState<Option | null>(
    props.product != null ? toOptionFromCategory(props.product.category) : null
  );

  // Coffee
  const [coffeeBean, setCoffeeBean] = useState<Option | null>(
    props.product?.coffeeBean != null ? toOptionFromCoffeeBean(props.product.coffeeBean) : null
  );
  const [brews, setBrews] = useState<Array<CoffeeBrew>>(props.product?.coffeeBrews ?? []);
  // Other
  const [amount, setAmount] = useState(props.product?.amount ?? 0);
  const [stock, setStock] = useState<Option | null>(
    props.product?.stock != null ? toOptionFromStock(props.product.stock) : null
  );

  // Dialog
  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState(false);
  const [isOpenStockForm, setIsOpenStockForm] = useState(false);
  const [isOpenCoffeeBeanForm, setIsOpenCoffeeBeanForm] = useState(false);
  // Submit Loading
  const [isLoading, setIsLoading] = useState(false);

  // Query
  const categoryQuery = useQueryCategories();
  const categories = categoryQuery.data?.categories.map((v) => toOptionFromCategory(v)) ?? [];

  const stockQuery = useQueryStock();
  const stocks = stockQuery.data?.stocks.map((v) => toOptionFromStock(v)) ?? [];

  const coffeeBeansQuery = useQueryCoffeeBeans();
  const coffeeBeans = coffeeBeansQuery.data?.coffeeBeans.map((v) => toOptionFromCoffeeBean(v)) ?? [];

  const postMutation = useMutationAddProduct();
  const updateMutation = useMutationUpdateProduct();

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeType = (details: { value: string }) => {
    setType(details.value);
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
    const data: Omit<ProductBody, 'id'> = {
      name,
      isNowSales: isNowOnSale,
      type,
      categoryId: category.value,
      coffeeBeanId: coffeeBean?.value,
      coffeeBrews: brews,
      amount: amount,
      stockId: stock?.value,
    };
    if (props.product != null) {
      updateMutation.mutate({ ...data, id: props.product.id });
    } else {
      postMutation.mutate(data);
    }
    setIsLoading(false);
    props.onCancel();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack gap="6">
          <HStack>
            <Input
              label="商品名"
              placeholder="コーヒ"
              onChange={onChangeName}
              value={name}
              root={{ className: css({ w: '1/2' }) }}
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
              items={categories}
              onAdd={onAddCategory}
              selectedOption={category}
              onChange={(details) => setCategory(details)}
            />
          </HStack>
          {type === 'coffee' && (
            <>
              <SelectWithAdd
                label="豆の種類"
                items={coffeeBeans}
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
                          <styled.input
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
                          <styled.input
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
                          <styled.input
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
                          <button
                            type="button"
                            className={css({ color: 'read.500' })}
                            onClick={() => onRemoveBrew(index)}
                          >
                            <FaRegTrashCan />
                          </button>
                        </Td>
                      </Tr>
                    </TCollectionItem>
                  ))}
                  <TCollectionItem>
                    <Tr>
                      <Td>
                        <styled.button
                          type="button"
                          onClick={onClickAddBrew}
                          display="flex"
                          alignItems="center"
                          gap="2"
                          color="gray.500"
                        >
                          <FaPlus />
                          <span>淹れ方を追加</span>
                        </styled.button>
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
                root={{ className: css({ w: '1/3' }) }}
              />
              <SelectWithAdd
                label="在庫"
                items={stocks}
                onAdd={onAddStock}
                selectedOption={stock}
                onChange={(details) => setStock(details)}
              />
            </HStack>
          )}
          <HStack width="full">
            <Button type="button" width="full" onClick={() => props.onCancel()}>
              キャンセル
            </Button>
            <LoadingButton type="submit" width="full" variant="success" isLoading={isLoading}>
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
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Portal>
        <DialogBackdrop className={dialog()} />
        <DialogContainer className={dialog()}>
          <DialogContent className={css({ minW: '2xl' })}>
            <Stack gap="4" p="4">
              <DialogTitle>商品を追加 / 編集</DialogTitle>
              <ProductEditForm product={props.product} onCancel={() => props.onClose()} />
            </Stack>
          </DialogContent>
        </DialogContainer>
      </Portal>
    </Dialog>
  );
}
