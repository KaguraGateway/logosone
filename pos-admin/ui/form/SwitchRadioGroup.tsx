import { Radio, RadioControl, RadioGroup, RadioGroupLabel, RadioLabel } from '@ark-ui/react';

import { Box } from '@/panda/jsx';
import { switchRadioGroup } from '@/panda/recipes';

type Props = {
  label: string;
  value: string;
  defaultValue?: string;
  onChange?: (details: { value: string }) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
};

export function SwitchRadioGroup(props: Props) {
  return (
    <RadioGroup
      className={switchRadioGroup()}
      onChange={props.onChange}
      value={props.value}
      defaultValue={props.defaultValue}
    >
      <RadioGroupLabel>{props.label}</RadioGroupLabel>
      <Box display="inline-flex" w="max-content" background="gray.200" borderRadius="md" p="1" flexBasis={0}>
        {props.options.map((option) => (
          <Radio key={option.value} value={option.value}>
            <RadioLabel>{option.label}</RadioLabel>
            <RadioControl />
          </Radio>
        ))}
      </Box>
    </RadioGroup>
  );
}
