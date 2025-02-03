<template>
  <div class="container">
    <h2 class="text-center my-4">商品分類</h2>

    <div v-if="isLoading" class="text-center">正在加載商品資料...</div>
    <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

    <div v-if="!isLoading">
      <div class="row">
        <!-- 遍歷分類 -->
        <div v-for="category in categories" :key="category.categoryId" class="col-md-4">
          <h3 class="text-center">📌 {{ category.categoryName }}</h3>

          <!-- 確保分類商品存在 -->
          <ProductCard 
            v-for="product in categoryProducts[category.categoryName] || []" 
            :key="product.id || product.productId" 
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { CategoryService } from "@/services/CategoryService";
import ProductCard from "@/components/ProductCard.vue";

const store = useStore();
const isLoading = ref(true);
const errorMessage = ref(null);
const categories = ref([]);
const categoryProducts = ref({}); // 儲存每個類別的商品

// 獲取分類與商品
const fetchCategoriesAndProducts = async () => {
  try {
    const allCategories = await CategoryService.getAllCategories();
    console.log("獲取的分類:", JSON.stringify(allCategories, null, 2));

    categories.value = allCategories.filter(category =>
      ["貓用品", "狗用品", "保健品"].includes(category.categoryName)
    );

    for (const category of categories.value) {
      const products = await CategoryService.getProductsByCategory(category.categoryId);
      console.log(`類別 ${category.categoryName} 的商品:`, JSON.stringify(products, null, 2));

      // ✅ 改用 Vue 監測的方式
      categoryProducts.value = { 
        ...categoryProducts.value, 
        [category.categoryName]: [JSON.stringify(products, null, 2)]  // 確保 Vue 監測變化
      };
    }

    // ✅ 最後確認 Vue 是否監測到變化
    console.log("完整分類商品資訊 (最終):", JSON.stringify(categoryProducts.value, null, 2));
  } catch (error) {
    errorMessage.value = "無法獲取商品資料，請稍後再試。";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// 加入購物車
const addToCart = (product) => {
  console.log(`加入購物車: ${product.name}`);
  store.dispatch("addToCart", product); // Vuex 分發 action
  alert("商品已成功加入購物車");
};

// 加入願望清單
const addToWishlist = (product) => {
  console.log(`加入願望清單: ${product.name}`);
  // TODO: 呼叫願望清單 API
  alert("商品已加入願望清單");
};

onMounted(fetchCategoriesAndProducts);
</script>

<style scoped>
h2 {
  color: #c6bc77;
}

.error {
  color: #FEBA07;
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
}
</style>
