<template>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="搜尋商品..." 
      @input="emitSearch"
    />
    
    <select v-model="selectedCategory" @change="emitSearch">
      <option value="">所有分類</option>
      <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryId">
        {{ category.categoryName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCategoryStore } from "@/stores/category";

const categoryStore = useCategoryStore();
const searchQuery = ref("");
const selectedCategory = ref("");
const emit = defineEmits(["search"]);

// 觸發搜尋事件
const emitSearch = () => {
  emit("search", { query: searchQuery.value, categoryId: selectedCategory.value });
};

// 監聽分類變化，確保有分類資料
onMounted(() => {
  if (!categoryStore.categories.length) {
    categoryStore.fetchCategories();
  }
});

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
  margin: 10px 0 0 10px;
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
}

.category-select {
  margin-left: 8px;
  border: none;
  background: none;
  cursor: pointer;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 8px;
}
</style>
