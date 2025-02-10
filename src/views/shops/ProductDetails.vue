<template>
    <div v-if="selectedProduct">
    <h1>{{ selectedProduct.productName }}</h1>
    <img v-if="selectedProduct.images?.length > 0" :src="selectedProduct.images[0]" alt="商品圖片" />
  </div>
  <div v-else>
    <p>正在載入商品資料...</p>
  </div>
  <div class="product-detail-container">
    <div class="product-images">
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

      <!-- 主要商品圖片 -->
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
          <span v-if="selectedProduct.stockQuantity > 0">庫存充足</span>
          <span v-else class="sold-out">售完</span>
        </div>
      </div>

      <button @click="addToCart(selectedProduct)" class="add-to-cart">加入購物車</button>
    </div>

    <!-- 商品卡片 -->
    <ProductCard :product="selectedProduct" displayMode="all" />

    <!-- 商品詳情區塊 -->
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const selectedProduct = ref(null);
const selectedImage = ref("");
const activeTab = ref("description");

// 加入購物車功能
const addToCart = (product) => {
  console.log(`加入購物車: ${product.productName}`);
  alert("商品已加入購物車");
};

// 獲取商品詳情: 從shopLayout父組件獲取商品詳情



// 組件掛載時加載數據
onMounted();
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
