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
        <ShopSideBar
          v-if="categoryStore.categories?.length || productTagStore.tags?.length"
          :categories="categoryStore.categories"
          :tags="productTagStore.tags"
          :products="productStore.products"
          @update-filter="handleFilterUpdate"
        />
      </aside>

      <!-- 🔹 商品顯示區域 (右側) -->
      <section class="shop-content">
        <router-view 
          v-if="productStore.products?.length || !isSearching"
          :productCount="productCount"
          :products="productStore.products"
          :categories="categories"
          :tags="tags"
          :filteredProducts="filteredProducts"
          :isSearching="isSearching"
        />
        <p v-else class="no-products">無法獲取商品資料，請稍後重試。</p>
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
import ShopNavBar from '@/components/ShopNavBar.vue';  // 導覽列
import ShopSideBar from "@/components/ShopSideBar.vue"; //左側搜尋欄

// 初始化: Store、空陣列
const userStore = useUserStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const productTagStore = useProductTagStore();
const cartStore = useCartStore();
const wishListStore = useWishListStore();
const notificationStore = useNotificationStore();

const products = ref([]);
const categories = ref([]);
const tags = ref([]);

// ✅ 確保 `filteredProducts` 為陣列，避免 `undefined` 錯誤
const filteredProducts = computed(() => productStore.products?.value ?? []);
const isSearching = ref(false);

// 計算: 登入狀態、購物車 & 願望清單 & 通知數量(使用 watchEffect() 已經在 `user.js` 監聽 `token`)
const isUserLoggedIn = computed(() => userStore.isLogin);
const productCount = computed(() => productStore.products?.length || 0);
const cartCount = computed(() => cartStore.cartItems?.length || 0);
const wishListCount = computed(() => wishListStore.wishListItems?.length || 0);
const notificationCount = computed(() => notificationStore.notifications?.length || 0);

// 更新搜尋狀態 傳入 ShopSideBar 左側搜尋欄
const handleFilterUpdate = (filters) => {
  console.log("接收到篩選條件:", filters);
  
  isSearching.value = true;

  // ✅ 依據條件篩選商品
  filteredProducts.value = products.value.filter(product => {
    return (!filters.category || product.category === filters.category) &&
           (!filters.searchQuery || product.productName.includes(filters.searchQuery)) &&
           (!filters.tags.length || filters.tags.every(tag => product.tags.includes(tag))) &&
           (product.salePrice >= filters.priceRange[0] && product.salePrice <= filters.priceRange[1]);
  });
};

// async() 確保加載 api 資料後才執行程式碼，避免因為非同步請求，未抓到資料就執行導致 undefined 參數產生
onMounted(async() => {
  // 登入後才加載會員資料
  if (isUserLoggedIn.value) {
    try {
      console.log("fetchProducts");
      await productStore.fetchProducts();
      await categoryStore.fetchCategories();
      await productTagStore.fetchTags();
      await cartStore.fetchCart();
      await wishListStore.fetchWishList();
      await notificationStore.fetchNotifications();
      // products.value = productStore.products; //確保 products 在整個商城頁面內可用
    } catch (error) {
      console.error("資料載入失敗:", error);
    } 
  }else{
    // 未登入可看到的資料
    try{
      await productStore.fetchProducts();
      await categoryStore.fetchCategories();
      await productTagStore.fetchTags();
      // products.value = productStore.products; //確保 products 在整個商城頁面內可用
    }catch(error){
      console.error("資料載入失敗:", error);
    }
  }
});
</script>

<style scoped>
.shop-layout {
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100vh;
}

/* ✅ 主內容區域 */
.shop-container {
  display: flex;
  grid-template-columns: 250px 1fr; /* 側邊欄 250px，內容區域佔剩餘空間 */
  gap: 20px; /* 設定間距，防止重疊 */
  max-width: 1200px;
  /* margin: auto; 讓整個區塊置中 */
}

/* ✅ 側邊欄 */
.shop-sidebar {
  flex: 1; /* 側邊欄佔 1 份 */
  min-width: 250px; /* 設定最小寬度，防止過窄 */
}

/* ✅ 主要內容 */
.shop-content {
  flex: 3; /* 內容區域佔 3 份，確保有較大空間 */
  min-width: 600px;
  overflow-y: auto;
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
