import { FormControl, FormLabel, Switch as ChakraSwitch } from '@chakra-ui/react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch(props: Props) {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel mb="0">{props.label}</FormLabel>
      <ChakraSwitch isChecked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
    </FormControl>
  );
}
