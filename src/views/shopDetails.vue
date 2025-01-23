<template>
  <div>
    <h2>訂單資訊</h2>
    <div v-if="loading">
      <p>正在加載訂單信息...</p>
    </div>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
    </div>
    <div v-else>
      <p>總金額: {{ totalPrice }} 元</p>
      <form @submit.prevent="placeOrder">
        <input 
          type="text" 
          v-model.trim="shippingAddress" 
          placeholder="收貨地址" 
          required 
        />
        <input 
          type="text" 
          v-model.trim="creditCard" 
          placeholder="信用卡號" 
          pattern="\d{16}" 
          title="請輸入16位信用卡號碼" 
          required 
        />
        <button type="submit">提交訂單</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shippingAddress: '',
      creditCard: '',
      totalPrice: 0,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchCartDetails();
  },
  methods: {
    // 獲取購物車總金額
    async fetchCartDetails() {
      const cartId = this.$route.params.cartId;
      const apiUrl = import.meta.env.VITE_API_URL;  // 從環境變數獲取 API URL

      try {
        const response = await fetch(`${apiUrl}/cartItems/cart/${cartId}`);
        if (!response.ok) {
          throw new Error('無法獲取購物車資訊，請稍後再試。');
        }
        const data = await response.json();
        this.totalPrice = data.reduce((sum, item) => sum + (item.quantity * item.productPrice), 0);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // 提交訂單
    async placeOrder() {
      if (!this.shippingAddress || !this.creditCard) {
        alert('請填寫完整的訂單信息！');
        return;
      }

      const orderData = {
        shippingAddress: this.shippingAddress,
        creditCard: this.creditCard,
        cartId: this.$route.params.cartId
      };
      const apiUrl = import.meta.env.VITE_API_URL;  // 從環境變數獲取 API URL

      try {
        const response = await fetch(`${apiUrl}/orders`, {
          method: 'POST',
          body: JSON.stringify(orderData),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('訂單提交失敗，請稍後再試！');
        }

        const order = await response.json();
        alert('訂單已成功提交！');

        // 跳轉到支付頁面
        const ecpayUrl = import.meta.env.VITE_ECPAY_URL;  // 從環境變數獲取 ECPay URL
        this.$router.push({ 
          name: 'payment', 
          params: { orderId: order.orderId }, 
          query: { ecpayUrl: ecpayUrl } 
        });

      } catch (err) {
        alert(err.message);
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
}
button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
