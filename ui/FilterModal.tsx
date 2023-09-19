import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';

type FilterItem = {
  name: string;
  checked: boolean;
  children?: FilterItem[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const items: FilterItem[] = [
  {
    name: 'コーヒー',
    checked: false,
    children: [
      {
        name: 'ハルメリア',
        checked: false,
        children: [
          {
            name: 'ペーパー',
            checked: false,
          },
          {
            name: 'ネル',
            checked: false,
          },
          {
            name: 'サイフォン',
            checked: false,
          },
        ],
      },
      {
        name: 'クラシック',
        checked: false,
        children: [
          {
            name: 'ペーパー',
            checked: false,
          },
          {
            name: 'ネル',
            checked: false,
          },
          {
            name: 'サイフォン',
            checked: false,
          },
        ],
      },
      {
        name: 'ロゴスアイスブレンド',
        checked: false,
        children: [
          {
            name: 'ペーパー',
            checked: false,
          },
          {
            name: 'ネル',
            checked: false,
          },
          {
            name: 'サイフォン',
            checked: false,
          },
        ],
      },
    ],
  },
  {
    name: 'ソフトドリンク',
    checked: false,
    children: [
      {
        name: 'レモネード',
        checked: false,
      },
      {
        name: 'レモネードスカッシュ',
        checked: false,
      },
      {
        name: 'ヨーグルッペ',
        checked: false,
      },
    ],
  },
  {
    name: 'その他',
    checked: false,
    children: [
      {
        name: 'パン',
        checked: false,
      },
      {
        name: '饅頭',
        checked: false,
      },
    ],
  },
];

function checkFilterItem(item: FilterItem, checked: boolean) {
  item.checked = checked;
  item.children = item.children?.map((child) => checkFilterItem(child, checked));
  return item;
}

function isAllChecked(item: FilterItem): boolean {
  if (!item.children) {
    return item.checked;
  }
  return item.children.every((child) => isAllChecked(child));
}

export function FilterModal(props: Props) {
  const [tempFilter, setTempFilter] = useState<FilterItem[]>(items);

  const isAllFilterChecked = tempFilter.every((item) => isAllChecked(item));
  const onAllCheckChange = (checked: boolean) => {
    const newFilter = tempFilter.map((item) => checkFilterItem(item, checked));
    setTempFilter(newFilter);
  };
  const onParentCheckChange = (item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if (i.name === item.name) {
        return checkFilterItem(item, checked);
      }
      return i;
    });
    setTempFilter(newFilter);
  };
  const onChildCheckChange = (parent: FilterItem, item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if(parent.name === i.name) {
        const newChildren = i.children?.map((child) => {
          if (child.name === item.name) {
            return checkFilterItem(item, checked);
          }
          return child;
        });
        return {
          ...i,
          children: newChildren,
        };
      }
      return i;
    })
    setTempFilter(newFilter);
  }
  const onGrandChildCheckChange = (root: FilterItem, parent: FilterItem, item: FilterItem, checked: boolean): void => {
    const newFilter = tempFilter.map((i) => {
      if(root.name === i.name) {
        const newChildren = i.children?.map((child) => {
          if (child.name === parent.name) {
            const newGrandChildren = child.children?.map((grandChild) => {
              if (grandChild.name === item.name) {
                return checkFilterItem(item, checked);
              }
              return grandChild;
            });
            return {...child, children: newGrandChildren};
          }
          return child;
        });
        return {
          ...i,
          children: newChildren,
        };
      }
      return i;
    })
    setTempFilter(newFilter);
  }

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
            onChange={() => onAllCheckChange(!isAllFilterChecked)}
            isChecked={isAllFilterChecked}
          >
            全件表示
          </Checkbox>
          <Accordion allowMultiple defaultIndex={[0]}>
            {tempFilter.map((item) => (
              <AccordionItem key={item.name}>
                <AccordionButton>
                  <Text fontSize="2xl" fontWeight="semibold">
                    {item.name}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Checkbox
                    size="lg"
                    fontSize="2xl"
                    fontWeight="semibold"
                    isChecked={item.checked}
                    onChange={() => onParentCheckChange(item, !item.checked)}
                  >
                    {item.name}
                  </Checkbox>
                  <Box mt="2" px="4">
                    {item.children?.map((child) => (
                      <Box key={child.name}>
                        <Checkbox size="lg" fontSize="xl" fontWeight="semibold" isChecked={child.checked} onChange={() => onChildCheckChange(item, child, !child.checked)}>
                          {child.name}
                        </Checkbox>
                        <Flex justifyContent="flex-end">
                          {child.children?.map((grandChild) => (
                            <Checkbox
                              key={grandChild.name}
                              size="lg"
                              fontSize="xl"
                              fontWeight="semibold"
                              mr="4"
                              isChecked={grandChild.checked}
                              onChange={() => onGrandChildCheckChange(item, child, grandChild, !grandChild.checked)}
                            >
                              {grandChild.name}
                            </Checkbox>
                          ))}
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button
            leftIcon={<FaReact />}
            size="md"
            w="full"
            colorScheme="red"
            mr="3"
            onClick={() => onAllCheckChange(false)}
          >
            絞り込みクリア
          </Button>
          <Button leftIcon={<MdOutlineDone />} size="md" w="full" colorScheme="green">
            確定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
