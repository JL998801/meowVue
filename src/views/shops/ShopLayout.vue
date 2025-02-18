<template>
  <!-- shopLayout.vue 是最頂層的組件，它負責接收 shopHome 傳遞的事件 -->
  <div class="shop-layout">
    <!-- 🔹 商城導覽列 -->
    <ShopNavBar
      :isUserLoggedIn="isUserLoggedIn"
      :cartCount="cartCount"
      :wishlistCount="wishListCount"
      :notificationCount="notificationCount"
    />

    <!-- 🔹 商城主要內容區域 -->
    <main class="shop-container">
      <!-- 🔹 商品篩選側邊欄 (左側) -->
      <aside clase="shop-sidebar" v-if="isShopSearchPage">
        <!-- 🔹 接收 `update-filter` 事件，更新 `filter` -->
        <ShopSideBar @update-filter="updateFilter" />
      </aside>

      <!-- 🔹 商品顯示區域 (右側) -->
      <section class="shop-content">
        <router-view
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
// 負責商城的全局狀態管理，類似首頁 App.vue的作用
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import useUserStore from "@/stores/user";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useProductTagStore from "@/stores/productTagStore";
import useCartStore from "@/stores/cartStore";
import useWishListStore from "@/stores/wishListStore";
import useNotificationStore from "@/stores/wishListStore";
import ShopNavBar from "@/components/shop/home/ShopNavBar.vue"; // 導覽列
import ShopSideBar from "@/components/shop/home/ShopSidebar.vue"; //左側搜尋欄

// 獲取當前路由
const route = useRoute();

// **當路由是 `/shop` 時，顯示 ShopSideBar**
const isShopSearchPage = computed(() => route.path === '/shop');

// 初始化: Store、空陣列
const userStore = useUserStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const productTagStore = useProductTagStore();

const cartStore = useCartStore();
const wishListStore = useWishListStore();
const notificationStore = useNotificationStore();

// 使用 computed() 讓 `store` 的數據保持響應式
const isUserLoggedIn = computed(() => userStore.isLogin);
const categories = computed(() => categoryStore.categories);
const tags = computed(() => productTagStore.tags);

const loading = computed(() => productStore.loading);
const totalPages = computed(() => productStore.totalPages);
const currentPage = computed(() => productStore.currentPage);

const cartCount = computed(() => cartStore.cartItems?.length || 0);
const wishListCount = computed(() => wishListStore.wishListItems?.length || 0);
const notificationCount = computed(
  () => notificationStore.notifications?.length || 0
);

// **接收 `sideBar.vue` 發送的 `update-filter` 事件**
const filter = ref({}); // 存儲篩選條件
const updateFilter = (newFilter) => {
  filter.value = newFilter; // 更新 `filter`
};

// **檢查是否有搜尋條件**
const isFiltering = computed(() => {
  return filter.value && Object.keys(filter.value).length > 0;
});

// **根據 `filter` 來篩選商品**
const filteredProducts = computed(() => {
  return isFiltering.value
    ? productStore.products.filter(
        (p) =>
          (!filter.value.categoryId ||
            p.categoryId === filter.value.categoryId) &&
          (!filter.value.minPrice || p.price >= filter.value.minPrice) &&
          (!filter.value.maxPrice || p.price <= filter.value.maxPrice) &&
          (!filter.value.tagIds ||
            filter.value.tagIds.every((tagId) => p.tags.includes(tagId)))
      )
    : productStore.products;
});

watch(
  () => filteredProducts,
  (newProducts) => {
    console.log("ShopLayout 內部的 filteredProducts:", newProducts);
  },
  { deep: true }
);

// 加入購物車、加入願望清單，並將這些事件傳遞給各個子組件
const handleAddToCart = (product) => {
  cartStore.addToCart(product);
};

const handleAddToWishlist = (product) => {
  wishListStore.addToWishlist(product);
};

// 掛載時載入資料
onMounted(async () => {
  if (isUserLoggedIn.value) {
    try {
      // ✅ 並行加載會員相關資料
      await Promise.all([
        productStore.fetchProducts(),
        categoryStore.fetchCategories(),
        productTagStore.fetchTags(),
        cartStore.fetchCart(),
        wishListStore.fetchWishList(),
        notificationStore.fetchNotifications(),
      ]);
      console.log("登入後同步會員資料");
    } catch (error) {
      console.error("資料載入失敗:", error);
    }
  } else {
    // 未登入可看到的資料
    try {
      // ✅ 並行加載基礎資料
      await Promise.all([
        productStore.fetchPagedProducts(),
        categoryStore.fetchCategories(),
        productTagStore.fetchTags(),
      ]);
      console.log("登入前同步類別、標籤、商品資料");
    } catch (error) {
      console.error("資料載入失敗:", error);
    }
  }
});
</script>

<style scoped>
/* ✅ 確保 `shop-layout` 正確填滿畫面 */
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}

/* ✅ 讓 `shop-container` 正確排列 */
.shop-container {
  padding: 20px;
  display: flex;
  flex: 1;
  gap: 20px;
  width: 100%;
  margin: auto;
  height: calc(100vh - 80px);
}

/* ✅ 讓 `.shop-sidebar` 與 `.shop-content` 正確對齊 */
.shop-sidebar {
  width: 250px;
  flex-shrink: 0;
  background-color: #f4f4f4;
  height: 100%;
  position: relative; /* ✅ 避免 `fixed` 影響排版 */
}

/* ✅ 讓 `.shop-content` 正確滾動 */
.shop-content {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.shop-content::-webkit-scrollbar {
  display: none;
}
</style>
