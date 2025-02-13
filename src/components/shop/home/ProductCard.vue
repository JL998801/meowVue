<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import useCartStore from "../../../stores/cartStore"

// 獲取 Router
const router = useRouter();
const cartStore = useCartStore();

// 定義 Props
const props = defineProps({
  product: { type: Object, required: true },  // 接收 `ShopHome.vue` 傳來的 `product`
  displayMode: { type: String, default: "one" }, // 設定 displayMode 預設為 "one"
});

const emit = defineEmits(["add-to-cart", "add-to-wishlist"]);

// 點擊商品卡片跳轉詳情
const goToProductDetails = () => {
  if (!props.product?.productId) {
    console.error("商品 ID 不存在，無法跳轉到詳情頁");
    return;
  }
  router.push(`/shop/product/${props.product.productId}`);
};

// 加入購物車: shopHome右上角亮燈，跳出未讀訊息
// ✅ 加入購物車
const addToCart = async (product) => {
  await cartStore.addToCart(product.productId); // ✅ 觸發 `addToCart`
};

// **加入願望清單**
const handleAddToWishlist = () => {
  emit("add-to-wishlist", props.product);
};

</script>

<template>
   <div class="product-card" @click="goToProductDetails">
    <!-- 根據 displayMode 顯示所有圖片或僅顯示首圖 -->
    <div v-if="displayMode === 'all'" class="image-gallery">
      <img
        v-for="(image, index) in product.imageUrls"
        :key="index"
        :src="image || '/assets/lostcat5.png'"
        :alt="product.productName || '無圖片'"
        class="product-image"
      />
    </div>
    
    <div v-else class="single-image">
      <img
        :src="product.imageUrls?.[0] || '/assets/lostcat5.png'"
        :alt="product.productName || '無圖片'"
        class="product-image"
      />
    </div>

    <div class="product-info">
      <h3>{{ product.productName }}</h3>
      <p>{{ product.description }}</p>
      <p>價格: ${{ product.salePrice }}</p>

      <!-- 加入購物車按鈕 -->
      <button class="btn btn-primary" @click="addToCart(product)">加入購物車</button>

      <!-- 加入願望清單按鈕 -->
      <button class="btn btn-outline-danger" @click.stop="handleAddToWishlist">加入願望清單</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #ddd;
  aspect-ratio: 2 / 3
}
.product-card:hover {
  transform: scale(1.05);
}
.product-image {
  width: 100%;   /* ✅ 讓圖片自適應容器寬度 */
  height: 100px; /* ✅ 設定固定高度 */
  object-fit: cover; /* ✅ 保持比例，裁切超出部分 */

  aspect-ratio: 2 / 3 /* ✅ 自動計算高度，保持 4:3 比例 */
}
</style>
