'use client';

import { Box, Text } from '@chakra-ui/react';
import { SwitchRadioGroup } from '@/ui/form/SwitchRadioGroup';

type Props = {
  label: string;
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
};

export function SortDirection(props: Props) {
  return (
    <Box>
      <Text color="gray.500">{props.label}</Text>
      <SwitchRadioGroup
        label=""
        value={props.value}
        onChange={(value) => props.onChange(value as 'asc' | 'desc')}
        options={[
          { label: '昇順', value: 'asc' },
          { label: '降順', value: 'desc' },
        ]}
      />
    </Box>
  );
}
