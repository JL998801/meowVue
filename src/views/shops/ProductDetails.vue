<template>
  <div v-if="selectedProduct">
    <h1>{{ selectedProduct.productName }}</h1>
    <!-- <img v-show="selectedProduct?.images?.length > 0" 
       :src="selectedProduct.images?.[0]" 
       alt="商品圖片" /> -->
    <img v-if="selectedProduct && selectedProduct.   images && selectedProduct.images.length > 0"
    :src="selectedProduct.images[0]" 
    alt="商品圖片" />
  </div>
  <div v-else>
    <p>正在載入商品資料...</p>
  </div>

  <div class="product-detail-container">
    <!-- 當 selectedProduct.images 存在時才會執行 v-for，避免 Invalid end tag 問題 -->
    <div class="product-images" v-if="selectedProduct && selectedProduct.images && selectedProduct.images.length > 0">
      <!-- 左側縮圖列表 -->
      <div class="thumbnail-list">
        <img 
          v-for="(image, index) in selectedProduct.images" 
          :key="index" 
          :src="image" 
          alt="商品圖片" 
          class="thumbnail" 
          @click="selectedImage = image"
        />
      </div>
      <div class="main-image">
        <img :src="selectedImage" alt="商品主圖片" />
      </div>
    </div>

    <div class="product-info">
      <h1>{{ selectedProduct.productName }}</h1>
      <p class="description">{{ selectedProduct.description }}</p>

      <div class="product-meta">
        <div class="price">
          <span class="current-price">NT${{ selectedProduct.salePrice }}</span>
          <span class="original-price">NT${{ selectedProduct.originalPrice }}</span>
        </div>
        <div class="stock-status">
          <span v-if="selectedProduct && selectedProduct.stockQuantity > 0">
            庫存數量: {{ selectedProduct.stockQuantity }}{{ selectedProduct.unit }}
          </span>
          <span v-else class="sold-out">售完</span>
        </div>
      </div>

      <button @click="addToCart" class="add-to-cart">加入購物車</button>
      <button @click="goToShopDetail" class="add-to-cart">前往交易清單</button>
    </div>

    <ProductCard :product="selectedProduct" displayMode="all" />

    <div class="product-details">
      <nav class="tabs">
        <span @click="activeTab = 'description'" :class="{ active: activeTab === 'description' }">商品描述</span>
        <span @click="activeTab = 'shipping'" :class="{ active: activeTab === 'shipping' }">送貨及付款方式</span>
        <span @click="activeTab = 'reviews'" :class="{ active: activeTab === 'reviews' }">顧客評價</span>
      </nav>

      <div v-if="activeTab === 'description'">
        <p>{{ selectedProduct.description }}</p>
      </div>
      <div v-if="activeTab === 'shipping'">
        <p>運送方式及付款方式...</p>
      </div>
      <div v-if="activeTab === 'reviews'">
        <p>顧客評價...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import useProductStore from "@/stores/productStore";
import useCartStore from "@/stores/cartStore"; // 使用 Pinia 管理購物車

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const activeTab = ref("description");
const productId = computed(() => Number(route.params.id));

const selectedProduct = computed(() => 
  productStore.products.find((product) => product.productId === productId.value) || null
);

watch(() => productStore.products, (newProducts) => {
  selectedProduct.value = newProducts.find(
    (product) => product.productId === Number(route.params.id)
  ) || null;
}, { immediate: true });

// 預設圖片
const selectedImage = computed(() => 
  selectedProduct.value && selectedProduct.value.images && selectedProduct.value.images.length > 0
    ? selectedProduct.value.images[0]
    : new URL("@/assets/petLogo.png", import.meta.url).href
);

// **加入購物車**
const addToCart = async () => {
  if (!selectedProduct.value) return;

  try {
    const memberId = localStorage.getItem("memberId") || 1; // 測試時使用固定 ID
    const productId = selectedProduct.value.productId;
    const quantity = 1;

    await axios.post(`${import.meta.env.VITE_API_URL}/pages/cart/add`, {
      memberId,
      productId,
      quantity,
    });

    cartStore.addToCart({ ...selectedProduct.value, quantity });
    alert("商品已成功加入購物車");
  } catch (error) {
    console.error("加入購物車失敗:", error);
    alert("加入購物車失敗，請稍後重試");
  }
};

// **跳轉到交易清單**
const goToShopDetail = () => {
  router.push(`/shop/details?cart`);
};

// 組件掛載時加載數據
onMounted(()=>{
  productStore.fetchProducts();
});
</script>

<style scoped>
.product-detail-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.product-images {
  display: flex;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
}

.thumbnail:hover {
  border-color: #fcb900;
}

.main-image img {
  width: 400px;
  height: auto;
}

.product-info {
  flex: 1;
}

.price {
  display: flex;
  gap: 10px;
}

.current-price {
  font-size: 24px;
  color: red;
}

.original-price {
  text-decoration: line-through;
  color: gray;
}

.add-to-cart {
  background-color: #fcb900;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 20px;
  cursor: pointer;
}

.tabs .active {
  font-weight: bold;
  color: #fcb900;
}
</style>
