<template>
  <div class="search-bar">
    <input class="search-input"
      type="text" 
      v-model="searchQuery" 
      placeholder="搜尋商品..." 
      @input="emitSearch"
    />
    
    <select v-model="selectedCategory" class="category-select" @change="emitSearch">
      <option value="">所有分類</option>
      <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryId">
        {{ category.categoryName }}
      </option>
    </select>
    <button class="search-button">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCategoryStore } from "@/stores/category";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const categoryStore = useCategoryStore();
const searchQuery = ref("");
const selectedCategory = ref("");
const emit = defineEmits(["search"]);

// searchBar取得預設分類商品
const fetchCategoriesAndProducts= async () => {
    try {
        await categoryStore.fetchCategories();
        
        console.log("成功獲取分類:", categoryStore.categories);
        
        if (!Array.isArray(categoryStore.categories)) {
            console.error("categoryStore.categories 不是陣列:", categoryStore.categories);
            return;
        }

        categoryStore.categories.forEach(category => {
            console.log(`分類: ${category.categoryName}`);
        });

    } catch (error) {
        console.error("fetchCategoriesAndProducts 發生錯誤:", error);
    }
};

// 觸發搜尋事件
const emitSearch = () => {
  emit("search", { query: searchQuery.value, categoryId: selectedCategory.value });
};

// 監聽分類變化，確保有分類資料
onMounted(fetchCategoriesAndProducts);

// 當分類列表更新時，如果已選擇的分類不存在於新數據中，重設為 "所有分類"
watch(() => categoryStore.categories, (newCategories) => {
  if (!newCategories.find(cat => cat.categoryId === selectedCategory.value)) {
    selectedCategory.value = "";
  }
});
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 30px;
  padding: 5px 10px;
  margin: 10px 10px 0 10px;
  width: 100%;
  max-width: 1000px;
  background-color: white;
}

.search-input {
  width: 600px;
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  margin-right: 10px;
}

.category-select {
  margin-left: 8px;
  border: 5px;
  margin-right: 5px;
  background: none;
  cursor: pointer;
}

.search-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
