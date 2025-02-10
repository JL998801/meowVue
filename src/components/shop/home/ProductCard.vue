<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

// ✅ 獲取 Router
const router = useRouter();

// ✅ 定義 Props
const props = defineProps({
  product: Object, // ✅ 接收 `ShopHome.vue` 傳來的 `product`
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

// **點擊加入購物車**
const handleAddToCart = () => {
  emit("add-to-cart", props.product); // ✅ 發送 `add-to-cart` 事件給 `ShopHome.vue`
};

// **點擊加入願望清單**
const handleAddToWishlist = () => {
  emit("add-to-wishlist", props.product); // ✅ 發送 `add-to-wishlist` 事件給 `ShopHome.vue`
};
</script>

<template>
  <div class="product-card" @click="goToProductDetails">
    <img
      :src="product.imageUrls?.[0] || '/assets/lostcat5.png'" 
      :alt="product.productName || '無圖片'" 
      class="product-image" 
    />

    <div class="product-info">
      <h3>{{ product.productName }}</h3>
      <p>{{ product.description }}</p>
      <p>價格: ${{ product.salePrice }}</p>

      <!-- 加入購物車按鈕 -->
      <button class="btn btn-primary" @click="handleAddToCart">加入購物車</button>

      <!-- 加入願望清單按鈕 -->
      <button class="btn btn-outline-danger" @click="handleAddToWishlist">加入願望清單</button>
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
