<template>
  <div class="card my-3">
    <img :src="product.imageUrl" class="card-img-top" alt="商品圖片" />
    <div class="card-body">
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text">價格: {{ product.price }} 元</p>
      <p class="card-text">庫存: {{ product.stockQuantity }} 件</p>

      <div class="d-flex align-items-center">
        <label class="me-2">數量:</label>
        <input 
          type="number" 
          v-model="quantity" 
          min="1" 
          :max="product.stockQuantity" 
          class="form-control w-25 me-2"
        />
      </div>

      <button class="btn btn-success mt-2 me-2" addToCart(product)>加入購物車</button>
      <button class="btn btn-outline-danger mt-2" @click="handleAddToWishlist">❤️ 加入願望清單</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from 'vuex';

const props = defineProps({
  product: Object
});

const store = useStore();

const addToCart = (product) => {
  store.dispatch('addToCart', product);
};

export default {
  props: {
    product: Object,
  },
  setup(props, { emit }) {
    const quantity = ref(1);

    const handleAddToCart = () => {
      emit("add-to-cart", { ...props.product, quantity: quantity.value });
    };

    const handleAddToWishlist = () => {
      emit("add-to-wishlist", props.product);
    };

    return { quantity, handleAddToCart, handleAddToWishlist };
  }
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  background-color: #fff;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
