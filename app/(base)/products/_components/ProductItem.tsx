'use client';
import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaInternetExplorer, FaRegEyeSlash, FaRegTrashAlt } from "react-icons/fa";

import { css } from "@/panda/css";
import { Box, Flex } from "@/panda/jsx";
import { DeleteConfirmDialog } from "@/ui/dialog/DeleteConfirmDialog";
import { TCollectionItem } from "@/ui/table/TCollectionItem";
import { Td } from "@/ui/table/Td";
import { Tr } from "@/ui/table/Tr";

import { Product } from "../type";
import { CoffeeBrewsTable } from "./CoffeeBrewsTable";

export function ProductItem({ product }: { product: Product }) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const onCloseDelete = () => setIsOpenDelete(false);
  const onDelete = () => {
    setIsOpenDelete(false);
  }

  return (
    <TCollectionItem>
      <Tr>
        <Td>{product.name}</Td>
        <Td>{product.amount != 0 ? product.amount.toLocaleString('ja-JP', { style: "currency", currency: "JPY" }) : "N/A"}</Td>
        <Td>{product.type}</Td>
        <Td>{product.category}</Td>
        <Td className={css({ color: product.isNowSales ? "green.600" : undefined })}>{product.isNowSales ? (<><FaInternetExplorer /><span>公開</span></>) : <><FaRegEyeSlash /><span>非表示</span></>}</Td>
        <Td></Td>
        <Td>
          <Flex gap="2">
            <button><AiOutlineEdit /></button>
            <span>/</span>
            <button className={css({ color: "red.500" })} onClick={() => setIsOpenDelete(true)}><FaRegTrashAlt /></button>
          </Flex>
        </Td>
      </Tr>
      {
        product.coffeeBrews && (
          <Box pt="2">
            <CoffeeBrewsTable coffeeBrews={product.coffeeBrews} />
          </Box>
        )
      }
      <DeleteConfirmDialog targetName={product.name} isOpen={isOpenDelete} onDelete={onDelete} onClose={onCloseDelete} />
    </TCollectionItem>
  )
}