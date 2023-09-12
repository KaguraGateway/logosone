import { AiOutlineHistory, AiOutlineHome } from 'react-icons/ai';
import { FaChartPie, FaJava, FaReact } from 'react-icons/fa';

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
