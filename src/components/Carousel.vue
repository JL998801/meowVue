<script setup>
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  products: Array,
});

// ✅ 當 `products` 陣列為空時，避免存取錯誤
const currentIndex = ref(0);

// 🔹 計算目前要顯示的商品（避免 `undefined` 錯誤）
const currentProduct = computed(() => props.products?.[currentIndex.value] || {});

// 🔹 確保索引變更時不會超出 `products` 陣列範圍
const nextSlide = () => {
  if (props.products.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.products.length;
  }
};

// 🔹 上一張幻燈片
const prevSlide = () => {
  if (props.products.length > 0) {
    currentIndex.value =
      (currentIndex.value - 1 + props.products.length) % props.products.length;
  }
};
</script>

<template>
  <div class="carousel-container">
    <button class="prev-btn" @click="prevSlide">⬅</button>

    <div class="carousel-slide" v-if="props.products.length > 0">
      <img :src="currentProduct?.imageUrls?.[0] || '/assets/lostcat5.png'"
           :alt="currentProduct?.productName || '商品圖片'"
           class="product-image" />
      <h3>{{ currentProduct?.productName || "未提供名稱" }}</h3>
      <p>{{ currentProduct?.description || "無描述" }}</p>
    </div>

    <button class="next-btn" @click="nextSlide">➡</button>
  </div>
</template>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.carousel-slide {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
