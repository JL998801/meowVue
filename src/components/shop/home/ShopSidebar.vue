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
    <label class="form-label">選擇標籤篩選</label>
    
    <!-- ✅ 容器，確保按鈕能自動換行 -->
    <div class="tag-container">
      <div class="tag-item" v-for="tag in tagStore.tags" :key="tag.tagId">
        <input type="checkbox"
               class="btn-check"
               v-model="selectedTags"
               :value="tag.tagId"
               :id="'tag-' + tag.tagId"
               @click="toggleTag(tag.tagId)">
        <label class="btn btn-outline-primary tag-button" :for="'tag-' + tag.tagId">
          {{ tag.tagName }}
        </label>
      </div>
    </div>

    <!-- 價格範圍 -->
    <div>
      <label>最低價格：</label>
      <input type="number" v-model="minPrice" placeholder="最低價格" @keyup.enter="applyFilter" />
      
      <label>最高價格：</label>
      <input type="number" v-model="maxPrice" placeholder="最高價格" @keyup.enter="applyFilter"/>
    </div>

    <div>
      <button class="btn btn-primary" @click="applyFilter">搜尋
      </button>
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
</script>

<style scoped>
.shop-filters {
  width: 300px;
  padding: 20px; /* ✅ 增加內邊距，讓內容不會太擠 */
  margin: 5px;
  background-color: #d0ccd0;
  border-radius: 5%;
  display: flex;
  flex-direction: column; /* ✅ 垂直排列所有篩選區塊 */
  row-gap: 15px; /* ✅ 設定每個篩選區塊之間的間距 */
}
.search-bar {
  display: flex;
  gap: 10px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;  /* ✅ 當按鈕超過寬度時自動換行 */
  gap: 10px;  /* ✅ 設定按鈕之間的間距 */
}

.tag-item {
  display: flex;
  align-items: center;  /* ✅ 確保 Checkbox 和文字垂直居中 */
}

.tag-button {
  padding: 8px 12px;  /* ✅ 按鈕內邊距，讓標籤更美觀 */
  white-space: nowrap; /* ✅ 防止標籤內文字換行 */
  border-radius: 8px;  /* ✅ 圓角美觀 */
}
</style>
