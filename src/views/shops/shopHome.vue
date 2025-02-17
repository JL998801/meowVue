<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import ProductCard from "@/components/shop/home/ProductCard.vue";
import Pagination from "@/components/shop/home/Pagination.vue";
import useProductStore from "../../stores/productStore"
import useCartStore from "../../stores/cartStore"
import axios from 'axios';
import { useStore } from 'vuex'

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
const store = useStore();

// 用來管理商品數量
// const selectedQuantities = ref({});

// 動態計算符合篩選條件的商品
// const filteredProducts = computed(() => {
//   return productStore.products.filter(product => {
//     const matchesCategory = !props.filter.categoryId || product.categoryId === props.filter.categoryId;
//     const matchesMinPrice = !props.filter.minPrice || product.salePrice >= props.filter.minPrice;
//     const matchesMaxPrice = !props.filter.maxPrice || product.salePrice <= props.filter.maxPrice;
    
//     return matchesCategory && matchesMinPrice && matchesMaxPrice;
//   });
// });

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

// 監聽當前頁面和總頁數
// const currentPage = computed(() => productStore.page);
// const totalPages = computed(() => productStore.totalPages);
// const pageSize = computed(() => productStore.size); // ✅ 每頁顯示數量

// ✅ 更新每頁顯示的商品數量
// const updatePageSize = (event) => {
//   productStore.size = Number(event.target.value);
//   productStore.page = 1; // ✅ 切回第一頁，避免超出範圍
//   productStore.fetchProducts();
// };

// // ✅ 切換分頁
// const updatePage = (newPage) => {
//   productStore.page = newPage;
//   productStore.fetchProducts();
// };

// 輪播器設定
// const targetCategories = ["貓用品", "狗用品", "保健品"]; // 只篩選這三個類別

// const filteredProductsByCategory = (category) => {
//   return category.products; // 直接回傳該類別的產品
// };

// const displayedCategories = computed(() => 
//   props.categories.filter(category => targetCategories.includes(category.categoryName))
// );

onMounted(() => {
  productStore.fetchProducts();
  productStore.fetchPagedProducts(); // ✅ 預設取得第一頁數據
});

// 獲取會員ID
const getMemberId = () => {
  return 1; // 假設會員ID為1
};

// 加入購物車邏輯
const addToCart = async (index) => {
  const product = filteredProducts.value[index];
  const quantity = selectedQuantities.value[index] || 1;

  if (quantity <= 0 || quantity > product.stockQuantity) {
    alert('選擇的數量無效');
    return;
  }

  try {
    const memberId = getMemberId();
    const productId = product.productId;

    await axios.post(`${import.meta.env.VITE_API_URL}/pages/cart/add`, {
      memberId: memberId,
      productId: productId,
      quantity: quantity,
    });

    store.dispatch('addToCart', { ...product, quantity });
    alert('商品已成功加入購物車');
  } catch (error) {
    console.error('加入購物車失敗:', error);
    alert('加入購物車失敗，請稍後重試');
  }
};

// 加入願望清單
const addToWishlist = (product) => {
  wishlistStore.addToWishList(product.productId);
  alert("商品已加入願望清單！"); //跳出彈窗
};
</script>
 
<template>
    <!-- 🔹 如果有搜尋結果，顯示商品卡片 -->
    <div class="shop-home">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p>搜尋結果</p>
        <!-- 🔹 分頁控制 -->
        <div class="spinner-grow text-warning" role="status" v-if="productStore.loading">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="pagination">
          <Pagination 
          v-if="productStore.totalPages"
          />
          <!-- <Pagination 
            v-if="filteredProducts.length > 1"
            :currentPage="productStore.currentPage" 
            :totalPages="productStore.totalPages" 
            @update-page="updatePage"
          />
          <label for="pageSizeSelect" class="me-2">每頁顯示：</label>
          <select id="pageSizeSelect" class="form-select w-auto"  :value="pageSize" @change="updatePageSize">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select> -->
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
<!-- 
      @add-to-cart="emit('add-to-cart', $event)"
      @add-to-wishlist="emit('add-to-wishlist', $event)" -->

      <!-- 🔹 無結果 -->
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
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden; /* 防止內容區域擴展超出範圍 */
}

/* 讓下拉選單更緊湊 */
select.form-select {
  max-width: 80px;
}

/* 商品卡片排版 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
