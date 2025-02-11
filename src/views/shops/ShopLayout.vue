<template>
  <!-- <div class="shop-layout"> -->
    <!-- 🔹 商城導覽列 -->
    <nav :class="['navbar', { shrink: isScrolled }]">
      <ShopNavBar
        :isUserLoggedIn="isUserLoggedIn"
        :cartCount="cartCount"
        :wishListCount="wishListCount"
        :notificationCount="notificationCount"
      />
    </nav>
    
    <!-- 🔹 商城主要內容區域 -->
    <main class="shop-container">
      <!-- 🔹 商品篩選側邊欄 (左側) -->
      <aside clasee="shop-sidebar">
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
  <!-- </div> -->
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
/* 🔹 讓 shop-layout 佔滿整個瀏覽器 */
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* ✅ 填滿整個視窗 */
  width: 100vw; /* ✅ 確保佔滿整個寬度 */
  position: relative; /* 🔹 讓內部元素能參考這個父層 */
}

.navbar {
  top: 0;
  width: 100%;  /* ✅ 保持全寬 */
  height: 80px; /* ✅ 預設高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute; /* ✅ 讓 Navbar 依附 `shop-layout` */
  left: 0;
  transition: height 0.3s ease-in-out; /* ✅ 只改變高度，動畫順暢 */
  z-index: 1000;
}

/* 🔹 設定 aside + section 水平排列 */
.shop-container {
  display: flex; /* ✅ 讓 .shop-sidebar 和 .shop-content 在同一行 */
  flex: 1; /* ✅ 讓 .shop-container 填滿 .shop-layout */
  gap: 20px; /* ✅ 設定間距 */
  max-width: 1200px; /* ✅ 最大寬度，避免過寬 */
  width: 100%; /* ✅ 讓內容自適應 */
  margin: auto; /* ✅ 讓內容置中 */
  height: calc(100vh - 80px); /* ✅ 讓 shop-container 滿版（減去 Navbar 高度） */
}

/* 🔹 固定側邊欄的大小 */
.shop-sidebar {
  width: 250px; /* ✅ 固定寬度 */
  flex-shrink: 0; /* ✅ 防止側邊欄縮小 */
  background-color: #f4f4f4;
  height: 100%; /* ✅ 讓側邊欄填滿 .shop-container */
  position: fixed; /* ✅ 固定位置 */
}

/* 🔹 讓主內容最大化填充剩餘空間 */
.shop-content {
  flex: 1; /* ✅ 讓 .shop-content 填滿剩餘空間 */
  min-width: 0; /* ✅ 防止內容超出父容器 */
  height: 100%; /* ✅ 讓內容區域填滿 .shop-container */
  overflow-y: auto; /* ✅ 允許滾動 */
  scrollbar-width: none; /* ✅ 隱藏滾動條（Firefox） */
  -ms-overflow-style: none; /* ✅ 隱藏滾動條（IE/Edge） */
}

/* ✅ 讓主內容區滾動時不影響整個頁面 */
.shop-content::-webkit-scrollbar {
  display: none;
}

</style>
