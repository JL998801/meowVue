<template>
  <div class="shop-layout">
    <!-- 🔹 商城導覽列 -->
    <ShopNavBar
      :isUserLoggedIn="isUserLoggedIn"
      :cartCount="cartCount"
      :wishListCount="wishListCount"
      :notificationCount="notificationCount"
    />
    <!-- 🔹 商城主要內容區域 -->
    <main class="shop-container">
      <!-- 🔹 商品篩選側邊欄 (左側) -->
      <aside class="shop-sidebar">
      <!-- 接收來自子組件 shopSideBar 的資料 emit -->
        <ShopSideBar
          @update-filter="handleFilterUpdate"
        />
      </aside>

      <!-- 🔹 商品顯示區域 (右側) -->
      <section class="shop-content">
        <router-view 
          :products="products"
          :categories="categories"
          :tags="tags"
          :filter="selectedFilter"
        />
      </section>
    </main>

    <!-- 🔹 頁尾 -->
    <footer class="shop-footer">
      <p>&copy; 2024 壁爐之家 - All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// 負責商城的全局狀態管理，類似首頁 App.vue的作用
import { ref, computed, onMounted } from "vue";
import useUserStore from "@/stores/user";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore"
import useProductTagStore from "@/stores/productTagStore";
import useCartStore from "@/stores/cartStore";
import useWishListStore from "@/stores/wishlistStore";
import useNotificationStore from "@/stores/wishlistStore";
import ShopNavBar from '@/components/shop/home/ShopNavBar.vue';  // 導覽列
import ShopSideBar from "@/components/shop/home/ShopSideBar.vue"; //左側搜尋欄

// 初始化: Store、空陣列
const userStore = useUserStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const productTagStore = useProductTagStore();
const cartStore = useCartStore();
const wishListStore = useWishListStore();
const notificationStore = useNotificationStore();

const selectedFilter = ref({});

// **接收 `ShopSideBar.vue` 傳遞的篩選條件**
const handleFilterUpdate = (filter) => {
  selectedFilter.value = filter;
  console.log("篩選條件更新:", filter);
};

// 計算: 登入狀態、購物車 & 願望清單 & 通知數量(使用 watchEffect() 已經在 `user.js` 監聽 `token`)
const isUserLoggedIn = computed(() => userStore.isLogin);
const cartCount = computed(() => cartStore.cartItems?.length || 0);
const wishListCount = computed(() => wishListStore.wishListItems?.length || 0);
const notificationCount = computed(() => notificationStore.notifications?.length || 0);

// async() 確保加載 api 資料後才執行程式碼，避免因為非同步請求，未抓到資料就執行導致 undefined 參數產生
onMounted(async() => {
  // 登入後才加載會員資料
  if (isUserLoggedIn.value) {
    try {
      await productStore.fetchProducts();
      await categoryStore.fetchCategories();
      await productTagStore.fetchTags();
      await cartStore.fetchCart();
      await wishListStore.fetchWishList();
      await notificationStore.fetchNotifications();
      console.log("after login fetchData");
    } catch (error) {
      console.error("資料載入失敗:", error);
    } 
  }else{
    // 未登入可看到的資料
    try{
      await productStore.fetchProducts();
      await categoryStore.fetchCategories();
      await productTagStore.fetchTags();
      console.log("before login fetchData");
    }catch(error){
      console.error("資料載入失敗:", error);
    }
  }
});
</script>

<style scoped>
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.shop-container {
  display: flex; /* 讓 aside 和 section 在同一行排列 */
  gap: 50px; /*設定 aside 和 section 之間的間距*/
  max-width: 1000px;
  margin: auto; /* 讓整個區塊置中 */

  overflow-x: hidden; /* 限制左右溢出 */
  overflow-y: auto; /* 允許垂直滾動 */
}

.shop-sidebar {
  width: 250px; /* 設定固定寬度，確保不會壓縮 */
  flex-shrink: 0; /* 防止縮小 */
  background-color: #f4f4f4;
  max-width: 100%; /* 確保不超過父組件 */
  max-height: 100%;
  overflow: visible; /* 讓內部內容顯示完整 */
}

.shop-content {
  flex: 1; /* 讓 .shop-content 佔據剩餘空間 */
  min-width: 0; /* 避免內容過長時影響 flex 計算 */
  background-color: #ffffff;
  max-width: 100%; /* 確保不超過父組件 */
  max-height: 100%;
  overflow: visible; /* 讓內部內容顯示完整 */
}

/* ✅ 頁尾 (footer) */
.shop-footer {
  background-color: #f8f9fa;
  color: black;
  text-align: center;
  padding: 15px;
  font-size: 14px;
  width: 100%;
}
</style>
