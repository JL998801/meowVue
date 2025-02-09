<script setup>
import { computed, defineProps, onMounted } from "vue";
import Carousel from "@/components/Carousel.vue";
import ProductCard from "@/components/ProductCard.vue";
import Pagination from "@/components/Pagination.vue"

// 接收 shopSidebar.vue 搜尋資料
const props = defineProps({
  products:Array,
  filteredProducts: Array,
  isSearching: Boolean,
});

console.log("shopHome init");
console.log(props.products);

// 監聽當前頁面和總頁數
const currentPage = computed(() => productStore.page);
const totalPages = computed(() => productStore.totalPages);
const pageSize = computed(() => productStore.size); // ✅ 每頁顯示數量

// 加入購物車
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

onMounted(()=>{
  console.log("test");
})
</script>

<template>
  <div class="shop-home">
    <!-- 🔹 如果有搜尋結果，顯示商品卡片 -->
    <div v-if="isSearching">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>搜尋結果</h2>
          <!-- 🔹 商品卡片 -->
          <div class="product-grid">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.productId"
              :product="product"
              @add-to-cart="addToCart"
              @add-to-wishlist="addToWishlist"
            />
          </div>

          <!-- 🔹 分頁控制 -->
          <div class="pagination">
            <Pagination 
              v-if="filteredProducts.length > 10"
              :currentPage="currentPage" 
              :totalPages="totalPages" 
              @update-page="updatePage"
            />
          </div>
        <label for="pageSizeSelect" class="me-2">每頁顯示：</label>
        <select id="pageSizeSelect" class="form-select w-auto" :value="pageSize" @change="updatePageSize">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- 🔹 如果沒有搜尋，顯示預設類別輪播 -->
    <div v-else>
      <h2>推薦商品</h2>
      <Carousel 
        v-if="products.length"
        :products="products"
       />
    </div>
  </div>
</template>

<style scoped>
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
</style>
