import {
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FaReact } from 'react-icons/fa';
import { FiCoffee } from 'react-icons/fi';
import { MdOutlineDone } from 'react-icons/md';

import { FilterAccordion } from '@/ui/FilterAccordion';
import { IconCheckbox } from '@/ui/IconCheckbox';
import { FilterItem, useFilterItem } from '@/usecase/Filter';

import { StaffFilter } from '../use';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: FilterItem[], takeout: boolean, eatIn: boolean) => void;
  filter: StaffFilter;
};

function isAllChecked(item: FilterItem): boolean {
  if (!item.children || item.children.length === 0) {
    return item.checked;
  }
  return item.children.every((child) => isAllChecked(child));
}

export function FilterModal(props: Props) {
  const [orderTypeFilter, setOrderTypeFilter] = useState([props.filter.isTakeout, props.filter.isEatIn]); // takeout, eat-in
  const { tempFilter, allCheckChange, onChildCheckChange, onGrandChildCheckChange, onParentCheckChange } =
    useFilterItem(props.filter.items);
  const isAllFilterChecked = orderTypeFilter.every((v) => v) && tempFilter.every((item) => isAllChecked(item));

  const onAllCheck = (is: boolean) => {
    setOrderTypeFilter([is, is]);
    allCheckChange(is);
  };
  const onConfirm = () => {
    props.onConfirm(tempFilter, orderTypeFilter[0], orderTypeFilter[1]);
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
            onChange={() => onAllCheck(!isAllFilterChecked)}
            isChecked={isAllFilterChecked}
          >
            全件表示
          </Checkbox>
          <Flex px="88px" justifyContent="space-around">
            <IconCheckbox
              size="lg"
              fontSize="2xl"
              fontWeight="semibold"
              color="orange.500"
              pb={4}
              leftIcon={<BiCoffeeTogo />}
              isChecked={orderTypeFilter[0]}
              onChange={() => setOrderTypeFilter([!orderTypeFilter[0], orderTypeFilter[1]])}
            >
              テイクアウト
            </IconCheckbox>
            <IconCheckbox
              size="lg"
              fontSize="2xl"
              fontWeight="semibold"
              color="teal.500"
              pb={4}
              leftIcon={<FiCoffee />}
              isChecked={orderTypeFilter[1]}
              onChange={() => setOrderTypeFilter([orderTypeFilter[0], !orderTypeFilter[1]])}
            >
              イートイン
            </IconCheckbox>
          </Flex>
          <FilterAccordion
            tempFilter={tempFilter}
            onChildCheckChange={onChildCheckChange}
            onGrandChildCheckChange={onGrandChildCheckChange}
            onParentCheckChange={onParentCheckChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button leftIcon={<FaReact />} size="md" w="full" colorScheme="red" mr="3" onClick={() => onAllCheck(false)}>
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
