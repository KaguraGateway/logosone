'use client';

import { Flex, Text } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch(props: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };

  return (
    <Flex display="flex" alignItems="center">
      <Text mb="0" mr={2}>{props.label}</Text>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={props.checked} 
          onChange={handleChange} 
        />
        <span className="slider round"></span>
      </label>
    </Flex>
  );
}
