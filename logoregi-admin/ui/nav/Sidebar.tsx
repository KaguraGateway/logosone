'use client';

import { Flex, List } from '@chakra-ui/react';
import { AiOutlineHistory, AiOutlineHome } from 'react-icons/ai';
import { FaChartPie, FaJava, FaReact } from 'react-icons/fa';
import { GiTable } from 'react-icons/gi';
import { TbShoppingBagDiscount } from 'react-icons/tb';

import { Navigation, NavItem } from './NavItem';

const navigations: Array<Navigation> = [
  {
    label: 'トップ',
    href: '/',
    icon: <AiOutlineHome />,
  },
  {
    label: '商品',
    href: '/products',
    icon: <FaJava />,
  },
  {
    label: '在庫',
    href: '/stock',
    icon: <FaReact />,
  },
  {
    label: '取引履歴',
    href: '/orders',
    icon: <AiOutlineHistory />,
  },
  {
    label: '売上分析',
    href: '/analysis',
    icon: <FaChartPie />,
  },
  {
    label: '座席管理',
    href: '/seats',
    icon: <GiTable />,
  },
  {
    label: '割引券',
    href: '/discounts',
    icon: <TbShoppingBagDiscount />,
  },
];

export default function Sidebar() {
  return (
    <Flex 
      display="flex" 
      flexDirection="column" 
      fontSize="xl" 
      fontWeight="medium"
    >
      <List.Root 
        as="ul"
        listStyleType="none"
        p={0}
        w="100%"
      >
        {navigations.map((link) => (
          <List.Item key={link.label}>
            <NavItem {...link} />
          </List.Item>
        ))}
      </List.Root>
    </Flex>
  );
}
