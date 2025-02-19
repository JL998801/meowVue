<template>
  <aside class="shop-filters">
    <!-- 🔹 商品搜尋 -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入商品關鍵字..." @keyup.enter="applyFilter" />
      
    </div>

    <!-- 🔹 分類篩選 -->
    <div class="category-filter">
      <label class="form-label">商品分類</label>
      <select v-model="selectedCategory" class="form-select" placeholder="選擇分類" >
        <option :value="null">全部</option>
        <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category">
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <!-- 🔹 多選按鈕組 -->
    <label class="form-label">標籤篩選</label>
    
    <!-- ✅ 容器，確保按鈕能自動換行 -->
    <div class="tag-container">
      <div class="tag-item" v-for="tag in tagStore.tags" :key="tag.tagId">
        <input type="checkbox"
              class="btn-check"
              v-model="selectedTags"
              :value="tag.tagId"
              :id="'tag-' + tag.tagId"
              @click="toggleTag(tag.tagId)">
        <label class="btn btn-outline-primary tag-button" 
          :class="{ 'tag-selected': selectedTags.includes(tag.tagId) }"
          :for="'tag-' + tag.tagId">
          {{ tag.tagName }}
        </label>
      </div>
    </div>

    <!-- 價格範圍 -->
    <div class="price-container">
      <label class="form-label">最低價格：</label>
      <input class="price-input" type="number" v-model="minPrice" placeholder="最低價格" />
    </div>
    <div class="price-container">
      <label class="form-label">最高價格：</label>
      <input class="price-input" type="number" v-model="maxPrice" placeholder="最高價格"/>
    </div>

    <div class="button-group">
      <button class="btn btn-primary " @click="applyFilter">搜尋</button>
      <button class="btn btn-secondary reset-btn" @click="resetFilters">重置</button>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useProductTagStore from "@/stores/productTagStore";

const categoryStore = useCategoryStore();
const tagStore = useProductTagStore();
const selectedTags = ref([]); // ✅ 存儲使用者選擇的標籤
const selectedCategory = ref(null); // 選擇分類 (單選)
const searchQuery = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);

// 傳遞給父組件 shopLayout.vue
// const emit = defineEmits(["update-filter"]);
const productStore = useProductStore();

// products 預設為 []，防止 v-for 無法綁定
const products = computed(() => productStore.filteredProducts || []);


// 🔹 點擊標籤時切換選中狀態
const toggleTag = (tagId) => {
  if (!tagId) return; // ✅ 確保 `tagId` 不是 `null` 或 `undefined`

  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(tag => tag !== tagId);
  } else {
    selectedTags.value.push(tagId);
  }

  console.log("🔍 選中的標籤:", selectedTags.value);
};

// **點擊搜尋按鈕時調用 `fetchFilteredProducts` 並發送事件**
const applyFilter = async () => {
  const filter = {
    query: searchQuery.value || null,
    categoryId: selectedCategory.value?.categoryId  || null, // ✅ 只傳 `categoryId`
    tagIds: selectedTags.value.filter(id => id !== null), // ✅ 過濾 `null`        
    minPrice: minPrice.value || null,
    maxPrice: maxPrice.value || null
  };

  console.log("🔍 送出的完整請求:", JSON.stringify(filter, null, 2)); 
  try {
    await productStore.fetchFilteredProducts(filter);
    // emit("update-filter", filter); // ✅ 通知父組件更新篩選條件
    console.log("🔍篩選條件已應用", filter);
    console.log("🔍 篩選後的商品:", productStore.filteredProducts);
  } catch (error) {
    console.error("篩選商品失敗", error);
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
  selectedTags.value = [];
  minPrice.value = 0;
  maxPrice.value = 5000; // 設定為最大值，視情況調整
};
</script>

<style scoped>
.shop-filters {
  width: 300px;
  padding: 15px;
  margin: 5px;
  background-color: #f8f9fa;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.1);
  border-radius: 2%;
  row-gap: 10px;
  gap: 10px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin: 5px;
}

/* ✅ 讓按鈕排成一列 */
.button-group {
  display: flex;
  justify-content: space-between; /* 讓按鈕之間保持間距 */
  gap: 10px; /* 按鈕間的間距 */
  margin-top: 10px;
}

/* ✅ 讓按鈕等寬 */
.search-btn,
.reset-btn {
  flex: 1; /* 讓兩個按鈕平均分配空間 */
  text-align: center;
}

/* ✅ 重置按鈕顏色 */
.reset-btn {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
  transition: all 0.3s ease-in-out;
}

.reset-btn:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

/* 預設標籤樣式 */
.tag-button {
  background-color: #f8f9fa;
  border-color: #D2B48C;
  color: #B8860B;
  transition: all 0.3s ease-in-out;
}

/* 標籤被選取後的樣式 */
.tag-selected {
  background-color: #B8860B !important;
  color: #f8f9fa !important;
  border-color: #8B6508 !important;
}

/* ✅ hover 過去時變色 */
.tag-button:hover {
  background-color: #B8860B !important;
  color: #f8f9fa !important;
  border-color: #8B6508 !important;
}

/*篩選標題樣式 */
.form-label{
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
}

/* 預設按鈕樣式 */
.btn-primary {
  height: 38px;
  width: 200px;
  text-align: center; /* 讓按鈕內文字置中 */
  background-color: #D2B48C !important;
  border-color: #D2B48C !important;
  color: white;
  transition: all 0.3s ease-in-out; /* ✅ 平滑變色效果 */
}

/* ✅ `hover` 時變色 */
.btn-primary:hover {
  background-color: #B8860B !important;
  border-color: #B8860B !important;
  color: white;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;  /* ✅ 當按鈕超過寬度時自動換行 */
  gap: 2px;  /* ✅ 設定按鈕之間的間距 */
}

.tag-item {
  display: flex;
  align-items: center;  /* ✅ 確保 Checkbox 和文字垂直居中 */
}

.tag-button {
  padding: 8px 12px;  /* ✅ 按鈕內邊距，讓標籤更美觀 */
  white-space: nowrap; /* ✅ 防止標籤內文字換行 */
  border-radius: 8px;  /* ✅ 圓角美觀 */
  margin: 5px;
}

/* ✅ 設定輸入框樣式 */
.price-input {
  width: 100%; /* 讓輸入框撐滿容器 */
  padding: 8px 12px; /* 內邊距，讓內容更有空間 */
  border: 2px solid #dfe2e6; /* 邊框顏色 */
  border-radius: 8px; /* 圓角 */
  font-size: 16px; /* 文字大小 */
  outline: none; /* 去掉點擊時的預設藍色外框 */
  transition: border-color 0.3s, box-shadow 0.3s;
}

.price-container{
  width: 100%;
  gap: 10px;
  margin: 5px;
}
</style>
