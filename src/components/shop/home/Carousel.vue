<script setup>
import { ref, computed, defineProps,onUnmounted, onMounted} from "vue";

const props = defineProps({
  products: Array,
});

// ✅ 當 `products` 陣列為空時，避免存取錯誤
const currentIndex = ref(0);

let interval = null;

// 🔹 設定每 2 秒自動輪播
const startAutoSlide = () => {
  interval = setInterval(() => {
    nextSlide();
  }, 3000);
};

const stopAutoSlide = () => {
  clearInterval(interval);
};

// 🔹 組件卸載時清除計時器
onUnmounted(() => {
  stopAutoSlide();
});

// 🔹 當組件掛載時開始輪播
onMounted(() => {
  startAutoSlide();
});

// 🔹 組件卸載時清除計時器
onUnmounted(() => {
  stopAutoSlide();
});

// 🔹 計算要顯示的 3 個商品
const visibleProducts = computed(() => {
  if (props.products.length === 0) return [];
  return [
    props.products[currentIndex.value],
    props.products[(currentIndex.value + 1) % props.products.length],
    props.products[(currentIndex.value + 2) % props.products.length],
  ];
});

// 🔹 計算目前要顯示的商品（避免 `undefined` 錯誤）
const currentProduct = computed(() => props.products?.[currentIndex.value] || {});

// 🔹 上一張幻燈片
const prevSlide = () => {
  if (props.products.length > 0) {
    currentIndex.value =
      (currentIndex.value - 1 + props.products.length) % props.products.length;
  }
};

// 🔹 下一張幻燈片
const nextSlide = () => {
  if (props.products.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.products.length;
  }
};
</script>

<template>
  <div class="carousel-container">
    <button class="prev-btn" @click="prevSlide"><font-awesome-icon :icon="['far', 'angles-left']" style="color: #FFD43B;" /></button>

    <div class="carousel-slide">
      <div 
        v-for="(product, index) in visibleProducts" 
        :key="index" 
        class="product-item"
      >
        <img 
          :src="product?.imageUrls?.[0] || '/assets/lostcat5.png'" 
          :alt="product?.productName || '商品圖片'" 
          class="product-image"
        />
        <p class="product-name">{{ product?.productName || "商品名稱" }}</p>
      </div>
    </div>

    <button class="next-btn" @click="nextSlide"><font-awesome-icon :icon="['fas', 'angles-right']" style="color: #FFD43B;" /></button>
  </div>
</template>

<style scoped>
/* 🔹 輪播容器 */
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  position: relative;
}

/* 🔹 輪播區域 */
.carousel-slide {
  display: flex;
  gap: 15px;
  overflow: hidden;
  width: 80%;
}

/* 🔹 商品項目 */
.product-item {
  flex: 1;
  width: 30%; /* 讓 3 個 item 各佔 1/3 */
  max-width: calc(100% / 3);
  text-align: center;
}

/* 🔹 商品圖片 (固定寬高，確保滿版) */
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover; /* 讓圖片不變形，滿版顯示 */
  border-radius: 8px;
}
</style>
