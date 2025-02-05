<template>
  <div class="container">
    <!-- 搜尋結果區塊 -->
    <div v-if="searchResults.length">
      <h3 class="text-center mt-4">搜尋結果</h3>
      <div class="row">
        <ProductCard
          v-for="product in searchResults"
          :key="product.productId"
          :product="product"
          class="product-item"
          displaymode="single"
        />
      </div>
    </div>

    <!-- 預設商品分類區塊 (當 searchResults 為空時顯示) -->
    <div v-if="!searchResults.length">
      <h3 class="text-center mt-4">商品分類</h3>

      <div v-for="(products, category) in categoryProducts" :key="category">
        <h4 class="category-title">{{ category }}</h4>
          <div class="product-slider" :ref="el => (productSliders[category] = el)">
            <ProductCard
              v-for="product in products"
              :key="product.productId"
              :product="product"
              class="product-item"
              displaymode="single"
            />
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { ProductService } from "@/services/ProductService";
import ProductCard from "@/components/ProductCard.vue";
// import Carousel from "@/components/Carousel.vue";

// 狀態變數
const categoryStore = useCategoryStore();
const searchResults = ref([]); // 搜尋結果
const categoryProducts = reactive({}); // 分類商品
const productSliders = ref({}); // 存放商品滑動區塊的 ref

// const categoryProducts = ref({
//   "熱門商品": [],
//   "最新商品": [],
//   "超值商品": []
// });

// 商品卡片載入預設三種類別
const fetchCategoriesAndProducts = async () => {
  await categoryStore.fetchCategories();
  console.log("已獲取 categories:", categoryStore.categories);

  // 預設顯示三種類別
  const defaultCategories = ["貓用品", "狗用品", "保健品"];

  for (const category of categoryStore.categories) {
    if (defaultCategories.includes(category.categoryName)) {
      const products = await ProductService.searchProducts("", category.categoryId);
      categoryProducts[category.categoryName] = products || [];
    }
  }
};

// 處理搜尋
const handleSearch = async ({ query, categoryId }) => {
  searchResults.value = await ProductService.searchProducts(query, categoryId);
};

// 商品卡片滑動
const scrollLeft = (category) => {
  productSliders[category].scrollBy({ left: -250, behavior: "smooth" });
};

const scrollRight = (category) => {
  productSliders[category].scrollBy({ left: 250, behavior: "smooth" });
};

// 掛載時獲取資料
onMounted(
  fetchCategoriesAndProducts
);
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
