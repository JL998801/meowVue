<template>
  <div>
    <h2>我的購物車</h2>
    <div v-if="cart.length === 0">
      <p>購物車是空的！</p>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item.cartItemId">
        <input type="checkbox" v-model="item.selected" @change="updateSelection(item)" />
        <p>
          {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
          {{ item.product?.salePrice || 0 }}元 ×
          <span>{{ item.quantity }}</span>
        </p>
        <input 
          type="number" 
          v-model.number="item.editQuantity" 
          min="0" 
          @input="validateInput(item)" 
          :placeholder="item.editQuantity || 0"
        />
        <button @click="removeItem(item.cartItemId)">刪除此商品</button>
        <button @click="syncQuantityWithDatabase(item)">更新數量</button>
      </div>
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart">一鍵清空購物車</button>
      </div>

      <!-- Form to enter Credit Card and Shipping Address -->
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart || []);

const defaultCreditCard = '4311-9511-1111-1111'; // Default Credit Card value
const defaultShippingAddress = '123 Main St';  // Default Shipping Address value

// Variables to bind the form inputs for credit card and shipping address
const creditCard = ref(defaultCreditCard);
const shippingAddress = ref(defaultShippingAddress);

const totalPrice = computed(() => {
  if (!cart.value.length) return 0;
  return cart.value
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

const syncQuantityWithDatabase = async (item) => {
  try {
    if (item.editQuantity < 0 || isNaN(item.editQuantity)) {
      alert('商品數量不能小於0');
      item.editQuantity = 0;
      return;
    }
    const memberId = store.state.memberId;
    const productId = item.product.productId;
    await axios.post(`${apiUrl}/pages/cart/add`, {
      memberId: memberId,
      productId: productId,
      quantity: item.editQuantity,
    });
    store.dispatch('updateQuantity', { cartItemId: item.cartItemId, quantity: item.editQuantity });
    await store.dispatch('fetchCartDataFromServer');
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    alert('更新購物車數量失敗，請稍後重試！');
  }
};

const clearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    try {
      const memberId = store.state.memberId;
      await axios.delete(`${apiUrl}/pages/cart/clear/${memberId}`);
      store.dispatch('clearCart');
      await store.dispatch('fetchCartDataFromServer');
    } catch (error) {
      console.error('清空購物車失敗:', error);
      alert('清空購物車失敗，請稍後重試！');
    }
  }
};

const updateSelection = async (item) => {
  try {
    store.commit('setSelected', { cartItemId: item.cartItemId, selected: item.selected });
  } catch (error) {
    console.error('更新選擇狀態失敗:', error);
    alert('更新選擇狀態失敗，請稍後重試！');
  }
};

const removeItem = async (cartItemId) => {
  if (cartItemId && confirm('確定要刪除此商品嗎？')) {
    try {
      await axios.delete(`${apiUrl}/pages/cart/delete/${cartItemId}`);
      store.dispatch('removeFromCart', cartItemId);
      await store.dispatch('fetchCartDataFromServer');
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

const goToPayment = async () => {
  try {
    const memberId = store.state.memberId;
    const selectedItems = cart.value.filter(item => item.selected);
    console.log('Selected Items:', selectedItems);  // Debugging line to check cartItemId

    // 確保 cartId 是在最外層，並將 selectedItems 放在 items 屬性中
    await axios.post(`${apiUrl}/orders/submit`, {
      cartId: selectedItems.length > 0 ? selectedItems[0].cartItemId : null,  // 使用選中的第一個 cartItemId
      member: memberId,
      creditCard: creditCard.value,
      shippingAddress: shippingAddress.value,
      items: selectedItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        cartId: item.cartItemId,  // 使用每個 item 的 cartItemId
        creditCard: creditCard.value,
        shippingAddress: shippingAddress.value,
      })),
    });

    alert('訂單提交成功！');
    router.push('/shop/details');
  } catch (error) {
    console.error('提交訂單失敗:', error);
    alert('提交訂單失敗，請稍後重試！');
  }
};


const validateInput = (item) => {
  if (item.editQuantity < 0 || isNaN(item.editQuantity)) {
    alert('請輸入正確的商品數量');
    item.editQuantity = 0;
  }
};

onMounted(async () => {
  try {
    cart.value.forEach(item => {
      item.editQuantity = item.quantity || 0;
    });
    await store.dispatch('fetchCartDataFromServer');
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
