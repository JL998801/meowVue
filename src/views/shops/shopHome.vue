<script setup>
import { computed, defineProps } from "vue";
import Carousel from "@/components/shop/home/Carousel.vue";
import ProductCard from "@/components/shop/home/ProductCard.vue";
import Pagination from "@/components/shop/home/Pagination.vue";
import useProductStore from "../../stores/productStore"
import useCartStore from "../../stores/cartStore"

// 接收 shopSidebar.vue 搜尋資料
const props = defineProps({
  products: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  filter: Object, // ✅ 接收來自父組件的搜尋條件
  isSearching: Boolean,
});

const productStore = useProductStore();
const cartStore = useCartStore();

// 動態計算符合篩選條件的商品
const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesCategory = !props.filter.categoryId || product.categoryId === props.filter.categoryId;
    const matchesMinPrice = !props.filter.minPrice || product.salePrice >= props.filter.minPrice;
    const matchesMaxPrice = !props.filter.maxPrice || product.salePrice <= props.filter.maxPrice;
    
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});

// 監聽當前頁面和總頁數
const currentPage = computed(() => productStore.page);
const totalPages = computed(() => productStore.totalPages);
const pageSize = computed(() => productStore.size); // ✅ 每頁顯示數量

// 加入購物車:  調用 `cartStore.js` 更新購物車
const addToCart = (product) => {
  cartStore.addToCart(product.productId);
  Swal.fire({
    title: "商品添加成功！",
    text: `"${product.productName}" 已成功加入購物車！`,
    icon: "success",
    confirmButtonText: "確定",
  });
};

// 加入願望清單
const addToWishlist = (product) => {
  wishlistStore.addToWishList(product.productId);
  Swal.fire({
    title: "商品已加入願望清單！",
    text: `"${product.productName}" 已成功加入您的願望清單！`,
    icon: "success",
    confirmButtonText: "確定",
  });
};

// ✅ 更新每頁顯示的商品數量
const updatePageSize = (event) => {
  productStore.size = Number(event.target.value);
  productStore.page = 1; // ✅ 切回第一頁，避免超出範圍
  productStore.fetchProducts();
};

// ✅ 切換分頁
const updatePage = (newPage) => {
  productStore.page = newPage;
  productStore.fetchProducts();
};

// 輪播器設定
const targetCategories = ["貓用品", "狗用品", "保健品"]; // 只篩選這三個類別

const filteredProductsByCategory = (category) => {
  return category.products; // 直接回傳該類別的產品
};

const displayedCategories = computed(() => 
  props.categories.filter(category => targetCategories.includes(category.categoryName))
);

</script>

<template>
    <!-- 🔹 如果有搜尋結果，顯示商品卡片 -->
    <div class="shop-home">
    <!-- <div class="shop-home" v-if="isSearching"> -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>搜尋結果</h2>
          <!-- 🔹 分頁控制 -->
          <div class="pagination">
            <Pagination 
              v-if="filteredProducts.length > 10"
              :currentPage="currentPage" 
              :totalPages="totalPages" 
              @update-page="updatePage"
            />
            <label for="pageSizeSelect" class="me-2">每頁顯示：</label>
            <select id="pageSizeSelect" class="form-select w-auto"  :value="pageSize" @change="updatePageSize">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
      </div>
      <!-- 🔹 商品卡片 -->
      <div class="product-grid" v-if="filteredProducts.length > 0">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.productId"
          :product="product"
          @add-to-cart="addToCart"
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
  overflow: hidden; /* 防止內容區域擴展超出範圍 */
}

/* 讓下拉選單更緊湊 */
select.form-select {
  max-width: 80px;
}

/* 商品卡片排版 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
