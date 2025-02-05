import { createRouter, createWebHistory } from 'vue-router';

// 匯入商城的 Layout 和視圖元件
import ShopLayout from '../views/shops/ShopLayout.vue';
import ShopHome from '../views/shops/shopHome.vue';
import ProductDetails from '../views/shops/ProductDetails.vue';
import ShopCart from '../views/shops/Cart.vue';
import ShopDetails from '../views/shops/shopDetails.vue';
import ShopPayment from '../views/shops/Payment.vue';
import WishList from '../views/shops/wishList.vue';
import Notifications from '../views/shops/Notifications.vue';

// 定義商城路由（不創建 `createRouter`，直接 export `routes`）
export const routes = [
  {
    path: '/shop',
    component: ShopLayout,  // 全商城主要框架，類似全站 App.vue 的作用
    children: [
      {
        path: '',
        name: 'ShopHome',
        component: ShopHome
      },
      {
        path: 'product/:id',
        name: 'ProductDetails',
        component: ProductDetails
      },
      {
        path: 'wish',
        name: 'WishList',
        component: WishList
      },
      {
        path: 'note',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'cart',
        name: 'ShopCart',
        component: ShopCart
      },
      {
        path: 'details/:id?',
        name: 'ShopDetails',
        component: ShopDetails,
        props: true
      },
      {
        path: 'payment',
        name: 'ShopPayment',
        component: ShopPayment
      }
    ]
  }
];
