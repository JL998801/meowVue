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
      <ul>
        <li v-for="item in selectedCart" :key="item.cartItemId">
          {{ item.product.productName }} - 單價: {{ item.product.salePrice }} 元，數量:
          <input type="number" v-model.number="item.quantity" min="1"
            @change="updateQuantity(item.cartItemId, item.quantity)" />
          <button @click="removeFromCart(item.cartItemId)">刪除</button>
        </li>
      </ul>
      <p>總金額: {{ totalAmount }} 元</p>
      <button @click="goToPayment">前往支付</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart);

const selectedCart = ref([]);
watch(
  cart,
  () => {
    selectedCart.value = cart.value.filter((item) => item.selected);
  },
  { immediate: true }
);

const totalAmount = computed(() =>
  selectedCart.value.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0)
);

const loading = ref(false);
const error = ref(null);

const updateQuantity = (id, quantity) => {
  const item = selectedCart.value.find((item) => item.cartItemId === id);
  if (item) item.quantity = quantity;
};

const removeFromCart = (id) => {
  const index = selectedCart.value.findIndex((item) => item.cartItemId === id);
  if (index > -1) selectedCart.value.splice(index, 1);
};

const goToPayment = () => {
  router.push("/shop/payment");
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
