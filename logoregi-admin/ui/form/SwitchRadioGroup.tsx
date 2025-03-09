'use client';

import { Box, Flex, Stack, Text } from '@chakra-ui/react';

type Props = {
  label: string;
  value: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
};

export function SwitchRadioGroup(props: Props) {
  return (
    <Box>
      <Text color="gray.500">{props.label}</Text>
      <Box>
        <Flex 
          display="inline-flex" 
          width="max-content" 
          bg="gray.200" 
          borderRadius="md" 
          p={1}
        >
          <Flex direction="row" gap={0}>
            {props.options.map((option) => (
              <Box 
                key={option.value} 
                as="label"
                position="relative"
              >
                <input
                  type="radio"
                  name="switchRadio"
                  value={option.value}
                  checked={props.value === option.value}
                  onChange={(e) => props.onChange?.(e.target.value)}
                  style={{ position: 'absolute', opacity: 0 }}
                />
                <Box 
                  px={3} 
                  py={1} 
                  borderRadius="sm" 
                  bg={props.value === option.value ? 'white' : 'transparent'}
                  cursor="pointer"
                >
                  {option.label}
                </Box>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
