<template>
  <div class="product-detail-container" v-if="selectedProduct">
    <!-- ✅ 商品資訊區塊（最上方） -->
    <div class="product-info">
      <!-- 左側區塊: 1~5 張圖片 -->
      <div class="product-images" v-if="selectedProduct && selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0">
        <!-- 主要商品圖片 + 縮圖列表 -->
        <div class="main-image-container">
          <!-- 左側主圖片 -->
          <div class="main-image">
            <img :src="selectedImage" alt="商品主圖片" />
          </div>

          <!-- 下方縮圖列表 -->
          <div class="thumbnail-list">
            <img 
              v-for="(image, index) in selectedProduct.imageUrls" 
              :key="index" 
              :src="image" 
              alt="商品圖片" 
              class="thumbnail" 
              @click="selectedImage = image"
            />
          </div>
        </div>
      </div>

      <!-- 商品基本資訊 -->
      <div class="info-section">
        <h1>{{ selectedProduct.productName }}</h1>
        <p class="categoryId">分類: {{ selectedProduct.category.categoryName }}</p>
        
        <p class="tags">標籤:
          <span v-for="(tag, index) in selectedProduct.tags" :key="tag.tagId">
            {{ tag.tagName }}<span v-if="index < selectedProduct.tags.length - 1">, </span>
          </span>
        </p>

        <p class="description">{{ selectedProduct.description }}</p>

        <div class="product-meta">
          <div class="price">
            <span class="current-price">售價 NT${{ selectedProduct.salePrice }}</span>
            <span class="original-price">原價 NT${{ selectedProduct.originalPrice }}</span>
          </div>
          <div class="stock-status">
            <span v-if="selectedProduct && selectedProduct.stockQuantity > 0">
              庫存數量: {{ selectedProduct.stockQuantity }}{{ selectedProduct.unit }}
            </span>
            <span v-else class="sold-out">售完</span>
          </div>
        </div>

        <!-- 按鈕區塊 -->
        <div class="button-group">
          <button @click="addToCart(selectedProduct)" class="add-to-cart">加入購物車</button>
          <button @click="goToShopDetail(selectedProduct)" class="add-to-cart">前往結帳</button>
        </div>
      
      </div>
    </div>

    <!-- 🔹 分隔線 -->
    <hr class="section-divider">

    <!-- ✅ 商品詳情區塊（放在 product-info 之下） -->
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

  <div v-else>
    <p>正在載入商品資料...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { axiosapi } from '@/plugins/axios.js';
import useProductStore from "@/stores/productStore";

const route = useRoute();
const router = useRouter();

const activeTab = ref("description");
const productStore = useProductStore();
const productId = computed(() => Number(route.params.id)); // 取得 URL 參數中的 `productId`

// 取得 `selectedProduct`，如果 `productStore.products` 內找不到，則用 `route.query.productData`
const selectedProduct = ref(null);

// 設定 `selectedImage` 預設為第一張圖片
const selectedImage = computed(() => 
  selectedProduct.value?.imageUrls?.[0] || "/assets/no-image.png"
);

// **加入購物車功能**
const addToCart = async () => {
  if (!selectedProduct.value) return;

  try {
    const memberId = localStorage.getItem("memberId") || 1; // 先從 localStorage 讀取會員 ID，若無則使用固定 ID
    const productId = selectedProduct.value.productId;
    const quantity = 1;

    // 發送請求到後端，將會員 ID、商品 ID 和數量發送過去
    await axiosapi.post('/pages/cart/add', {
      memberId,
      productId,
      quantity,
    });

    // 將商品加入到購物車 store
    cartStore.addToCart({ ...selectedProduct.value, quantity });
    alert("商品已成功加入購物車");
  } catch (error) {
    console.error("加入購物車失敗:", error);
    alert("加入購物車失敗，請稍後重試");
  }
};

// **跳轉到結帳頁面**
const goToShopDetail = () => {
  router.push(`/details/${productId.value}?cart`);
};

// 優化顯示速度
watch(() => productId.value, async (newId) => {
  if (!newId) return;

  // 優先嘗試從 `productStore` 取得資料
  selectedProduct.value = productStore.products.find((p) => p.productId === newId);

  // 如果 `productStore` 沒有該商品，從 `route.query` 解析
  if (!selectedProduct.value && route.query.productData) {
    selectedProduct.value = JSON.parse(route.query.productData);
  }

  // 如果還是沒有數據，請求後端 API 加載
  if (!selectedProduct.value) {
    await productStore.fetchProductById(newId);
    selectedProduct.value = productStore.products.find((p) => p.productId === newId);
  }

    // ✅ 確保 `selectedImage` 預設為第一張圖片
    if (selectedProduct.value?.imageUrls?.length > 0) {
    selectedImage.value = selectedProduct.value.imageUrls[0];
  } else {
    selectedImage.value = "/assets/no-image.png"; // ✅ 若無圖片則使用預設圖
  }
}, { immediate: true });

