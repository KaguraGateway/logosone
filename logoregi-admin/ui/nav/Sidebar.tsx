import { AiOutlineHistory, AiOutlineHome } from 'react-icons/ai';
import { FaChartPie, FaJava, FaReact } from 'react-icons/fa';
import { GiTable } from 'react-icons/gi';
import { TbShoppingBagDiscount } from 'react-icons/tb';

import { styled } from '@/panda/jsx';

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
    <styled.ul display="flex" flexDir="column" textStyle="xl" fontWeight="medium" listStyle="none">
      {navigations.map((link) => (
        <NavItem key={link.label} {...link} />
      ))}
    </styled.ul>
  );
}
