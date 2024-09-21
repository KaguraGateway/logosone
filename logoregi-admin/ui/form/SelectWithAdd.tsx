import {
  Portal,
  Select,
  SelectContent,
  SelectLabel,
  SelectOption,
  SelectPositioner,
  SelectTrigger,
} from '@ark-ui/react';
import { AiFillCaretDown } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

import { css } from '@/panda/css';
import { Box } from '@/panda/jsx';
import { select } from '@/panda/recipes';

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
    <Box>
      <Select onChange={onChange} selectedOption={props.selectedOption}>
        {({ selectedOption }) => (
          <>
            <SelectLabel className={select()}>{props.label}</SelectLabel>
            <SelectTrigger className={select()}>
              <span>{selectedOption?.label ?? '選択してください'}</span>
              <AiFillCaretDown />
            </SelectTrigger>
            <Portal>
              <SelectPositioner className={select()}>
                <SelectContent>
                  {props.items.map((item) => (
                    <SelectOption
                      key={item.value}
                      value={item.value}
                      label={item.label}
                      className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
                    >
                      {item.label}
                    </SelectOption>
                  ))}
                  <SelectOption
                    value="add"
                    label="add"
                    className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
                  >
                    <FaPlus />
                    <span>追加</span>
                  </SelectOption>
                </SelectContent>
              </SelectPositioner>
            </Portal>
          </>
        )}
      </Select>
    </Box>
  );
}
