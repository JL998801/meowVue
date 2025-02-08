<template>
  <div>
    <ShopSearch v-model="searchQuery" />

    <!-- 🔹 有搜尋條件時，顯示搜尋結果 -->
    <div v-if="isSearching">
      <h3>搜尋結果</h3>
      <div v-if="products.length">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <p v-else>未找到相關商品。</p>

      <!-- 🔹 分頁控制 -->
      <div class="pagination">
        <button @click="page--" :disabled="page === 0">上一頁</button>
        <button @click="page++" :disabled="page >= totalPages - 1">下一頁</button>
      </div>

      <!-- 🔹 排序選擇 -->
      <label>排序：</label>
      <select v-model="sortBy">
        <option value="productName">商品名稱</option>
        <option value="salePrice">價格</option>
        <option value="createdAt">上架時間</option>
      </select>

      <select v-model="order">
        <option value="asc">升序</option>
        <option value="desc">降序</option>
      </select>
    </div>

    <!-- 🔹 無搜尋條件時，顯示預設類別商品 -->
    <div v-else>
      <h3>推薦商品</h3>
      <div v-if="products.length">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <p v-else>目前沒有推薦商品。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive,watch } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { ProductService } from "@/services/ProductService";
import ShopSearch from "@/components/ShopSearch.vue";
import ProductCard from "@/components/ProductCard.vue";

const products = ref([]); // 存放搜尋結果
const searchQuery = ref(""); // 來自 ShopSearch.vue 的搜尋關鍵字
const isSearching = ref(false);
const categoryStore = useCategoryStore(); //類別狀態
const categoryProducts = reactive({}); // 分類商品
const defaultCategories = ["貓用品", "狗用品", "保健品"];

// 分頁排序
const page = ref(0);
const size = ref(10);
const sortBy = ref("productName");
const order = ref("asc");
const totalPages = ref(1);

// ✅ 取得預設三種類別商品
const fetchDefaultProducts = async () => {
  try {
    const promises = defaultCategories.map(category =>
      ProductService.searchProducts(category)
    );
    const results = await Promise.all(promises);
    products.value = results.flat(); // 合併不同類別的商品
  } catch (error) {
    console.error("載入預設類別商品失敗", error);
  }
};

// ✅ 取得搜尋結果（分頁 + 排序）
const fetchProducts = async () => {
  if (searchQuery.value) {
    isSearching.value = true;
    const response = await ProductService.getPagedProducts(
      searchQuery.value, page.value, size.value, sortBy.value, order.value
    );
    products.value = response.content;
    totalPages.value = response.totalPages;
  } else {
    isSearching.value = false;
    await fetchDefaultProducts();
  }
};

// ✅ 監聽搜尋變化，觸發 API
watch([searchQuery, page, size, sortBy, order], fetchProducts);

// ✅ 頁面載入時，取得預設商品
onMounted(fetchProducts);
</script>

<style scoped>
.category-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-top: 20px;
}

.product-slider {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px;
  scroll-behavior: smooth;
}

.product-item {
  flex: 0 0 auto;
  width: 250px;
}
</style>
