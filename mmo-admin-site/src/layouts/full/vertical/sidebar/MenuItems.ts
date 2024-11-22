import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  IconShoppingCart,
  IconAppWindow,
  IconPoint,
  IconUserCircle,
  IconBasket,
  IconCpu2,
  IconTicket,
  IconReportSearch,
} from '@tabler/icons';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const Menuitems = () => {
  const { t } = useTranslation();

  const items: MenuitemsType[] = [
    {
      id: uniqueId(),
      title: t('menu.home') || 'Dashboard',
      icon: IconShoppingCart,
      href: '/dashboards',
      chip: t('menu.chip') || 'New',
      chipColor: 'secondary',
    },

    {
      id: uniqueId(),
      title: t('menu.productCategory') || 'Product category',
      icon: IconAppWindow,
      href: '/product-category',
    },
    {
      id: uniqueId(),
      title: t('menu.product') || 'Product',
      icon: IconCpu2,
      href: '/product',
      children: [
        {
          id: uniqueId(),
          title: t('menu.allProduct') || 'All product',
          icon: IconPoint,
          href: '/product',
        },
        {
          id: uniqueId(),
          title: t('menu.accountSold') || 'Account sold',
          icon: IconPoint,
          href: '/account-sold',
        },
        {
          id: uniqueId(),
          title: t('menu.accountInStock') || 'Account in stock',
          icon: IconPoint,
          href: '/account-available',
        },
      ],
    },
    {
      id: uniqueId(),
      title: t('menu.order') || 'Order',
      icon: IconBasket,
      href: '/order',
    },
    {
      id: uniqueId(),
      title: t('menu.coupon') || 'Coupon',
      icon: IconTicket,
      href: '/coupon',
    },
    {
      id: uniqueId(),
      title: t('menu.post') || 'Post',
      icon: IconReportSearch,
      href: '/post',
      children: [
        {
          id: uniqueId(),
          title: t('menu.allPost') || 'All post',
          icon: IconPoint,
          href: '/post',
        },
        {
          id: uniqueId(),
          title: t('menu.postCategory') || 'postCategory',
          icon: IconPoint,
          href: '/post-category',
        },
      ],
    },
    {
      id: uniqueId(),
      title: t('menu.transaction') || 'Transaction',
      icon: IconUserCircle,
      href: '/transaction',
    },
  ];

  return items;
};

export default Menuitems;
