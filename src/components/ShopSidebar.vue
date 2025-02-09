<script setup>
import { ref, computed, defineProps, defineEmits,watch } from "vue";
import useProductStore from "@/stores/productStore";

// 接收來自 `ShopLayout.vue` 的 `props`
const props = defineProps({
  products:Array,
  categories: Array,
  tags: Array,
});

// 傳遞給子組件 shopHome.vue
const emit = defineEmits(["update-filter"]);

const productStore = useProductStore();
const selectedCategory = ref(null); // 選擇分類 (單選)
const selectedTags = ref([]); // 選擇標籤（多選）
const searchQuery = ref("");

const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId);
  if (index !== -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tagId);
  }
};

// 執行搜尋
const searchProducts = () => {
  productStore.searchProducts();
};

// **計算** 商品的最低與最高價格
const minPrice = computed(() =>
  props.products.length ? Math.min(...props.products.map(p => p.salePrice)) : 0
);
const maxPrice = computed(() =>
  props.products.length ? Math.max(...props.products.map(p => p.salePrice)) : 5000
);

// 固定的價格範圍
const priceRange = computed(() => [minPrice.value, maxPrice.value]);

// 動態選擇的價格範圍
const selectedPriceRange = ref([minPrice.value, maxPrice.value]); 

// ✅ 在 ShopLayout.vue 監聽 update-filter 事件，並更新篩選後的商品
const applyFilter = () => {
  emit("update-filter", {
    searchQuery: searchQuery.value,
    category: selectedCategory.value,
    tags: selectedTags.value,
    priceRange: selectedPriceRange.value
  });
};

// 監聽 `props.products` 變化，當產品變動時同步更新 `selectedPriceRange`
watch(
  () => props.products,
  (newProducts) => {
    if (newProducts.length) {
      selectedPriceRange.value = [
        Math.min(...newProducts.map(p => p.salePrice)),
        Math.max(...newProducts.map(p => p.salePrice))
      ];
    } else {
      selectedPriceRange.value = [0, 5000]; // 預設值
    }
  },
  { deep: true, immediate: true } //避免深層對象變動時不觸發；在組件初始化時立即執行一次，讓 selectedPriceRange 能立即反映 當前產品的價格範圍。
);

// 監聽 `selectedCategory`、`selectedTags`、`searchQuery`、`selectedPriceRange` 變更時，重新搜尋商品
watch(
  [selectedCategory, selectedTags, searchQuery, selectedPriceRange],
  () => {
    productStore.searchProducts({
      category: selectedCategory.value,
      tags: selectedTags.value,
      query: searchQuery.value,
      minPrice: selectedPriceRange.value[0],
      maxPrice: selectedPriceRange.value[1]
    });
  },
  { deep: true }
);

</script>

<template>
  <aside class="shop-filters">
    <!-- 🔹 商品搜尋 -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入商品關鍵字..." @keyup.enter="searchProducts" />
      
    </div>

    <!-- 🔹 商品分類 -->
    <div class="category-filter">
      <label class="form-label">商品分類</label>
      <select v-model="selectedCategory" class="form-select">
        <option :value="null">全部</option>
        <option v-for="category in props.categories" :key="category.categoryId" :value="category.categoryId">
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <!-- 🔹 多選標籤 -->
    <div class="tag-filter">
      <label class="form-label">篩選標籤</label>
      <div class="tag-list">
        <button
          v-for="tag in props.tags"
          :key="tag.tagId"
          class="btn btn-outline-secondary"
          :class="{ 'btn-primary': selectedTags.includes(tag.tagId) }"
          @click="toggleTag(tag.tagId)"
        >
        {{ tag.tagName }}
        </button>
      </div>
    </div>

    <!-- 價格範圍滑桿 -->
    <div>
      <input type="range" class="form-range" v-model="priceRange[0]" :min="minPrice" :max="maxPrice" />
      <input type="range" class="form-range" v-model="priceRange[1]" :min="minPrice" :max="maxPrice" />

      <!-- 顯示選擇的價格範圍 -->
      <p>價格範圍：{{ priceRange[0] }} - {{ priceRange[1] }}</p>
    </div>

    <div>
      <button class="btn btn-primary" @click="searchProducts">搜尋
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
