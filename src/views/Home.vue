<template>
  <div>
    <h2>商品列表</h2>
    <div v-if="isLoading">正在加載商品資料...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul>
        <li v-for="(product, index) in products" :key="index">
          <h3>{{ product.productName }}</h3>
          <p>{{ product.description }}</p>
          <p>價格: {{ product.salePrice }} 元</p>

          <div>
            <label>數量:</label>
            <button @click="decreaseQuantity(index)">-</button>
            <span>{{ selectedQuantities[index] || 1 }}</span>
            <button @click="increaseQuantity(index, product.stockQuantity)">+</button>
            <button @click="addToCart(index)">加入購物車</button>
          </div>
        </li>
      </ul>

      <!-- 新增的測試按鈕 -->
      <div style="text-align: center; margin-top: 20px;">
        <button @click="testAddToCart">測試加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const products = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedQuantities = ref({});

// 獲取商品數據
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/products');
    if (response.data && Array.isArray(response.data.products)) {
      products.value = response.data.products;
    } else {
      errorMessage.value = '獲取商品資料失敗，返回的資料格式錯誤';
    }
  } catch (error) {
    console.error('獲取商品資料失敗', error);
    errorMessage.value = '獲取商品資料失敗';
  } finally {
    isLoading.value = false;
  }
};

// 獲取會員ID
const getMemberId = () => {
  return 1; // 假設會員ID為1
};

// 增加商品數量
const increaseQuantity = (index, stockQuantity) => {
  if (!selectedQuantities.value[index]) {
    selectedQuantities.value[index] = 1;
  }
  if (selectedQuantities.value[index] < stockQuantity) {
    selectedQuantities.value[index]++;
  }
};

// 減少商品數量，確保最低為1
const decreaseQuantity = (index) => {
  if (selectedQuantities.value[index] && selectedQuantities.value[index] > 1) {
    selectedQuantities.value[index]--;
  }
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
    const productId = index + 1; // 使用index + 1 作為商品ID
    console.log('Sending:', { memberId, productId, quantity });
    await axios.post('http://localhost:8080/pages/cart/add', {
      memberId: memberId,
      productId: productId, // 傳送固定ID
      quantity: quantity,
    });

    store.dispatch('addToCart', { ...product, quantity });
    alert('商品已加入購物車');
  } catch (error) {
    console.error('加入購物車失敗:', error);
    alert('加入購物車失敗，請稍後重試');
  }
};

// 測試加入購物車
const testAddToCart = async () => {
  try {
    const memberId = 1;
    const productId = 2; // 固定測試商品ID
    const quantity = 3;

    const response = await axios.post('http://localhost:8080/pages/cart/add', {
      memberId,
      productId,
      quantity,
    });

    console.log('測試加入購物車成功:', response.data);
    alert('測試加入購物車成功');
  } catch (error) {
    console.error('測試加入購物車失敗:', error);
    alert('測試加入購物車失敗，請稍後重試');
  }
};

// 組件掛載時加載商品
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.error {
  color: red;
}
button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 16px;
}
</style>
