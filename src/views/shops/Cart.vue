<template>
  <div class="container">
   <!-- ✅ 購物車列表（左側） -->
    <div class="cart-items-grid">
      <h2>我的購物車</h2>

      <!-- 顯示購物車空或非空 -->
      <div v-if="cart.length === 0">
        <p>購物車是空的！</p>
      </div>
    
      <div v-for="item in cart" :key="item.cartItemId" class="cart-item">
        <input type="checkbox" v-model="selectedItems" :value="item.cartItemId" class="cart-checkbox" />
        
        <!-- 顯示商品圖片 -->
        <div class="image-container">
          <template v-if="item.product">
            <img
              :src="item.product.imageUrls?.length > 0 ? item.product.imageUrls[0] : placeholderImage"
              alt="主商品圖片"
              class="product-image"
            />
            <div class="thumbnail-container">
              <img
                v-for="(image, index) in item.product.imageUrls?.slice(1, 5)"
                :key="index"
                :src="image"
                :alt="`商品圖片 ${index + 1}`"
                class="thumbnail"
              />
            </div>
          </template>
        </div>
        
        <!-- 右邊商品文字與數量按鈕區塊 -->
        <div class="item-details">
          <p>
            {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
            {{ item.product?.salePrice || 0 }}元 ×
            <span>{{ item.quantity }}</span>
          </p>
          
          <!-- 編輯數量輸入框 -->
          <div class="quantity-container">
            <input 
              type="number" 
              v-model.number="item.editQuantity" 
              min="0" 
              @input="validateInput(item)" 
              class="quantity-input"
              :placeholder="item.editQuantity || 0"
            />
            <div  class="button-group">
              <button @click="syncQuantityWithDatabase(item)" class="update-btn">更新數量</button>
              <button @click="removeItem(item.cartItemId)" class="remove-btn">刪除此商品</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 顯示總金額 -->
      <div>
        <p class="total-price">選取商品總金額: {{ totalPrice }} 元</p>
        <button @click="clearCart" class="clear-cart-btn">一鍵清空購物車</button>
      </div>
    </div>

     <!-- ✅ 交易資訊（右側） -->
    <div class="trade-content">
      <h3>填寫交易資訊</h3>
        <label for="creditCard">信用卡號</label>
        <input type="text" id="creditCard" v-model="creditCard" :placeholder="defaultCreditCard" />
        
        <label for="shippingAddress">寄送地址</label>
        <input type="text" id="shippingAddress" v-model="shippingAddress" :placeholder="defaultShippingAddress" />
        
        <button @click="goToPayment" class="go-to-payment-btn">前往交易明細</button>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cartStore'; // 使用 Pinia Store
import { useRouter } from 'vue-router';
import { axiosapi3 } from "@/plugins/axios.js";
import useProductStore from "@/stores/productStore"; // 引入 Product Store

// 初始化 API URL 和 Pinia Store
const cartStore = useCartStore();
const productStore = useProductStore();
const router = useRouter();

// 確保 cart 有默認值
const cart = computed(() => cartStore.cart || []);
const selectedItems = ref([]);

// 設置預設的交易資訊
const defaultCreditCard = '4311-9511-1111-1111';
const defaultShippingAddress = '123 Main St';
const creditCard = ref(defaultCreditCard);
const shippingAddress = ref(defaultShippingAddress);

// 計算總價格
// const totalPrice = computed(() => {
//   return cart.value
//     .filter(item => selectedItems.value.includes(item.cartItemId))
//     .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
// });

// 考慮 使用者更新數量後的總價格變化
const totalPrice = computed(() => {
  return cart.value
    .filter(item => selectedItems.value.includes(item.cartItemId))
    .reduce((total, item) => total + (item.product?.salePrice || 0) * (item.editQuantity || 0), 0);
});


// 獲取商品圖片
const productImages = ref({}); // 存儲商品圖片 URL
const getProductImage = async (productId) => {
  if (productImages.value[productId]) {
    return productImages.value[productId]; // 如果已經有圖片 URL，直接返回
  }
  try {
    const response = await axiosapi3.get(`/product/images/${productId}`);
    const primaryImage = response.data.find(image => image.isPrimary);
    if (primaryImage) {
      productImages.value[productId] = primaryImage.imageUrl; // 存儲圖片 URL
      return primaryImage.imageUrl;
    }
  } catch (error) {
    console.error('獲取商品圖片失敗:', error);
  }
  return ''; // 如果沒有圖片，返回空字符串
};

// 同步數量到後端
const syncQuantityWithDatabase = async (item) => {
  try {
    if (item.editQuantity < 0 || isNaN(item.editQuantity)) {
      alert('商品數量不能小於0');
      item.editQuantity = 0;
      return;
    }
    const memberId = 1; // 獲取會員 ID
    const cartId = 1; // 使用動態 cartId
    await axiosapi3.post(`/pages/cart/add`, {
      memberId: memberId,
      productId: item.product.productId,
      quantity: item.editQuantity,
      cartId: cartId, // 使用動態 cartId
    });
      // ✅ 更新購物車內的數量
      item.quantity = item.editQuantity;

      // ✅ 確保圖片不會被清空
      if (!item.product.imageUrls || item.product.imageUrls.length === 0) {
        const productData = productStore.products.find(p => p.productId === item.product.productId);
        if (productData) {
          item.product.imageUrls = productData.imageUrls;
        }
      }
    
      // ✅ 重新計算總金額
      cartStore.updateQuantity({ cartId: item.cartItemId, quantity: item.editQuantity });
      await cartStore.fetchCartDataFromServer();
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    alert('更新購物車數量失敗，請稍後重試！');
  }
};

// 清空購物車
const clearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    try {
      const memberId = 1; // 獲取會員 ID
      const cartId = 1; // 使用動態 cartId
      await axiosapi3.delete(`/pages/cart/clear/${memberId}`);
      cartStore.clearCart();
      await cartStore.fetchCartDataFromServer();
    } catch (error) {
      console.error('清空購物車失敗:', error);
      alert('清空購物車失敗，請稍後重試！');
    }
  }
};

