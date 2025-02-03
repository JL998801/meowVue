<template>
  <div class="container">
    <h2 class="text-center my-4">商品分類</h2>

    <!-- 錯誤訊息與載入提示 -->
    <div v-if="isLoading" class="text-center">正在加載商品資料...</div>
    <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

    <!-- 商品分類區塊 -->
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
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ProductService } from "@/services/ProductService";
import ProductCard from "@/components/ProductCard.vue"; 

const store = useStore();
const products = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// 獲取商品數據
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
  store.dispatch("addToCart", product); // Vuex 分發 action
  alert("商品已成功加入購物車");
};

// 加入願望清單
const addToWishlist = (product) => {
  console.log(`加入願望清單: ${product.name}`);
  // TODO: 呼叫願望清單 API
  alert("商品已加入願望清單");
};

onMounted(fetchProducts);
</script>

<style scoped>
h2 {
  color: #c6bc77;
}

.error {
  color: #FEBA07;
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
}
</style>
