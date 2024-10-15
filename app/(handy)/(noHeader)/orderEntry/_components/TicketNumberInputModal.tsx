import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { useSeatQuery } from '@/query/getSeats';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onConfirm: (seatId: string) => void;
};

export default function TicketNumberInputModal(props: Props) {
  const [group, setGroup] = React.useState('テーブル');

  const seatQuery = useSeatQuery();
  const groupSeats = useMemo(() => {
    if (group === 'その他') {
      return (
        seatQuery.data?.seats.filter(
          (seat) => !seat.name.startsWith('テーブル') && !seat.name.startsWith('カウンター')
        ) ?? []
      );
    }
    return seatQuery.data?.seats.filter((seat) => seat.name.startsWith(group)) ?? [];
  }, [group, seatQuery.data?.seats]);

  const onConfirm = (seatId: string) => {
    props.onConfirm(seatId);
    props.onClose();
  };

  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>座席・伝票番号を入力</ModalHeader>
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
              <RadioGroup onChange={setGroup} value={group}>
                <Stack direction="row" width={'100%'}>
                  <Radio size={'lg'} defaultChecked={true} colorScheme="orange" fontSize={'2xl'} value="テーブル">
                    テーブル
                  </Radio>
                  <Radio size={'lg'} defaultChecked={false} colorScheme="orange" fontSize={'2xl'} value="カウンター">
                    カウンター
                  </Radio>
                  <Radio size={'lg'} defaultChecked={false} colorScheme="orange" fontSize={'2xl'} value="その他">
                    その他
                  </Radio>
                </Stack>
              </RadioGroup>
              <Spacer />
              <VStack flexWrap="wrap" spacing={4} align="stretch">
                {groupSeats.map((seat) => (
                  <Button
                    key={seat.id}
                    size={'lg'}
                    colorScheme="orange"
                    fontSize={'2xl'}
                    onClick={() => onConfirm(seat.id)}
                  >
                    {seat.name}
                  </Button>
                ))}
              </VStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
