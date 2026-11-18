'use client';

import { Flex, Text } from '@chakra-ui/react';
import{ useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';

const blink = keyframes`
  0% {opacity: 1; }
  50% {opacity: 0; }
  100% {opacity: 1; }
  `;

type Props = {
  callNumber: string;
};

export function CallingOrderCard(props: Props){
  const [highlight, setHighlight] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlight(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex
      w="277px"
      h="124px"
      bg="gray.50"
      border="4px"
      borderColor="teal.600"
      borderRadius="md"
      boxShadow="lg"
      alignItems="center"
      justifyContent="center"
      animation={highlight ? `${blink} 0.5s ease-in-out infinite` : 'none'}
    >
      <Text fontSize="6xl" fontWeight="bold" color="teal.600">
        {props.callNumber}
      </Text>
    </Flex>
  );
}
