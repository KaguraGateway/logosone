'use client';

import { 
  Box, 
  Button, 
  Flex, 
  FormControl, 
  FormLabel, 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuList, 
  Text 
} from '@chakra-ui/react';
import { AiFillCaretDown } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

export type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  items: Array<Option>;
  onAdd: () => void;
  onChange: (details: Option | null) => void;
  selectedOption?: Option | null;
};

export function SelectWithAdd(props: Props) {
  const onChange = (details: Option | null) => {
    if (details?.value === 'add') {
      props.onAdd();
    } else {
      props.onChange(details);
    }
  };

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Menu>
        <MenuButton as={Button} rightIcon={<AiFillCaretDown />} width="100%" textAlign="left">
          {props.selectedOption?.label ?? '選択してください'}
        </MenuButton>
        <MenuList>
          {props.items.map((item) => (
            <MenuItem 
              key={item.value} 
              onClick={() => onChange({ value: item.value, label: item.label })}
            >
              {item.label}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => onChange({ value: 'add', label: 'add' })}
          >
            <Flex alignItems="center" gap={2}>
              <FaPlus />
              <Text>追加</Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </FormControl>
  );
}
