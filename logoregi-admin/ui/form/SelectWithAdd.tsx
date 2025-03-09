'use client';

import { 
  Box, 
  Button, 
  Flex, 
  Stack,
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
    <Stack>
      <Text color="gray.500">{props.label}</Text>
      <Box position="relative">
        <Button 
          width="100%" 
          textAlign="left"
          onClick={() => {
            const dropdown = document.getElementById('dropdown-' + props.label);
            if (dropdown) {
              dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
          }}
        >
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Text>{props.selectedOption?.label ?? '選択してください'}</Text>
            <AiFillCaretDown />
          </Flex>
        </Button>
        <Box 
          id={'dropdown-' + props.label}
          position="absolute"
          top="100%"
          left={0}
          width="100%"
          zIndex={10}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          display="none"
        >
          <Stack>
            {props.items.map((item) => (
              <Button 
                key={item.value} 
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  onChange({ value: item.value, label: item.label });
                  const dropdown = document.getElementById('dropdown-' + props.label);
                  if (dropdown) dropdown.style.display = 'none';
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button 
              variant="ghost"
              justifyContent="flex-start"
              onClick={() => {
                onChange({ value: 'add', label: 'add' });
                const dropdown = document.getElementById('dropdown-' + props.label);
                if (dropdown) dropdown.style.display = 'none';
              }}
            >
              <Flex alignItems="center" gap={2}>
                <FaPlus />
                <Text>追加</Text>
              </Flex>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
