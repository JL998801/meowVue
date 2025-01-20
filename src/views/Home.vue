<template>
  <div>
    <h2>商品列表</h2>
    <div v-if="isLoading">正在加載商品資料...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul>
        <li v-for="(product, index) in products" :key="product.id">
          <h3>{{ product.productName }}</h3>
          <p>{{ product.description }}</p>
          <p>價格: {{ product.salePrice }} 元</p>
          
          <div>
            <label for="quantity">數量:</label>
            <input type="number" v-model="selectedQuantities[product.id]" :min="1" :max="product.stockQuantity" />
            <button @click="addToCart(product, index)">加入購物車</button>
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

// 获取商品数据
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

// 获取会员ID（可以从 Vuex 或其他地方动态获取）
const getMemberId = () => {
  return 1;  // 假设会员ID为1，可以在实际项目中通过 Vuex 或其他方式获取
};

// 添加商品到购物车（使用测试按钮的逻辑）
const addToCart = async (product, index) => {
  const quantity = selectedQuantities.value[product.id] || 1; // 获取商品数量，默认为1
  
  // 校验数量是否有效
  if (quantity <= 0 || quantity > product.stockQuantity) {
    alert('選擇的數量無效');
    return;
  }

  try {
    const memberId = getMemberId(); // 获取会员ID
    const productId = index + 1; // 根据索引固定商品ID (假设第一项是ID 1)

    // 发送请求到后端，将商品加入购物车
    await axios.post('http://localhost:8080/pages/cart/add', {
      memberId,
      productId,  // 使用位置索引来确定商品ID
      quantity,    // 商品数量
    });

    // 更新前端 store 以同步状态
    store.dispatch('addToCart', { ...product, quantity });

    // 成功后重置数量
    selectedQuantities.value[product.id] = 1;
    alert('商品已加入購物車');
  } catch (error) {
    console.error('加入購物車失敗', error);
    alert('加入購物車失敗');
  }
};

// 测试加入购物车按钮的模拟请求
const testAddToCart = async () => {
  try {
    const memberId = 1;  // 假设会员ID为1
    const productId = 2; // 假设商品ID为2
    const quantity = 3;  // 假设数量为3

    const response = await axios.post('http://localhost:8080/pages/cart/add', {
      memberId,
      productId,
      quantity,
    });

    alert('測試加入購物車成功！');
  } catch (error) {
    console.error('測試加入購物車失敗', error);
    alert('測試加入購物車失敗');
  }
};

onMounted(() => {
  fetchProducts();  // 加载商品数据
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