// 如果 `selectedProduct` 為 null，則發送 API 請求加載商品資訊
onMounted(async () => {
  if (!selectedProduct.value) {
    await productStore.fetchProductById(productId.value);
  }
});
</script>

<style scoped>
/* ✅ 限制最大寬度，避免全幅 */
.product-detail-container {
  max-width: 1200px; /* ✅ 設定最大寬度 */
  width: 90%; /* ✅ 在小螢幕時佔 90% */
  margin: 0 auto; /* ✅ 讓內容置中 */
  padding: 20px;
  background: white;
  border-radius: 10px; /* ✅ 增加圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* ✅ 讓 `product-info` 採用兩欄排版 */
.product-info {
  display: flex;
  flex-wrap: wrap; /* ✅ 小螢幕時換行 */
  gap: 50px;
  align-items: flex-start;
}

/* 左側圖片區 */
.product-images {
  display: flex;
  flex-direction: row-reverse; /* ✅ 讓縮圖區在右側，主圖片區在左側 */
  align-items: center;
  flex-shrink: 0; /* ✅ 防止壓縮 */
  gap: 10px; /* 設定左右間距 */
}

/* ✅ 主圖片 + 縮圖列表的容器 */
.main-image-container {
  display: flex;
  flex-direction: column; /* 讓縮圖區塊在主圖片下方 */
  align-items: center; /* 讓內容置中 */
  min-height: 480px; /* 確保主圖片 + 縮圖列表區塊有足夠高度 */
  gap: 10px; /* 設定間距 */
}

/* ✅ 右側縮圖列表 */
.thumbnail-list {
  display: flex;
  flex-wrap: nowrap; /* ✅ 確保縮圖不會換行 */
  overflow-x: auto; /* 允許超出時水平滾動 */
  justify-content: center;
  min-height: 80px; /* 讓縮圖區塊最小 80px 高度 */
  padding: 5px 0;
  gap: 10px;
}

/* ✅ 調整縮圖樣式 */
.thumbnail {
  width: 80px; /* 固定寬度 */
  height: 80px; /* 固定高度 */
  object-fit: cover; /* 保持比例，裁剪超出部分 */
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px; /* 加入圓角 */
  transition: border-color 0.2s;
}

/* ✅ 縮圖 hover 與選中效果 */
.thumbnail:hover, .thumbnail:focus {
  border-color: #fcb900;
}

/* ✅ 左側主圖片 */
.main-image {
  flex-grow: 1; /* 讓主圖片區填滿剩餘空間 */
  display: flex;
  justify-content: center;
}

.main-image img {
  width: 400px; /* 設定主圖片固定寬度 */
  max-height: 400px; /* ✅ 限制最大高度，避免影響其他元素 */
  object-fit: cover; /* ✅ 確保圖片比例正確 */
  border-radius: 8px;
  transition: opacity 0.3s ease-in-out; /* 讓切換圖片時有過渡效果 */
}

/* 右側資訊區 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
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

/* 讓按鈕左右並排，並且增加間距 */
.button-group {
  display: flex;
  justify-content: space-between;  /* 按鈕均分寬度 */
  gap: 20px;  /* 設定按鈕之間的距離 */
  margin-top: 20px;  /* 上方留白 */
}

/* ✅ 統一按鈕樣式 */
.add-to-cart, .checkout {
  flex: 1;  /* 讓按鈕填滿可用空間 */
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

/* ✅ 購物車按鈕樣式 */
.add-to-cart {
  background-color: #fcb900;
  color: white;
}

/* ✅ 前往結帳按鈕樣式 */
.checkout {
  background-color: #007bff;
  color: white;
}

/* ✅ 按鈕 hover 效果 */
.add-to-cart:hover {
  background-color: #e6a500;
}

.checkout:hover {
  background-color: #0056b3;
}

/* 🔹 分隔線樣式 */
.section-divider {
  width: 100%; /* 讓分隔線佔滿整個容器 */
  border: none; /* 移除預設邊框 */
  height: 2px; /* 設定線條厚度 */
  background-color: #ddd; /* 設定線條顏色 */
  margin: 30px 0; /* 設定上下間距 */
}

/* ✅ 商品詳情區塊 */
.product-details {
  margin-top: 40px; /* ✅ 讓它與 `product-info` 分開 */
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

/* ✅ 響應式設計 */
@media (max-width: 768px) {
  .product-info {
    flex-direction: column;
    align-items: center;
  }
  .product-images {
    width: 100%;
  }
  .button-group {
    flex-direction: column; /* 手機版讓按鈕堆疊 */
  }
}
</style>