// 移除單個商品
const removeItem = async (cartItemId) => {
  if (cartItemId && confirm('確定要刪除此商品嗎？')) {
    try {
      await axiosapi3.delete(`/pages/cart/delete/${cartItemId}`);
      cartStore.removeFromCart(cartItemId);
      await cartStore.fetchCartDataFromServer();
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

const goToPayment = async () => {
  try {
    // 從 localStorage 或 sessionStorage 中獲取 memberId
    const memberId = 1;
    const selectedCartItems = cart.value.filter(item => selectedItems.value.includes(item.cartItemId));

    if (selectedCartItems.length === 0) {
      alert('請至少勾選一個商品進行結帳');
      return;
    }

    // 從後端或本地存儲中獲取 cartId (可能是購物車的 ID)
    const cartId = localStorage.getItem('cartId') || sessionStorage.getItem('cartId') || 1;  // 若無 cartId，則使用默認值

    const orderData = {
      cartId: cartId, // 確保 cartId 為從本地存儲獲得的動態值
      memberId: memberId, // 使用 memberId 來替代 member
      creditCard: creditCard.value,
      shippingAddress: shippingAddress.value,
      selectedItems: selectedCartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        cartId: cartId, // 確保 cartId 保持一致
      })),
    };

    console.log("發送的訂單資訊:", orderData);

    // 發送請求到後端提交訂單
    await axiosapi3.post(`/orders/submit`, orderData); // 使用 axios 發送請求

    alert('訂單提交成功！');
    router.push('/shop/details');
  } catch (error) {
    console.error('提交訂單失敗:', error);
    alert('提交訂單失敗，請稍後重試！');
  }
};

