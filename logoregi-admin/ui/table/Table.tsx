import { Table as ChakraTable, TableContainer, TableProps } from '@chakra-ui/react';

export function Table(props: TableProps) {
  return (
    <TableContainer>
      <ChakraTable {...props} />
    </TableContainer>
  );
}
