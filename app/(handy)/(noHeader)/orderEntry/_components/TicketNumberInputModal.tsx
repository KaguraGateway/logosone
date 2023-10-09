import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, ModalFooter, Button, Radio, NumberInput, Input, Spacer, RadioGroup, Stack } from "@chakra-ui/react";
import ProductQuantityControl from "./ProductQuantityControl";
import React from "react";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
  }

export default function TicketNumberInputModal(props: Props) {
    const [value, setValue] = React.useState('1')
    return (
        <> 
        {/* モーダル */}
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100" >
          <ModalHeader>座席・伝票番号を入力</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* モーダル内のコンテンツ */}
            <Flex flexDir="column" gap={3}>
            
                <RadioGroup onChange={setValue} value={value}>
                    <Stack direction="row" width={"100%"}>
                        <Radio size={"lg"} defaultChecked={true} colorScheme="teal" fontSize={"2xl"} 
                        value="1"> 
                            テーブル
                        </Radio>
                        <Radio size={"lg"} defaultChecked={false} colorScheme="teal" fontSize={"2xl"} 
                        value="2"> 
                            カウンター
                        </Radio>
                        <Radio size={"lg"} defaultChecked={false} colorScheme="teal" fontSize={"2xl"} 
                        value="3"> 
                            その他
                        </Radio>
                    </Stack>
                </RadioGroup>
            
            <Spacer />
            <Input size={"md"} bg={"white"} placeholder='1'/>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* モーダル内での操作ボタン */}
            <Button colorScheme="green" mr={3} onClick={props.onClose} width="100%">
              決定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    );
}