// 組件掛載時獲取購物車數據
onMounted(async () => {
  try {
    // 確保 fetchCartDataFromServer 正確執行
    await cartStore.fetchCartDataFromServer();
    cart.value.forEach(item => {
      item.editQuantity = item.quantity || 0; // 初始化 editQuantity

      // 如果購物車商品沒有 imageUrls，從 productStore 中獲取
      if (!item.product?.imageUrls) {
        const product = productStore.products.find(p => p.productId === item.product.productId);
        if (product) {
          item.product.imageUrls = product.imageUrls;
        }
      }
    });
  } catch (error) {
    console.error('獲取購物車數據失敗:', error);
    alert('獲取購物車數據失敗，請稍後重試！');
  }
});

// 若 imageUrls 丟失，重新取得
watch(cart, async () => {
  cart.value.forEach(item => {
    if (!item.product?.imageUrls || item.product.imageUrls.length === 0) {
      const productData = productStore.products.find(p => p.productId === item.product.productId);
      if (productData) {
        item.product.imageUrls = productData.imageUrls;
      }
    }
  });
});

</script>

<style scoped>
/* ✅ 主要容器：讓購物車列表和交易資訊並排 */
.container {
  display: flex;
  justify-content: space-between; /* 左右排列 */
  align-items: flex-start;
  background-color: #ffffff;
  margin: 30px auto;
  width: 90%;
  max-width: 1200px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 20px; /* 左右區塊之間的間距 */
}

/* ✅ 購物車項目區塊（左側） */
.cart-items-grid {
  flex: 2; /* 佔據 2 倍的空間 */
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* ✅ 交易資訊區塊（右側） */
.trade-content {
  flex: 1; /* 佔據 1 倍的空間 */
  padding: 20px;
  background-color: #fdf5e6;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* ✅ 總金額樣式 */
.total-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
}

.cart-checkbox {
  transform: scale(1.8); /* ✅ 放大 1.8 倍 */
  margin-right: 15px;
  cursor: pointer; /* 增加可點擊感 */
}

/* ✅ 單個商品的卡片 */
.cart-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}
.cart-item:hover {
  transform: scale(1.02);
}

/* ✅ 左側圖片區塊 */
.image-container {
  flex: 1;
  max-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ✅ 主圖片 */
.product-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 5px;
}

/* ✅ 預覽縮圖 */
.thumbnail-container {
  display: flex;
  gap: 5px;
}
.thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid #ddd;
}

/* ✅ 右側商品資訊 */
.item-details {
  flex: 2;
  padding-left: 15px;
}

.item-details p {
  margin: 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.total-price{
  font-size: larger;
  text-align: center;
}

/* ✅ 數量調整區 */
.quantity-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.quantity-input {
  width: 50px;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}


/* ✅ 操作按鈕區塊（橫向排列） */
.button-group {
  display: flex;
  justify-content: flex-end; /* 讓按鈕靠右對齊 */
  gap: 15px; /* 讓按鈕之間有更大的間距 */
  margin-top: 10px;
}

/* ✅ 操作按鈕 */
.update-btn,
.remove-btn {
  padding: 6px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.update-btn {
  background-color: #007bff;
  color: white;
}
.remove-btn {
  background-color: #dc3545;
  color: white;
}
.update-btn:hover {
  background-color: #0056b3;
}
.remove-btn:hover {
  background-color: #c82333;
}

/* ✅ 購物車總金額 */
.total-price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}

/* ✅ 底部結帳按鈕 */
.clear-cart-btn,
.go-to-payment-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background 0.2s;
}
.clear-cart-btn {
  background-color: #6c757d;
  color: white;
}
.go-to-payment-btn {
  background-color: #ffc107;
  color: black;
}
.clear-cart-btn:hover {
  background-color: #5a6268;
}
.go-to-payment-btn:hover {
  background-color: #e0a800;
}

/* ✅ 響應式設計：當螢幕較小時，改為垂直排列 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .cart-items-grid, .trade-content {
    width: 100%; /* 讓兩個區塊佔滿整個畫面 */
  }
}
</style>