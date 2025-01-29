<template>
  <div>
    <h2>商品列表</h2>
    <div v-if="isLoading">正在加載商品資料...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul>
        <li v-for="(product, index) in products" :key="product.productId">
          <h3>{{ product.productName }}</h3>
          <p>{{ product.description }}</p>
          <p>價格: {{ product.salePrice }} 元</p>
          <p>庫存: {{ product.stockQuantity }}</p>

          <div>
            <label>數量:</label>
            <input 
              type="number" 
              v-model="selectedQuantities[index]" 
              :min="1" 
              :max="product.stockQuantity" 
              :placeholder="1" 
            />
            <button @click="addToCart(index)">加入購物車</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

// 從環境變數中讀取 API 和 ECPay URL
const apiUrl = import.meta.env.VITE_API_URL;
const ecpayUrl = import.meta.env.VITE_ECPAY_URL;

const store = useStore();
const products = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedQuantities = ref({});

// 獲取商品數據
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/products`);
    if (response.data && Array.isArray(response.data.products)) {
      products.value = response.data.products;
    } else {
      errorMessage.value = '獲取商品資料失敗，返回的資料格式錯誤';
    }
  } catch (error) {
    console.error('獲取商品資料失敗:', error);
    errorMessage.value = '無法獲取商品資料，請稍後再試';
  } finally {
    isLoading.value = false;
  }
};

// 獲取會員ID
const getMemberId = () => {
  return 1; // 假設會員ID為1
};

// 加入購物車
const addToCart = async (index) => {
  const product = products.value[index];
  let quantity = selectedQuantities.value[index] || 1;

  if (quantity <= 0 || quantity > product.stockQuantity) {
    alert('選擇的數量無效');
    return;
  }

  try {
    const memberId = getMemberId();
    const productId = product.productId; // 使用API提供的ID
    console.log('Sending:', { memberId, productId, quantity });

    await axios.post(`${apiUrl}/pages/cart/add`, {
      memberId: memberId,
      productId: productId,
      quantity: quantity,
    });

    store.dispatch('addToCart', { ...product, quantity });
    alert('商品已成功加入購物車');
  } catch (error) {
    console.error('加入購物車失敗:', error);
    alert('加入購物車失敗，請稍後重試');
  }
};

// 組件掛載時加載商品
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
h2 {
  color: #343a40;
}

.error {
  color: red;
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
  font-size: 16px;
  margin: 0 5px;
  border-radius: 5px;
}
</style>
