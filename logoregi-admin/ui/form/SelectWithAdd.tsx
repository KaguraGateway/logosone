'use client';

import {
  Box,
  Button,
  ListCollection, Separator, useDisclosure
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { ValueChangeDetails } from "@zag-js/select";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  items: ListCollection<Option>;
  onAdd: () => void;
  onChange: (details: Option | undefined) => void;
  selectedOption?: Option | null;
};

export function SelectWithAdd(props: Props) {
  const { open, onOpen, onClose } = useDisclosure()

  const onClickAdd = () => {
    onClose()
    props.onAdd()
  }

  const value = props.selectedOption != null ? [props.selectedOption?.value] : []
  const onValueChange = (details: ValueChangeDetails<Option>) => {
    props.onChange(props.items.items.find(v => details.value.includes(v.value)))
  }

  return (
    <SelectRoot collection={props.items} open={open} value={value} onValueChange={onValueChange} onOpenChange={(details) => details.open ? onOpen() : onClose()}>
      <SelectLabel>{props.label}</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder='選択してください' />
      </SelectTrigger>
      <SelectContent>
        {props.items.items.map((item) => (
          <SelectItem
            key={item.value}
            item={item}
          >
            {item.label}
          </SelectItem>
        ))}
        <Box>
          <Separator my={1} />
          <Button onClick={onClickAdd} variant='ghost' fontSize={14} width='full' justifyContent='flex-start'>
            <FaPlus />
            追加する
          </Button>
        </Box>
      </SelectContent>
    </SelectRoot>
  );
}
