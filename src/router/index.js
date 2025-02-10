import { createRouter, createWebHistory } from 'vue-router';

// 匯入商城的 Layout 和視圖元件
import ShopLayout from '../views/shops/ShopLayout.vue';
import ShopHome from '../views/shops/ShopHome.vue';
import ShopCart from '../views/shops/Cart.vue';
import ShopDetails from '../views/shops/ShopDetails.vue';
import ShopPayment from '../views/shops/Payment.vue';

// 匯入管理員頁面
import AdminLayout from '../views/admin/AdminLayout.vue';
import AdminOrders from '../views/admin/AdminOrders.vue';

const routes = [
  {
    path: '/shop',
    component: ShopLayout,
    children: [
      { path: '', name: 'ShopHome', component: ShopHome },
      { path: 'cart', name: 'Cart', component: ShopCart },
      { path: 'details/:id?', name: 'ShopDetails', component: ShopDetails, props: true },
      { path: 'payment', name: 'ShopPayment', component: ShopPayment }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'orders', name: 'AdminOrders', component: AdminOrders }
    ]
  },
  {
    path: '/:pathMatch(.*)*', // 捕捉所有未匹配路徑，重定向到商城首頁
    redirect: '/shop'
  }
];

// 創建路由器
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
