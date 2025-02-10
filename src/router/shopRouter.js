import ShopHome from '../views/shops/shopHome.vue';  // 商品搜尋頁
import ProductDetails from '../views/shops/ProductDetails.vue'; // 商品詳細頁
import Cart from '../views/shops/Cart.vue';  // 購物車清單
import ShopDetails from '../views/shops/ShopDetails.vue'; // 訂單明細
import Payment from '../views/shops/Payment.vue';  // 付款明細

export const shopRoutes = [
  { path: '', name: 'ShopHome', component: ShopHome },
  { path: 'product/:id', name: 'ProductDetails', component: ProductDetails },
  { path: 'cart', name: 'Cart', component: Cart },
  { path: 'details/:id?', name: 'ShopDetails', component: ShopDetails, props: true },
  { path: 'payment', name: 'Payment', component: Payment }
]; 