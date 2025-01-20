<template>
  <div>
    <h2>商品列表</h2>
    <div v-if="isLoading">正在加載商品資料...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul>
        <li v-for="product in products" :key="product.id">
          <h3>{{ product.productName }}</h3>
          <p>{{ product.description }}</p>
          <p>價格: {{ product.salePrice }} 元</p>
          
          <div>
            <label for="quantity">數量:</label>
            <input type="number" v-model="selectedQuantities[product.id]" :min="1" :max="product.stockQuantity" />
            <button @click="addToCart(product)">加入購物車</button>
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

const store = useStore();
const products = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedQuantities = ref({});

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

const addToCart = (product) => {
  const quantity = selectedQuantities.value[product.id] || 1;
  if (quantity <= 0 || quantity > product.stockQuantity) {
    alert('選擇的數量無效');
    return;
  }

  store.dispatch('addToCart', { ...product, quantity });

  // Reset quantity for the product after adding to the cart
  selectedQuantities.value[product.id] = 1;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
