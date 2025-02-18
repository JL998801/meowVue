<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import ProductCard from "@/components/shop/home/ProductCard.vue";
import Pagination from "@/components/shop/home/Pagination11.vue";
import useProductStore from "@/stores/productStore"
import useCartStore from "@/stores/cartStore"
import axios from 'axios';

// 接收 shopSidebar.vue 搜尋資料
const props = defineProps({
  products: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  filter: Object, // ✅ 接收來自父組件的搜尋條件
  isSearching: Boolean,
});

const productStore = useProductStore();
const selectedFilter = ref({}); // 用於存儲篩選條件
const loading = ref(false);

const cartStore = useCartStore();

// ✅ 確保 `filteredProducts` 只在 `productStore.products` 有值時運行
const filteredProducts = computed(() => {
  if (!Array.isArray(productStore.products)) return [];
  return productStore.products.filter((product) => {
    const matchesCategory = !selectedFilter.value.categoryId || product.categoryId === selectedFilter.value.categoryId;
    const matchesMinPrice = !selectedFilter.value.minPrice || product.salePrice >= selectedFilter.value.minPrice;
    const matchesMaxPrice = !selectedFilter.value.maxPrice || product.salePrice <= selectedFilter.value.maxPrice;
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});

// 輪播器設定
// const targetCategories = ["貓用品", "狗用品", "保健品"]; // 只篩選這三個類別

// const filteredProductsByCategory = (category) => {
//   return category.products; // 直接回傳該類別的產品
// };

// const displayedCategories = computed(() => 
//   props.categories.filter(category => targetCategories.includes(category.categoryName))
// );

onMounted(() => {
  productStore.fetchProducts();  //取得商品資訊
  productStore.fetchPagedProducts(); // ✅ 預設取得第一頁數據
});

// 獲取會員ID
const getMemberId = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/member/getMemberId`); 
    return response.data.memberId; // 假設後端返回的是 { memberId: <id> }
  } catch (error) {
    console.error("獲取會員ID失敗:", error);
    return null; // 如果獲取失敗，可以回傳 null 或做相應處理
  }
};

// 獲取購物車ID (可以改為從後端獲取)
const getCartId = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/getCartId`);
    return response.data.cartId; // 假設後端返回的是 { cartId: <id> }
  } catch (error) {
    console.error("獲取購物車ID失敗:", error);
    return null; // 如果獲取失敗，可以回傳 null 或做相應處理
  }
};

// 加入購物車
const addToCart = async (index) => {
  const product = filteredProducts.value[index];
  if (!product) return;

  try {
    const memberId = 1; // 從後端獲取會員ID
    const cartId = 1; // 從後端獲取購物車ID
    if (!memberId || !cartId) {
      alert("無法獲取會員或購物車資訊");
      return;
    }

    const productId = product.productId;
    const quantity = 1;

    await axios.post(`${import.meta.env.VITE_API_URL}/api/pages/cart/add`, {
      cartId,
      memberId,
      productId,
      quantity,
    });
    
    cartStore.addToCart({ ...product, quantity });
    alert("商品已成功加入購物車");
  } catch (error) {
    console.error("加入購物車失敗:", error);
    alert("加入購物車失敗，請稍後重試");
  }
};

// 加入願望清單
const addToWishlist = (product) => {
  wishlistStore.addToWishList(product.productId);
  alert("商品已加入願望清單！"); //跳出彈窗
};
</script>
 
<template>
    <!-- 🔹 搜尋前: 顯示商品卡片-->
    <div class="shop-home">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- 🔹 分頁控制 -->
        <div class="spinner-grow text-warning" role="status" v-if="productStore.loading">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="pagination">
          <Pagination 
          v-if="productStore.totalPages"
          />
      </div>
    </div>
      <!-- 🔹 商品卡片:點擊需要傳入 product 資訊 -->
      <div class="product-grid" v-if="productStore.products.length > 0">
        <ProductCard
          displayMode="one"
          v-for="product in productStore.products"
          :key="product.productId"
          :product="product"
          @add-to-cart="addToCart(index)"
          @add-to-wishlist="addToWishlist"
        />
      </div>

      <!-- 🔹 搜尋後無結果 -->
      <div v-else-if="!productStore.loading">
        <p>沒有符合條件的商品</p>
      </div>
      
      <div v-else>
        <p>下載中</p>
      </div>
  
  </div>
</template>

<style scoped>
.shop-home {
  padding: 10px;
  margin-bottom: 20px;
  overflow-x: hidden; /* 只隱藏水平滾動 */
  overflow-y: auto; /* ✅ 允許垂直滾動 */
  max-height: 100vh; /* ✅ 防止內容過度擴展 */
}

/* 標題列 */
.d-flex {
  padding: 5px 10px; /* ✅ 減少內邊距 */
  margin-bottom: 10px; /* ✅ 減少底部間距 */
  height: 80px; /* ✅ 讓高度依內容自適應 */
  min-height: 40px; /* ✅ 設定最小高度，避免壓縮過頭 */
}

/* 讓下拉選單更緊湊 */
select.form-select {
  max-width: 80px;
}

/* 商品卡片排版 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  flex-wrap: wrap;  /* ✅ 商品超出畫面時自動換行 */
  gap: 5px;  /* ✅ 設定卡片之間的間距 */
  justify-content: space-between;  /* ✅ 讓商品平均分配 */
  width: 100%; /* ✅ 確保內容撐滿畫面 */
}

/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.carousel-container {
  display: flex;
  flex-direction: column; /* 讓每個 Carousel 區塊獨立一行 */
  gap: 20px; /* 設定間距 */
}

.carousel-item {
  width: 100%; /* 讓每個類別區塊佔滿 */
  text-align: center;
}
</style>
