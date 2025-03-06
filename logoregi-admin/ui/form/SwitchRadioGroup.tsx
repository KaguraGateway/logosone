import { Box, Flex, FormLabel, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

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
      <FormLabel>{props.label}</FormLabel>
      <RadioGroup 
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      >
        <Flex 
          display="inline-flex" 
          width="max-content" 
          bg="gray.200" 
          borderRadius="md" 
          p={1}
        >
          <Stack direction="row" spacing={0}>
            {props.options.map((option) => (
              <Radio 
                key={option.value} 
                value={option.value}
                sx={{
                  '.chakra-radio__control': {
                    display: 'none',
                  }
                }}
              >
                <Box px={3} py={1} borderRadius="sm" _checked={{ bg: 'white' }}>
                  {option.label}
                </Box>
              </Radio>
            ))}
          </Stack>
        </Flex>
      </RadioGroup>
    </Box>
  );
}
