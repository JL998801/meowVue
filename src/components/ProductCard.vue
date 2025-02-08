<template>
  <div class="card my-3 product-card" @click.stop="goToProductDetails">
    <div v-if="products.length" class="card-body">
      <div class="product-tags">
        <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div v-if="displayMode === 'single'">
        <img v-if="product.imageUrls && product.imageUrls.length > 0" 
          :src="product.imageUrls[0]" 
          alt="產品圖片" 
          class="product-image"/>
        <p v-else>無商品圖片</p>
      </div>

      <div v-else-if="displayMode === 'all'">
        <img v-for="(image, index) in product.images" 
            :key="index" 
            :src="image" 
            alt="商品圖片" 
            class="product-image">
      </div>

      <h5 class="card-title">{{ product.productName }}</h5>
      <p class="card-text">描述: {{ product.description }}</p>
      <p class="card-text">價格: {{ product.salePrice }} 元</p>
      <p class="card-text">庫存: {{ product.stockQuantity }} </p>
      <p class="card-text">單位: {{ product.unit }} </p>
      <div class="d-flex align-items-center">
        <label class="me-2">數量:</label>
        <input 
          type="number" 
          v-model="quantity" 
          min="1" 
          :max="product.stockQuantity" 
          class="form-control w-25 me-2"
          @click.stop
        />
      </div>

      <!-- 操作按鈕，對應到js中的設定 -->
      <button class="btn btn-success mt-2 me-2" 
      @click.stop="addToCart"  
      title="購物車">
        <font-awesome-icon :icon="['fas', 'cart-shopping']" size="xl" />
      </button>

      <button 
      class="btn btn-outline-danger mt-2 wish-btn" 
      data-toggle="popover" title="" data-content="已加入"
      @click.stop="AddToWishlist" 
      @mouseover="isHovered = true" 
      @mouseleave="isHovered = false" 
      >
        <font-awesome-icon v-if="!isHovered" :icon="['far', 'heart']"/>
        <font-awesome-icon v-else :icon="['fas', 'heart']" size="xl"/>
      </button>
    </div>
    <p v-else>沒有商品</p>
  </div>
</template>

<script setup>
import { ref ,defineProps,onMounted } from "vue";
import { useRouter } from "vue-router"; 
import { ProductService } from "@/services/ProductService";

const quantity = ref(1);
const isHovered = ref(false);
const router = useRouter();  // 點擊後跳轉，連接後端api資料
const products = ref([]); // ✅ 預設為空陣列

// 定義 Props
const props = defineProps({
  product: Object,
  displayMode: {
    type: String,
    default: 'single' // 預設為 "single" 模式，只顯示第一張圖片
  }
});

// 獲取商品資料
const fetchProducts = async () => {
  try {
    const response = await ProductService.getAllProducts();
    products.value = response;
  } catch (error) {
    console.error("獲取商品失敗:", error);
  }
};

// 點擊卡片導向商品詳情
const goToProductDetails = () => {
  if (!props.product?.productId) {
    console.error("商品 ID 不存在，無法跳轉到詳情頁");
    return;
  }

  console.log("點擊商品:", props.product);
  router.push(`/product/${props.product.productId}`);
};

// 加入購物車
const addToCart = (event) => {
  store.dispatch('addToCart', { ...props.product, quantity: quantity.value });
  event.stopPropagation(); // 防止點擊購物車按鈕時導向詳情
};

// 加入願望清單
const AddToWishlist = (event) => {
  console.log(`加入願望清單: ${props.product.productName}`);
  event.stopPropagation(); // 防止點擊願望清單按鈕時導向詳情
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.tag {
  background: #ffd700;
  color: #333;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;     
  border-radius: 8px;;
}

.product-card {
  width: 350px;
  border: 2px solid #FEBA07;
  padding: 1px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: scale(1.02);
}

.wish-btn {
  transition: transform 0.2s ease-in-out;
}

.wish-btn:hover {
  transform: scale(1.1);
}

</style>
