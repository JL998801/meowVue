<template>
  <div class="container">
    <SearchBar @search="handleSearch" />
    <ProductCard v-for="product in searchResults" :key="product.productId" :product="product" />

    <div v-if="isLoading" class="text-center">正在加載商品資料...</div>
    <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

    <div v-if="!isLoading">
      <div class="row">
        <!-- 遍歷分類 -->
        <div v-for="category in categories" :key="category.categoryId" class="col-md-4">
          <h3 class="text-center">{{ category.categoryName }}</h3>

          <!-- 確保分類商品存在 -->
          <ProductCard 
            v-for="product in categoryProducts[category.categoryName] || []" 
            :key="product.productId" 
            :product="product"
            displayMode="single"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted} from "vue";
import SearchBar from "@/components/SearchBar.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useCategoryStore } from "@/stores/category";

const isLoading = ref(true);
const errorMessage = ref(null);
const categories = ref([]);
const categoryProducts = ref({});
const searchResults = ref([]); // 存放搜尋結果

// 獲取分類與商品
const fetchCategoriesAndProducts = async () => {
  try {
    const categoryStore = useCategoryStore();
    await categoryStore.fetchCategories(); // ✅ 使用 Pinia 取得分類

    // 只篩選出 `categoryId` 為 1, 2, 3 的分類
    categories.value = categoryStore.categories.filter(category =>
      [1, 2, 3].includes(category.categoryId)
    );

    for (const category of categories.value) {
      const products = await CategoryService.getProductsByCategory(category.categoryId);
      console.log(`類別 ${category.categoryName} 的商品:`, products);

      // ✅ 使用 Vue 3 正確的 reactivity 更新方式
      categoryProducts.value = {
        ...categoryProducts.value,
        [category.categoryName]: products,
      };
    }

    console.log("完整分類商品資訊 (最終):", categoryProducts.value);
  } catch (error) {
    errorMessage.value = "無法獲取商品資料，請稍後再試。";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async ({ query, category }) => {
  try {
    // 檢查 `category` 是否為 `undefined` 或空值
    let apiUrl = "/categories";
    if (category && category !== "所有分類") {
      apiUrl = `/categories/${category}`;
    }

    // 檢查 `query` 是否有效
    if (query && query.trim() !== "") {
      apiUrl += `?query=${encodeURIComponent(query)}`;
    }

    console.log("請求 API:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    searchResults.value = data.products;
  } catch (error) {
    console.error("搜尋失敗:", error);
    searchResults.value = [];
  }
};


onMounted(() => {
fetchCategoriesAndProducts();
});

</script>
