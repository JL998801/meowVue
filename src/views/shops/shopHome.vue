<template>
  <div class="container">
    <h2>商品列表</h2>
    <div v-if="isLoading">正在加載商品資料...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- 商品區塊 -->
    <div v-if="!isLoading">
      <div class="row">
        <!-- 貓用品 -->
        <div class="col-md-4">
          <h3 class="text-center">🐱 貓用品</h3>
          <ProductCard 
            v-for="product in catProducts" 
            :key="product.id" 
            :product="product"
            @add-to-cart="addToCart"
            @add-to-wishlist="addToWishlist"
          />
        </div>

        <!-- 狗用品 -->
        <div class="col-md-4">
          <h3 class="text-center">🐶 狗用品</h3>
          <ProductCard 
            v-for="product in dogProducts" 
            :key="product.id" 
            :product="product"
            @add-to-cart="addToCart"
            @add-to-wishlist="addToWishlist"
          />
        </div>

        <!-- 保健品 -->
        <div class="col-md-4">
          <h3 class="text-center">💊 保健品</h3>
          <ProductCard 
            v-for="product in healthProducts" 
            :key="product.id" 
            :product="product"
            @add-to-cart="addToCart"
            @add-to-wishlist="addToWishlist"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { ProductService } from "@/services/ProductService";
import ProductCard from "@/components/ProductCard.vue"; 

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

export default {
  components: { ProductCard },
  setup() {
    const products = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref("");

    // 取得商品資料
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        products.value = data;
      } catch (error) {
        errorMessage.value = "無法獲取商品資料，請稍後再試。";
      } finally {
        isLoading.value = false;
      }
    };

    // 根據類別分類
    const catProducts = computed(() => products.value.filter(p => p.category === "cat"));
    const dogProducts = computed(() => products.value.filter(p => p.category === "dog"));
    const healthProducts = computed(() => products.value.filter(p => p.category === "health"));

    // 加入購物車
    const addToCart = (product) => {
      console.log(`加入購物車: ${product.name}`);
      // TODO: 呼叫購物車 API
    };

    // 加入願望清單
    const addToWishlist = (product) => {
      console.log(`加入願望清單: ${product.name}`);
      // TODO: 呼叫願望清單 API
    };

    onMounted(fetchProducts);

    return {
      isLoading,
      errorMessage,
      catProducts,
      dogProducts,
      healthProducts,
      addToCart,
      addToWishlist
    };
  }
};

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
