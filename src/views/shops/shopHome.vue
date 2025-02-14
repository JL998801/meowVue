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

// 動態計算符合篩選條件的商品
const filteredProducts = computed(() => {
  if (!Array.isArray(productStore.products)) return [];
  return productStore.products.filter((product) => {
    const matchesCategory = !selectedFilter.value.categoryId || product.categoryId === selectedFilter.value.categoryId;
    const matchesMinPrice = !selectedFilter.value.minPrice || product.salePrice >= selectedFilter.value.minPrice;
    const matchesMaxPrice = !selectedFilter.value.maxPrice || product.salePrice <= selectedFilter.value.maxPrice;
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});

onMounted(() => {
  productStore.fetchProducts();  //取得商品資訊
  productStore.fetchPagedProducts(); // ✅ 預設取得第一頁數據
});

// 獲取會員ID (可以改為從後端獲取)
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
    const memberId = await getMemberId(); // 從後端獲取會員ID
    const cartId = await getCartId(); // 從後端獲取購物車ID
    if (!memberId || !cartId) {
      alert("無法獲取會員或購物車資訊");
      return;
    }

    const productId = product.productId;
    const quantity = 1;

    await axios.post(`${import.meta.env.VITE_API_URL}/pages/cart/add`, {
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
    <!-- 🔹 如果有搜尋結果，顯示商品卡片 -->
    <div class="shop-home">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p>搜尋結果</p>
        <div class="spinner-grow text-warning" role="status" v-if="productStore.loading">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="pagination">
          <Pagination v-if="productStore.totalPages"/>
        </div>
      </div>
      <!-- 🔹 商品卡片:點擊需要傳入 product 資訊 -->
      <div class="product-grid" v-if="productStore.products.length > 0">
        <ProductCard
          displayMode="one"
          v-for="(product, index) in productStore.products"
          :key="product.productId"
          :product="product"
          @add-to-cart="addToCart(index)"
          @add-to-wishlist="addToWishlist"
        />
      </div>
      <div v-else>
        <p>沒有符合條件的商品</p>
      </div>
    </div>
</template>

<style scoped>
.shop-home {
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}

select.form-select {
  max-width: 80px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.carousel-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.carousel-item {
  width: 100%;
  text-align: center;
}
</style>
