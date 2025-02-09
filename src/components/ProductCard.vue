<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

// ✅ 獲取 Router
const router = useRouter();

// ✅ 定義 Props
const props = defineProps({
  product: Object,  //單個商品物件
});

// ✅ 點擊商品卡片跳轉詳情
const goToProductDetails = () => {
  if (!props.product?.productId) {
    console.error("商品 ID 不存在，無法跳轉到詳情頁");
    return;
  }
  router.push(`/shop/product/${props.product.productId}`);
};

// ✅ 觸發父組件事件 (購物車 & 願望清單)
const emit = defineEmits(["add-to-cart", "add-to-wishlist"]);
</script>

<template>
  <div class="product-card" @click="goToProductDetails">
    <img :src="product.image" :alt="product.productName" class="product-image" />

    <div class="product-info">
      <h5>{{ product.productName }}</h5>
      <p>${{ product.price }}</p>

      <!-- 加入購物車按鈕 -->
      <button class="btn btn-primary" @click.stop="emit('add-to-cart', product)">🛒 加入購物車</button>

      <!-- 加入願望清單按鈕 -->
      <button class="btn btn-outline-danger" @click.stop="emit('add-to-wishlist', product)">💖 加入願望清單</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.product-card:hover {
  transform: scale(1.05);
}
.product-image {
  width: 100%;
  height: auto;
}
</style>
