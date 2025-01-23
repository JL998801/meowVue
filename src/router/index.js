import { createRouter, createWebHistory } from 'vue-router';

// 匯入視圖元件
import ShopHome from '../shopApp.vue';
import ShopCart from '../views/shops/Cart.vue';
import ShopDetails from '../views/shops/shopDetails.vue';
import ShopPayment from '../views/shops/Payment.vue';

// 定義路由
const routes = [
  {
    path: '/shop',
    name: 'ShopHome',
    component: ShopHome
  },
  {
    path: '/shop/cart',
    name: 'ShopCart',
    component: ShopCart
  },
  {
    path: '/shop/details/:id?',
    name: 'ShopDetails',
    component: ShopDetails,
    props: true  // 允許接收路由參數
  },
  {
    path: '/shop/payment',
    name: 'ShopPayment',
    component: ShopPayment
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/shop'  // 未知路徑導向商城首頁
  }
];

// 創建路由器
const router = createRouter({
  history: createWebHistory(), // 乾淨的URL (無 #)
  routes,
});

export default router;
