<script setup>
import { ref, onMounted, watch, defineEmits } from "vue";
import { CategoryService } from "@/services/CategoryService";
import { ProductTagService } from "@/services/ProductTagService";
import { useCategoryStore } from "@/stores/categoryStore";
import { useProductTagStore } from "@/stores/productTagStore";

const selectedCategory = ref(null); // ✅ 單選類別
const selectedTags = ref([]); // ✅ 多選標籤
const categories = ref([]); // 所有分類
const tags = ref([]); // 所有標籤
const categoryStore = useCategoryStore();
const productTagStore = useProductTagStore();
const searchInput = ref("");  // 發送搜尋關鍵字
const emit = defineEmits(["update:modelValue"]); 

// 獲取分類與標籤
const fetchData = async () => {
  categories.value = await CategoryService.getAllCategories();
  tags.value = await ProductTagService.getAllTags();
};

// 將輸入傳回父組件
const updateSearch = () => {
  emit("update:modelValue", searchInput.value); 
};

// 掛載時獲取分類與商品資料
onMounted(fetchData);

// 當列表更新時，如果已選擇的分類不存在於新數據中，重設為 "所有分類、標籤"
watch(() => categoryStore.categories, (newCategories) => {
    if (!newCategories.find(cat => cat.categoryId === selectedCategory.value)) {
    selectedCategory.value = "";
    }
});

watch(() => productTagStore.categories, (newProductTags) => {
    if (!newProductTags.find(tag => tag.tagId === selectedCategory.value)) {
    selectedCategory.value = "";
    }
});
</script>

<template>
<div>
    <div>
    <!-- 🔍 搜尋關鍵字 -->
    <input v-model="searchInput" @input="updateSearch" placeholder="搜尋商品..." class="search-input" />
    
    <!-- 🏷️ 單選類別 -->
    <select v-model="selectedCategory" class="category-select">
        <option :value="null">所有類別</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
        </option>
    </select>

    <!-- 🏷️ 多選標籤 -->
    <div class="tags-container">
        <label v-for="tag in tags" :key="tag.id" class="tag-checkbox">
        <input type="checkbox" v-model="selectedTags" :value="tag" /> {{ tag.name }}
        </label>
    </div>

    <!-- 🔍 搜尋按鈕 -->
    <button @click="updateSearch" class="search-button">搜尋</button>
    </div>
</div>
</template>

<style scoped>
.search-input {
flex: 1;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
}

.category-select {
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
}

.tags-container {
display: flex;
gap: 5px;
}

.tag-checkbox {
display: flex;
align-items: center;
cursor: pointer;
}

.search-button {
background-color: #007bff;
color: white;
border: none;
padding: 8px 12px;
border-radius: 5px;
cursor: pointer;
}
</style>
