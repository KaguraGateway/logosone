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
    <Box>
      {tempFilter.map((item) => (
        <Box key={item.name} mb={4}>
          <Box mb={2}>
            {/* ヘッダー */}
            <Box bg="gray.100" p={2} borderY="1px" borderColor="gray.300">
              <Text fontSize="xl" fontWeight="semibold">
                {item.name}
              </Text>
            </Box>

            <Checkbox
              size="lg"
              fontSize="2xl"
              fontWeight="semibold"
              isChecked={item.checked}
              onChange={() => onParentCheckChange(item, !item.checked)}
              margin={3}
            >
              {item.name}すべて（{(item.children?.length || 0) + (item.children?.flatMap(child => child.children)?.length || 0)}）
            </Checkbox>
          </Box>
          <Box mt="2" px="4">
              {item.children?.map((child) => (
                <Box key={child.name} mb={2}>
                  {child.children && child.children.length > 0 ? (
                    <Text fontSize="xl" fontWeight="semibold">
                      {child.name}
                    </Text>
                  ) : (
                    <Checkbox
                      size="lg"
                      fontSize="xl"
                      fontWeight="semibold"
                      isChecked={child.checked}
                      onChange={() => onChildCheckChange(item, child, !child.checked)}
                      mr="4"
                    >
                      {child.name}
                    </Checkbox>
                  )}
                  <Flex justifyContent="flex-end">
                  {Array.isArray(child.children) && child.children.length > 0 && (
                  <Checkbox
                    size="lg"
                    fontSize="xl"
                    fontWeight="semibold"
                    isChecked={child.checked}
                    onChange={() => onChildCheckChange(item, child, !child.checked)}
                    mr="4"
                  >
                      すべて
                    </Checkbox>
                  )}
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
        </Box>
      ))}
    </Box>
  );
}
