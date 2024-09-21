import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FaReact } from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';

import { FilterAccordion } from '@/ui/FilterAccordion';
import { FilterItem, useFilterItem } from '@/usecase/Filter';

import { KitchenFilter } from '../usecase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: FilterItem[]) => void;
  filter: KitchenFilter;
};

function isAllChecked(item: FilterItem): boolean {
  if (!item.children) {
    return item.checked;
  }
  return item.children.every((child) => isAllChecked(child));
}

export function FilterModal(props: Props) {
  const { tempFilter, allCheckChange, onChildCheckChange, onGrandChildCheckChange, onParentCheckChange } =
    useFilterItem(props.filter.items);

  const isAllFilterChecked = tempFilter.every((item) => isAllChecked(item));

  const onConfirm = () => {
    props.onConfirm(tempFilter);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>絞り込み</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Checkbox
            size="lg"
            fontSize="2xl"
            fontWeight="semibold"
            pb={4}
            onChange={() => allCheckChange(!isAllFilterChecked)}
            isChecked={isAllFilterChecked}
          >
            全件表示
          </Checkbox>
          <FilterAccordion
            tempFilter={tempFilter}
            onChildCheckChange={onChildCheckChange}
            onGrandChildCheckChange={onGrandChildCheckChange}
            onParentCheckChange={onParentCheckChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            leftIcon={<FaReact />}
            size="md"
            w="full"
            colorScheme="red"
            mr="3"
            onClick={() => allCheckChange(false)}
          >
            絞り込みクリア
          </Button>
          <Button leftIcon={<MdOutlineDone />} size="md" w="full" colorScheme="green" onClick={onConfirm}>
            確定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
