import { ChangeEvent } from 'react';

import { css } from '@/panda/css';
import { Stack } from '@/panda/jsx';
import { input } from '@/panda/recipes';

type Props = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  root?: React.ComponentProps<typeof Stack>;
};

export function Input(props: Props) {
  return (
    <Stack {...props.root}>
      <label className={css({ color: 'gray.500' })}>{props.label}</label>
      <input className={input()} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
    </Stack>
  );
}
