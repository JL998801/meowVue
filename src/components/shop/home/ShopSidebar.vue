<script setup>
import { ref, computed, defineProps, defineEmits,watch } from "vue";
import useProductStore from "@/stores/productStore";

// 接收來自 `ShopLayout.vue` 的 `props`
const props = defineProps({
  products:Array,
  categories: Array,
  tags: Array,
});

// 傳遞給父組件 shopLayout.vue
const emit = defineEmits(["update-filter"]);
const productStore = useProductStore();
const selectedCategory = ref(null); // 選擇分類 (單選)
const searchQuery = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);

// **觸發篩選條件**
const applyFilter = async() => {
  
  const filter = {};

  if (selectedCategory.value) {
    filter.categoryId = selectedCategory.value.categoryId;
  }
  if (minPrice.value) {
    filter.minPrice = minPrice.value;
  }
  if (maxPrice.value) {
    filter.maxPrice = maxPrice.value;
  }

  try {
    // 1️⃣ **向後端請求篩選結果**
    await productStore.fetchFilteredProducts(filter);

    // 2️⃣ **將篩選條件傳遞給 `ShopLayout.vue`**
    emit("update-filter", filter);
  } catch (error) {
    console.error("篩選請求失敗:", error);
  }
};

</script>

<template>
  <aside class="shop-filters">
    <!-- 🔹 商品搜尋 -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入商品關鍵字..." @keyup.enter="applyFilter" />
      
    </div>

    <!-- 🔹 商品分類 -->
    <div class="category-filter">
      <label class="form-label">商品分類</label>
      <select v-model="selectedCategory" class="form-select">
        <option :value="null">全部</option>
        <option v-for="category in productStore.categories" :key="category.categoryId" :value="category">
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <!-- 價格範圍 -->
    <div>
      <label>最低價格：</label>
      <input type="number" v-model="minPrice" placeholder="最低價格" />
      
      <label>最高價格：</label>
      <input type="number" v-model="maxPrice" placeholder="最高價格"/>
    </div>

    <div>
      <button class="btn btn-primary" @click="applyFilter">搜尋
      </button>
    </div>
  </aside>
</template>

<style scoped>
.shop-filters {
  width: 300px;
  padding: 15px;
  margin: 2px;
  background-color: #d0ccd0;
  border-radius: 5%;
}
.search-bar {
  display: flex;
  gap: 10px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
