<template>
<div class="cart-dropdown" v-if="isOpen">
    <div class="cart-items">
    <div v-if="cartItems.length === 0" class="empty-cart">
        <p>購物車是空的。</p>
    </div>

    <div v-else>
        <div v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
        <img :src="item.imageUrl" class="cart-item-img" />
        <div class="cart-item-info">
            <h4>{{ item.productName }}</h4>
            <p>數量: {{ item.quantity }}</p>
            <p>價格: NT${{ item.salePrice }}</p>
            <button class="remove-btn" @click="removeItem(item.cartItemId)">✖</button>
        </div>
        </div>
    </div>
    </div>

    <div class="cart-footer">
    <RouterLink to="/cart" class="btn btn-primary">查看購物車</RouterLink>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CartService } from "@/services/CartService";

const props = defineProps({ isOpen: Boolean }); // 父元件控制開關
const cartItems = ref([]);

// 🔹 獲取購物車內容
const loadCart = async () => {
try {
    const memberId = localStorage.getItem("memberId") || 1;
    cartItems.value = await CartService.getCart(memberId);
} catch (error) {
    console.error("載入購物車失敗:", error);
}
};

// 🔹 刪除單筆商品
const removeItem = async (cartItemId) => {
try {
    await CartService.removeFromCart(cartItemId);
    cartItems.value = cartItems.value.filter(item => item.cartItemId !== cartItemId);
} catch (error) {
    console.error("刪除商品失敗:", error);
}
};

onMounted(loadCart);
</script>

<style scoped>
.cart-dropdown {
position: absolute;
top: 50px;
right: 0;
width: 280px;
background: white;
border: 1px solid #ddd;
padding: 10px;
box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
z-index: 100;
}

.cart-item {
display: flex;
align-items: center;
border-bottom: 1px solid #ddd;
padding: 8px;
}

.cart-item-img {
width: 50px;
height: 50px;
object-fit: cover;
margin-right: 10px;
}

.cart-item-info {
flex-grow: 1;
}

.remove-btn {
background: none;
border: none;
color: red;
cursor: pointer;
font-size: 16px;
}

.cart-footer {
text-align: center;
margin-top: 10px;
}
</style>
