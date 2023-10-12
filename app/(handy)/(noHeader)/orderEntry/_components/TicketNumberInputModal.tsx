import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onConfirm: (seat: string) => void;
};

export default function TicketNumberInputModal(props: Props) {
  const [group, setGroup] = React.useState('テーブル');
  const [value, setValue] = React.useState('');

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const onConfirm = () => {
    props.onConfirm(`${group}${value}`);
    props.onClose();
  };

  return (
    <>
      {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>座席・伝票番号を入力</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
              <RadioGroup onChange={setGroup} value={group}>
                <Stack direction="row" width={'100%'}>
                  <Radio size={'lg'} defaultChecked={true} colorScheme="teal" fontSize={'2xl'} value="テーブル">
                    テーブル
                  </Radio>
                  <Radio size={'lg'} defaultChecked={false} colorScheme="teal" fontSize={'2xl'} value="カウンター">
                    カウンター
                  </Radio>
                  <Radio size={'lg'} defaultChecked={false} colorScheme="teal" fontSize={'2xl'} value="その他">
                    その他
                  </Radio>
                </Stack>
              </RadioGroup>

              <Spacer />
              <Input size={'md'} bg={'white'} placeholder="1" value={value} onChange={onChangeValue} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="green" mr={3} onClick={onConfirm} width="100%">
              決定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
