<template>
  <div class="card my-3 product-card" @click="goToProductDetails">
    <img :src="getProductImageUrl(product)" class="card-img-top" alt="商品圖片" />
    <div class="card-body">
      <h5 class="card-title">{{ product.productName }}</h5>
      <p class="card-text">價格: {{ product.salePrice }} 元</p>
      <p class="card-text">庫存: {{ product.stockQuantity }} </p>
      <p class="card-text">單位: {{ product.unit }} </p>

      <!-- 數量選擇 -->
      <div class="d-flex align-items-center">
        <label class="me-2">數量:</label>
        <input 
          type="number" 
          v-model="quantity" 
          min="1" 
          :max="product.stockQuantity" 
          class="form-control w-25 me-2"
          @click.stop
        />
      </div>

      <!-- 操作按鈕 -->
      <button class="btn btn-success mt-2 me-2" @click.stop="handleAddToCart">加入購物車</button>
      <button class="btn btn-outline-danger mt-2" @click.stop="handleAddToWishlist">加入願望清單</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';

// 定義 Props
const props = defineProps({
  product: Object
});

// 狀態管理
const quantity = ref(1);
const store = useStore();
const router = useRouter();

// 點擊卡片導向商品詳情
const goToProductDetails = () => {
  console.log("點擊商品:", props.product);
  router.push(`/shop/details/${props.product.productId}`);
};

const getProductImageUrl = (product) => {
  if (!product.imageUrls || product.imageUrls.length === 0) {
    return "/images/default.jpg"; // ✅ 確保 Vue 顯示預設圖片
  }
  return product.imageUrls[0]; // ✅ 顯示第一張圖片
};

// 加入購物車
const handleAddToCart = (event) => {
  store.dispatch('addToCart', { ...props.product, quantity: quantity.value });
  event.stopPropagation(); // 防止點擊購物車按鈕時導向詳情
};

// 加入願望清單
const handleAddToWishlist = (event) => {
  console.log(`加入願望清單: ${props.product.productName}`);
  event.stopPropagation(); // 防止點擊願望清單按鈕時導向詳情
};
</script>

<style scoped>
.product-card {
  border: 1px solid #FEBA07;
  padding: 20px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.02);
}

button {
  background-color: #c6bc77;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #716f71;
  color: #fffD77;
}
</style>
