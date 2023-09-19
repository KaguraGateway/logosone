import { Box, Flex, Text } from '@chakra-ui/react';

type Props = {
  categoryName: string;
  texts: string[];
};

export function FilterText(props: Props) {
  return (
    <Flex>
      <Box mr="80px">
        <Text fontSize="xl" fontWeight="semibold" color="yellow.600">
          {props.categoryName}
        </Text>
      </Box>
      <Box>
        {props.texts.map((text) => (
          <Text key={text} fontSize="xl" fontWeight="semibold" color="gray.500">
            {text}
          </Text>
        ))}
      </Box>
    </Flex>
  );
}
