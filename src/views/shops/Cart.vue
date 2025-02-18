<template>
  <div>
    <h2>我的購物車</h2>

    <!-- 顯示購物車空或非空 -->
    <div v-if="cart.length === 0">
      <p>購物車是空的！</p>
    </div>
    
    <div v-else>
      <!-- 顯示每個商品 -->
      <div class="cart-items-grid">
        <div v-for="item in cart" :key="item.cartItemId" class="cart-item">
          <input type="checkbox" v-model="selectedItems" :value="item.cartItemId" class="cart-checkbox" />
          
          <!-- 顯示商品圖片 -->
<<<<<<< HEAD
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
=======
          <img v-if="item.product?.productImage" :src="getProductImage(item.product.productId)" class="product-image" alt="Product Image" />
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
          
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
            
            <!-- 更新數量按鈕 -->
            <button @click="syncQuantityWithDatabase(item)" class="update-btn">更新數量</button>
          </div>

          <!-- 刪除商品按鈕 -->
          <button @click="removeItem(item.cartItemId)" class="remove-btn">刪除此商品</button>
        </div>
      </div>

      <!-- 顯示總金額 -->
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart" class="clear-cart-btn">一鍵清空購物車</button>
      </div>

      <!-- 填寫交易資訊區塊 -->
      <div>
        <h3>填寫交易資訊</h3>
        <label for="creditCard">信用卡號</label>
        <input type="text" id="creditCard" v-model="creditCard" :placeholder="defaultCreditCard" />
        
        <label for="shippingAddress">寄送地址</label>
        <input type="text" id="shippingAddress" v-model="shippingAddress" :placeholder="defaultShippingAddress" />
        
        <button @click="goToPayment" class="go-to-payment-btn">前往交易明細</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCartStore } from '@/stores/cartStore'; // 使用 Pinia Store
import { useRouter } from 'vue-router';
<<<<<<< HEAD
import { axiosapi3 } from "@/plugins/axios.js";
import useProductStore from "@/stores/productStore"; // 引入 Product Store

// 初始化 API URL 和 Pinia Store
const cartStore = useCartStore();
const productStore = useProductStore();
=======
import { axiosapi } from "@/plugins/axios.js";

// 初始化 API URL 和 Pinia Store
const cartStore = useCartStore();
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
const router = useRouter();

// 確保 cart 有默認值
const cart = computed(() => cartStore.cart || []);
const selectedItems = ref([]);

// 設置預設的交易資訊
const defaultCreditCard = '4311-9511-1111-1111';
const defaultShippingAddress = '123 Main St';
const creditCard = ref(defaultCreditCard);
const shippingAddress = ref(defaultShippingAddress);

<<<<<<< HEAD

=======
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
// 計算總價格
const totalPrice = computed(() => {
  return cart.value
    .filter(item => selectedItems.value.includes(item.cartItemId))
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

// 獲取商品圖片
const productImages = ref({}); // 存儲商品圖片 URL
const getProductImage = async (productId) => {
  if (productImages.value[productId]) {
    return productImages.value[productId]; // 如果已經有圖片 URL，直接返回
  }
  try {
<<<<<<< HEAD
    const response = await axiosapi3.get(`/product/images/${productId}`);
=======
    const response = await axiosapi.get(`/product/images/${productId}`);
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
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
<<<<<<< HEAD
    const memberId = 1; // 獲取會員 ID
    const cartId = 1; // 使用動態 cartId
    await axiosapi3.post(`/pages/cart/add`, {
=======
    const memberId = localStorage.getItem('memberId') || sessionStorage.getItem('memberId'); // 獲取會員 ID
    const cartId = cartStore.cartId; // 使用動態 cartId
    await axiosapi.post(`/pages/cart/add`, {
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
      memberId: memberId,
      productId: item.product.productId,
      quantity: item.editQuantity,
      cartId: cartId, // 使用動態 cartId
    });
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
<<<<<<< HEAD
      const memberId = 1; // 獲取會員 ID
      const cartId = 1; // 使用動態 cartId
      await axiosapi3.delete(`/pages/cart/clear/${memberId}`);
=======
      const memberId = localStorage.getItem('memberId') || sessionStorage.getItem('memberId'); // 獲取會員 ID
      const cartId = cartStore.cartId; // 使用動態 cartId
      await axiosapi.delete(`/pages/cart/clear/${memberId}`);
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
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
<<<<<<< HEAD
      await axiosapi3.delete(`/pages/cart/delete/${cartItemId}`);
=======
      await axiosapi.delete(`/pages/cart/delete/${cartItemId}`);
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
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
<<<<<<< HEAD
    const memberId = 1;
=======
    const memberId = localStorage.getItem('memberId') || sessionStorage.getItem('memberId');
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
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
<<<<<<< HEAD
    await axiosapi3.post(`/orders/submit`, orderData); // 使用 axios 發送請求
=======
    await axiosapi.post(`/orders/submit`, orderData); // 使用 axios 發送請求
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086

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
<<<<<<< HEAD

      // 如果購物車商品沒有 imageUrls，從 productStore 中獲取
      if (!item.product?.imageUrls) {
        const product = productStore.products.find(p => p.productId === item.product.productId);
        if (product) {
          item.product.imageUrls = product.imageUrls;
        }
      }
=======
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
    });
  } catch (error) {
    console.error('獲取購物車數據失敗:', error);
    alert('獲取購物車數據失敗，請稍後重試！');
  }
});
</script>

<style scoped>
/* 版面設定 */
.cart-items-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 九宮格布局 */
  gap: 20px;
  padding: 20px;
}

.cart-item {
  border: 2px solid #FFFD77;
  background-color: #FEBA07;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

<<<<<<< HEAD
.thumbnail-container {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.thumbnail {
  width: 50px;
  height: 50px;
}

=======
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
.quantity-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.quantity-input {
  width: 60px;
  padding: 5px;
}

.remove-btn {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.update-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.clear-cart-btn {
  background-color: #D0CCD0;
  color: black;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 20px;
}

.go-to-payment-btn {
  background-color: #FFFD77;
  color: black;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  opacity: 0.8;
}
</style>