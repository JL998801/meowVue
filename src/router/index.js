import { createRouter, createWebHistory } from 'vue-router';

// 匯入商城的 Layout 和視圖元件
import ShopLayout from '../views/shops/ShopLayout.vue';
import ShopHome from '../views/shops/shopHome.vue'; // 修改：將商城首頁作為單獨的視圖
import ProductDetails from '../views/shops/ProductDetails.vue'; // 商品明細頁
import ShopCart from '../views/shops/Cart.vue'; // 購物車頁面
import ShopDetails from '../views/shops/shopDetails.vue'; // 交易明細
import ShopPayment from '../views/shops/Payment.vue'; // 付款頁面

// 定義路由
const routes = [
  {
    path: '/shop',
    component: ShopLayout, // 使用 ShopLayout 作為容器
    children: [
      {
        path: '',  // 默認路徑為商城首頁
        name: 'ShopHome',
        component: ShopHome // 這裡顯示 ShopHome，並且不要再引入 shopApp.vue
      },
      {
        path: '/product/:id',
        name: 'ProductDetails',
        component: ProductDetails
      },
      {
        path: 'cart',
        name: 'ShopCart',
        component: ShopCart
      },
      {
        path: 'details/:id?',  // 交易明細頁，支持路由參數
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
  },
  {
    path: '/:pathMatch(.*)*',  // 捕捉所有未匹配路徑，重定向到商城首頁
    redirect: '/shop'
  }
];

// 創建路由器
const router = createRouter({
  history: createWebHistory(), // 使用乾淨的 URL，無 # 符號
  routes,
});

export default router;
