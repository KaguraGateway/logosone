'use client';

import { Box, Button, Flex } from '@chakra-ui/react';
import { useRef } from 'react';

type Props = {
  targetName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteConfirmDialog(props: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!props.isOpen) return null;
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.4)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={props.onClose}
    >
      <Box
        bg="white"
        borderRadius="md"
        width="auto"
        minW="md"
        maxW="90%"
        maxH="90%"
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={4} fontWeight="bold" borderBottomWidth="1px">
          {props.targetName} を本当に削除しますか？
        </Box>
        <Box p={4}>
          削除すると元に戻すことはできません
        </Box>
        <Box p={4} borderTopWidth="1px">
          <Flex width="100%" gap={3}>
            <Button 
              ref={cancelRef} 
              variant="outline" 
              onClick={props.onClose}
              flex="1"
            >
              キャンセル
            </Button>
            <Button 
              colorScheme="red" 
              onClick={props.onDelete}
              flex="1"
            >
              削除
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
