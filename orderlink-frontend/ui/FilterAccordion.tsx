import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Text,
} from '@chakra-ui/react';

import { FilterItem } from '@/usecase/Filter';

type Props = {
  tempFilter: FilterItem[];
  onParentCheckChange: (item: FilterItem, checked: boolean) => void;
  onChildCheckChange: (parent: FilterItem, item: FilterItem, checked: boolean) => void;
  onGrandChildCheckChange: (root: FilterItem, parent: FilterItem, item: FilterItem, checked: boolean) => void;
};

export function FilterAccordion({tempFilter, onChildCheckChange, onGrandChildCheckChange, onParentCheckChange}: Props) {
  return (
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
                  <Checkbox
                    size="lg"
                    fontSize="xl"
                    fontWeight="semibold"
                    isChecked={child.checked}
                    onChange={() => onChildCheckChange(item, child, !child.checked)}
                  >
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
  );
}
