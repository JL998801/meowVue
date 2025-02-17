<template>
  <!-- 管理登入後導覽列的 badge標籤 & modal彈窗 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" aria-current="page" to="/">
        <img :src="petLogo" alt="Logo圖示" width="80" title="首頁">壁爐之家
      </RouterLink>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <RouterLink class="navbar-brand" aria-current="page" to="/shop">商城首頁</RouterLink>
        </li>

        <!-- 使用 BadgeCounter 顯示購物車圖示 -->
        <li class="nav-item">
          <BadgeCounter icon="🛒" :count="cartQuantity" @click="toggleCart" />
        </li>

          <li class="nav-item">
            <BadgeCounter
              icon="❤️"
              :count="wishlistCount"
              modalTarget="#wishListModal"
              :updateOnClick="true"
              @open-modal="openModal"
            />
          </li>

          <li class="nav-item">
            <BadgeCounter
              icon="🔔"
              :count="notificationCount"
              modalTarget="#notificationModal"
              :updateOnClick="true"
              @open-modal="openModal"
            />
          </li>

        <!-- 🔹 登出 -->
        <li class="nav-item">
          <button class="btn btn-danger" @click="handleLogout">登出</button>
        </li>
        <li class="nav-item">
          <RouterLink class="btn btn-danger" to="/secure/login">登入</RouterLink>
        </li>
      </ul>
    </div>
  </nav>

  <!-- 當顯示購物車內容時顯示 -->
  <div v-if="showCart" class="cart-content">
      <button class="close-btn" @click="toggleCart">X</button> <!-- Close button -->
      <div v-if="cartStore.cart.length === 0">
        <p>購物車是空的！</p>
      </div>
      <div v-else>
        <div v-for="item in cartStore.cart" :key="item.cartItemId" class="cart-item">
          <!-- 顯示商品縮圖 -->
          <img v-if="item.product?.imageUrl" :src="item.product.imageUrl" alt="Product Image"
            class="product-image" />
          <p>
            {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
            {{ item.product?.salePrice || 0 }}元 ×
            <span>{{ item.quantity }}</span>
          </p>
        </div>
        <div class="total">
          <span>總金額: {{ totalPrice }}元</span>
        </div>
        <button class="go-to-cart-btn" @click="goToCart">前往購物車</button>
      </div>
    </div>
  <!-- 🔹 Modal - 願望清單 -->
  <div class="modal fade" id="wishlistModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">願望清單</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <WishList />
        </div>
      </div>
    </div>
  </div>

  <!-- 🔹 Modal - 訊息通知 -->
  <div class="modal fade" id="notificationModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">通知中心</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <Notifications />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import petLogo from '@/assets/petLogo.png'; // Logo 圖示

import useUserStore from "@/stores/user";
import {storeToRefs} from "pinia";
import useCartStore from "@/stores/cartStore";
import useWishListStore from "@/stores/wishlistStore";
import useNotificationStore from "@/stores/wishlistStore";

// ✅ 接收來自 `ShopLayout.vue` 的 `props`
// const props = defineProps({
//   isUserLoggedIn: Boolean,
//   cartCount: Number,       // 購物車數量
//   wishlistCount: Number,   // 願望清單數量
//   notificationCount: Number, // 通知數量
// });

const router = useRouter();

// 初始化: Store、空陣列
const cartStore = useCartStore();

// 初始化: Store、空陣列
const userStore = useUserStore();
const wishListStore = useWishListStore();
const notificationStore = useNotificationStore();

// ✅ 確保 cartCount 是響應式的，當購物車內容變更時，Vue 會自動更新 BadgeCounter 的 count
const { cartCount, wishlistCount, notificationCount} = storeToRefs(cartStore,wishListStore,notificationStore);

// 用來控制購物車顯示與隱藏
const showCart = ref(false);

// 獲取購物車資料
const cart = computed(() => cartStore.cart || []);

// 計算總金額
const totalPrice = computed(() => {
  if (!cart.value.length) return 0;
  return cart.value.reduce(
    (total, item) => total + (item.product?.salePrice || 0) * item.quantity,
    0
  );
});

// 顯示購物車內容
const toggleCart = () => {
  showCart.value = !showCart.value;
};

// 顯示購物車數量
const cartQuantity = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// 前往購物車頁面
const goToCart = () => {
  router.push('/shop/cart'); // 確保路由正確
};

// ✅ 登出確認
const handleLogout = async () => {
  const result = await Swal.fire({
    title: "登出確認",
    text: "您確定要登出嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    userStore.logout();
    router.push("/shop"); // ✅ 登出後回到商城首頁
  }
};

// ✅ 手動開啟 Modal
const openModal = (modalId) => {
  const modal = new bootstrap.Modal(document.querySelector(modalId));
  modal.show();
};
</script>

<style scoped>
.cart-content {
  position: fixed;
  top: 60px;
  right: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 10px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: block;
  color: black;
  z-index: 1000;
}

.cart-item {
  display: flex;
  justify-content: space-between;
}

.product-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.total {
  margin-top: 10px;
  font-weight: bold;
}

.go-to-cart-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.go-to-cart-btn:hover {
  background-color: #0056b3;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
}
</style>