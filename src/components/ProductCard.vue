<template>
  <div class="card my-3 product-card" @click="goToProductDetails">


    <div class="card-body">
      <h5 class="card-title">{{ product.productName }}</h5>
          <!-- ✅ 依據 displayMode 來決定顯示方式 -->
    <div v-if="displayMode === 'single'">
      <img v-if="product.images.length > 0"
          :src="product.images[0]" 
          alt="商品首圖" 
          class="product-image">
      <p v-else>無商品圖片</p>
    </div>

    <div v-else-if="displayMode === 'all'">
      <img v-for="(image, index) in product.images" 
          :key="index" 
          :src="image" 
          alt="商品圖片" 
          class="product-image">
    </div>

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

      <!-- 操作按鈕，對應到js中的設定 -->
      <button class="btn btn-success mt-2 me-2" @click.stop="addToCart">加入購物車</button>
      <button class="btn btn-outline-danger mt-2" @click.stop="AddToWishlist">加入願望清單</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';

// 定義 Props
const props = defineProps({
  product: Object,
  displayMode: {
    type: String,
    default: 'single' // 預設為 "single" 模式，只顯示第一張圖片
  }
});

// 狀態管理
const quantity = ref(1);
const store = useStore();
const router = useRouter();

// 點擊卡片導向商品詳情
const goToProductDetails = () => {
  if (!props.product?.productId) {
    console.error("商品 ID 不存在，無法跳轉到詳情頁");
    return;
  }

  console.log("點擊商品:", props.product);
  router.push(`/product/${props.product.productId}`);
};

// 加入購物車--配合cart.js (待檢視)
const addToCart = (event) => {
  store.dispatch('addToCart', { ...props.product, quantity: quantity.value });
  event.stopPropagation(); // 防止點擊購物車按鈕時導向詳情
};

// 加入願望清單
const AddToWishlist = (event) => {
  console.log(`加入願望清單: ${props.product.productName}`);
  event.stopPropagation(); // 防止點擊願望清單按鈕時導向詳情
};
</script>

<style scoped>
.product-card {
  width: 350px;
  border: 2px solid #FEBA07;
  padding: 1px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100%;        
  max-width: 350px;    
  height: auto;       
  object-fit: cover;  
  border-radius: 8px; 
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
  color: #FEBA07;
}
</style>
