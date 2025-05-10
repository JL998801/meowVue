<template>
  <div class="product-card" @click="goToProductDetails">
    <!-- 根據 displayMode 顯示所有圖片或僅顯示首圖 -->
    <div v-if="displayMode === 'all'" class="image-gallery">
      <img
        v-for="(image, index) in product.imageUrls"
        :key="index"
        :src="image || '/assets/lostcat5.png'"
        :alt="product.productName || '無圖片'"
        class="product-image"
      />
    </div>
    
    <div v-else class="single-image">
      <img
        :src="product.imageUrls?.[0] || '/assets/lostcat5.png'"
        :alt="product.productName || '無圖片'"
        class="product-image"
      />
    </div>

    <div class="product-info">
      <h3 class="product-title">{{ product.productName }}</h3>

        <!-- 類別顯示 -->
        <p class="product-category">
          <span class="badge bg-secondary">{{ product.category?.categoryName || "未分類" }}</span>
        </p>

      <!-- 標籤顯示 -->
      <div class="product-tags">
        <span v-for="tag in product.tags || []" :key="tag.tagId" class="badge bg-primary me-1">
          {{ tag.tagName }}
        </span>
      </div>

      <!-- 商品描述，限制顯示字數 -->
      <p class="product-description">
        {{ product.description.length > 50 ? product.description.substring(0, 50) + "..." : product.description }}
      </p>

      <!-- 商品價格 -->
      <p class="product-price">價格: ${{ product.salePrice }}</p>

      <!-- 加入購物車按鈕 -->
      <button class="btn btn-primary" @click="addToCart(product)">查看商品詳情</button>

      <!-- 加入願望清單按鈕 -->
      <button class="btn btn-outline-danger" @click.stop="handleAddToWishlist(product)">加入願望清單</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import useCartStore from "../../../stores/cartStore"
import useWishListStore from "../../../stores/wishListStore"

// 獲取 Router
const router = useRouter();
const cartStore = useCartStore();
const wishListStore = useWishListStore();

// 定義 Props
const props = defineProps({
  product: { type: Object, required: true },  // 接收 `ShopHome.vue` 傳來的 `product`
  displayMode: { type: String, default: "one" }, // 設定 displayMode 預設為 "one"
});

const emit = defineEmits(["add-to-cart", "add-to-wishlist"]);

// 點擊商品卡片跳轉詳情
const goToProductDetails = () => {
  if (!props.product?.productId) {
    console.error("商品 ID 不存在，無法跳轉到詳情頁");
    return;
  }

  // 確保完整傳遞 product 物件
  router.push({
    path: `/shop/product/${props.product.productId}`,
    query: { productData: JSON.stringify(props.product) }
  });
};

// 加入購物車: shopHome右上角亮燈，跳出未讀訊息
// ✅ 加入購物車
const addToCart = async (product) => {
  cartStore.addToCart(product.productId); // ✅ 觸發 `addToCart`
};

// **加入願望清單**
const handleAddToWishlist = async(product) => {
  wishListStore(product.productId);
};
</script>

<style scoped>
/* 商品卡片樣式 */
.product-card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 250px; /* 限制最大寬度 */
  height: 100%;
}

.product-card:hover {
  transform: scale(1.05);
}

/* 商品圖片 */
.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

/* 商品資訊 */
.product-info {
  padding: 10px;
  width: 100%;
}

/* 商品名稱 */
.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 類別 */
.product-category {
  margin-bottom: 5px;
}

/* 標籤 */
.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin-bottom: 10px;
}

/* 商品描述 */
.product-description {
  font-size: 14px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

/* 商品價格 */
.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
}

/* 按鈕 */
.btn {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  margin-top: 5px;
}

</style>
