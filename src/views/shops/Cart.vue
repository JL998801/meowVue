<template>
  <div>
    <h2>我的購物車</h2>

    <!-- 顯示購物車空或非空 -->
    <div v-if="cart.length === 0">
      <p>購物車是空的！</p>
    </div>
    
    <div v-else>
      <!-- 顯示每個商品 -->
      <div v-for="item in cart" :key="item.cartItemId">
        <input type="checkbox" v-model="selectedItems" :value="item.cartItemId" />
        <p>
          {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
          {{ item.product?.salePrice || 0 }}元 ×
          <span>{{ item.quantity }}</span>
        </p>
        
        <!-- 編輯數量輸入框 -->
        <input 
          type="number" 
          v-model.number="item.editQuantity" 
          min="0" 
          @input="validateInput(item)" 
          :placeholder="item.editQuantity || 0"
        />

        <!-- 刪除商品按鈕 -->
        <button @click="removeItem(item.cartItemId)">刪除此商品</button>

        <!-- 更新數量按鈕 -->
        <button @click="syncQuantityWithDatabase(item)">更新數量</button>
      </div>

      <!-- 顯示總金額 -->
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart">一鍵清空購物車</button>
      </div>

      <!-- 填寫交易資訊區塊 -->
      <div>
        <h3>填寫交易資訊</h3>
        <label for="creditCard">信用卡號</label>
        <input type="text" id="creditCard" v-model="creditCard" :placeholder="defaultCreditCard" />
        
        <label for="shippingAddress">寄送地址</label>
        <input type="text" id="shippingAddress" v-model="shippingAddress" :placeholder="defaultShippingAddress" />
        
        <button @click="goToPayment">前往交易明細</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCartStore } from '@/stores/cartStore'; // 使用 Pinia Store
import { useRouter } from 'vue-router';
import axios from 'axios';

// 初始化 API URL 和 Pinia Store
const apiUrl = import.meta.env.VITE_API_URL;
const cartStore = useCartStore();
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
const totalPrice = computed(() => {
  return cart.value
    .filter(item => selectedItems.value.includes(item.cartItemId))
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

// 同步數量到後端
const syncQuantityWithDatabase = async (item) => {
  try {
    if (item.editQuantity < 0 || isNaN(item.editQuantity)) {
      alert('商品數量不能小於0');
      item.editQuantity = 0;
      return;
    }
    const memberId = cartStore.memberId;
    await axios.post(`${apiUrl}/pages/cart/add`, {
      memberId: memberId,
      productId: item.product.productId,
      quantity: item.editQuantity,
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
      const memberId = cartStore.memberId;
      await axios.delete(`${apiUrl}/pages/cart/clear/${memberId}`);
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
      await axios.delete(`${apiUrl}/pages/cart/delete/${cartItemId}`);
      cartStore.removeFromCart(cartItemId);
      await cartStore.fetchCartDataFromServer();
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

// 前往交易明細
const goToPayment = async () => {
  try {
    const memberId = cartStore.memberId;
    const selectedCartItems = cart.value.filter(item => selectedItems.value.includes(item.cartItemId));

    if (selectedCartItems.length === 0) {
      alert('請選擇至少一個商品進行結帳');
      return;
    }

    const orderData = {
      cartId: 1, // Fix the cartId to be consistent
      member: memberId,
      creditCard: creditCard.value,
      shippingAddress: shippingAddress.value,
      selectedItems: selectedCartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        cartId: 1, // Ensure the cartId remains the same for all items
      })),
    };

    console.log("發送的訂單資訊:", orderData);

    await axios.post(`${apiUrl}/orders/submit`, orderData);

    alert('訂單提交成功！');
    router.push('/shop/details');
  } catch (error) {
    console.error('提交訂單失敗:', error);
    alert('提交訂單失敗，請稍後重試！');
  }
};

// 驗證輸入數量
const validateInput = (item) => {
  if (item.editQuantity < 0 || isNaN(item.editQuantity)) {
    alert('請輸入正確的商品數量');
    item.editQuantity = 0;
  }
};

// 組件掛載時獲取購物車數據
onMounted(async () => {
  try {
    // 確保 fetchCartDataFromServer 正確執行
    await cartStore.fetchCartDataFromServer();
    cart.value.forEach(item => {
      item.editQuantity = item.quantity || 0; // 初始化 editQuantity
    });
  } catch (error) {
    console.error('獲取購物車數據失敗:', error);
    alert('獲取購物車數據失敗，請稍後重試！');
  }
});
</script>

<style scoped>
.error {
  color: red;
}
</style>