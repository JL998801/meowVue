<script setup>
import { ref, onMounted, defineProps, defineEmits,watch } from "vue";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useProductTagStore from "@/stores/productTagStore";

const categoryStore = useCategoryStore();
const tagStore = useProductTagStore();
const selectedTags = ref([]); // ✅ 存儲使用者選擇的標籤

onMounted(async() => {
  await categoryStore.fetchCategories(); // 取得類別數據
  await tagStore.fetchTags(); // 取得標籤數據
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
      <!-- <label class="form-label">商品分類</label> -->
      <select v-model="selectedCategory" class="form-select" placeholder="選擇分類" >
        <option :value="null">全部</option>
        <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category">
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <!-- 🔹 多選按鈕組 -->
    <div>
      <label class="form-label">選擇標籤篩選</label>
      <div class="btn-group" role="group">
        <div v-for="tag in tagStore.tags" :key="tag.tagId">
        <!-- ✅ 讓標籤按鈕與 input 綁定 -->
          <input 
            type="checkbox" 
            class="btn-check" 
            :id="`tag-${tag.tagId}`"
            :value="tag.tagName"
            v-model="selectedTags"
          />
          <label 
            class="btn"
            :class="selectedTags.includes(tag.tagName) ? 'btn-primary' : 'btn-outline-primary'"
            :for="`tag-${tag.tagId}`"
          >
            {{ tag.tagName }}
          </label>
        </div>
      </div>

      <!-- 🔹 顯示已選擇的標籤 -->
      <!-- <p class="mt-3">已選擇標籤: {{ selectedTags }}</p> -->
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
  row-gap: 10px;
  gap: 10px;
}
.search-bar {
  display: flex;
  gap: 10px;
}

/* ✅ 當標籤被選中時，改變背景顏色 */
.btn-check:checked + .btn {
  background-color: #007bff; /* ✅ 藍色高亮 */
  color: white;
  border-color: #007bff;
}

/* ✅ 預設狀態 */
.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
  transition: 0.3s;
}

/* ✅ 滑鼠懸停時變色 */
.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}
</style>
