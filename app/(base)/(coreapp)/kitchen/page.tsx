'use client';
import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { FiCheckSquare } from 'react-icons/fi';
import { IoReloadOutline } from 'react-icons/io5';

import { FilterModal } from '@/ui/FilterModal';
import { HeaderBase } from '@/ui/HeaderBase';
import { MainBox } from '@/ui/MainBox';

import { FilterText } from './_components/FilterText';
import { ItemInfoCard } from './_components/ItemInfoCard';

export default function KitchenPage() {
  return (
    <>
      <HeaderBase name="キッチン">
        <Flex>
          <Button
            leftIcon={<IoReloadOutline />}
            color="white"
            size="lg"
            bg="red.500"
            mr="8px"
            onClick={() => {
              window.location.reload();
            }}
          >
            再読み込み
          </Button>
          <Button leftIcon={<FiCheckSquare />} color="white" size="lg" bg="blue.500">
            絞り込み
          </Button>
        </Flex>
      </HeaderBase>
      <MainBox>
        <FilterText
          categoryName="コーヒー"
          texts={['ハルメリア（ネル・ペーパー・サイフォン）', 'クラシック（ネル・ペーパー・サイフォン）']}
        />
        <Flex py="16px" alignItems="center" justifyContent="center">
          <Text fontSize="3xl" fontWeight="semibold" color="orange.700" mr="8">
            調理中: 2
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" color="gray.600">
            未調理: 6
          </Text>
        </Flex>
        <VStack>
          <ItemInfoCard
            callNumber="L-101"
            productName="ハルメリア"
            subTtitle="（ペーパー）"
            prefix="P"
            productColor="yellow.700"
            waitingTime="1分"
            cookingStatus="notyet"
          />
          <ItemInfoCard
            callNumber="L-101"
            productName="ロゴスクリアブレンド"
            subTtitle="（ネル）"
            prefix="N"
            productColor="cyan.700"
            waitingTime="1分"
            cookingStatus="cooking"
          />
          <ItemInfoCard
            callNumber="L-101"
            productName="ハルメリア"
            subTtitle="（ペーパー）"
            prefix="P"
            productColor="yellow.700"
            waitingTime="1分"
            cookingStatus="done"
          />
          <ItemInfoCard
            callNumber="L-101"
            productName="レモネード"
            prefix=""
            productColor="blue.700"
            waitingTime="1分"
            cookingStatus="done"
          />
          <ItemInfoCard
            callNumber="L-101"
            productName="パン"
            prefix=""
            productColor="orange.600"
            waitingTime="1分"
            cookingStatus="done"
          />
        </VStack>
      </MainBox>
      <FilterModal isOpen={false} onClose={() => {}} />
    </>
  );
}
