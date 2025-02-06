<template>
    <div class="small-cart-container">
        <!-- 小購物車圖示，顯示數量 -->
        <div class="cart-icon" @click="toggleCart">
            <img :src="cartIcon" alt="Shopping Cart" />
            <span v-if="cartQuantity > 0" class="cart-quantity">{{ cartQuantity }}</span> <!-- 顯示數量 -->
        </div>

        <!-- 當顯示購物車內容時顯示 -->
        <div v-if="showCart" class="cart-content">
            <button class="close-btn" @click="toggleCart">X</button> <!-- Close button -->
            <div v-if="cart.length === 0">
                <p>購物車是空的！</p>
            </div>
            <div v-else>
                <div v-for="item in cart" :key="item.cartItemId" class="cart-item">
                    <!-- 顯示商品縮圖 -->
                    <img v-if="item.product?.imageUrl" :src="item.product.imageUrl" alt="Product Image"
                        class="product-image" />
                    <p>
                        {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
                        {{ item.product?.salePrice || 0 }}元 ×
                        <span>{{ item.quantity }}</span>
                    </p>
                </div>
                <div class="total">
                    <span>總金額: {{ totalPrice }}元</span>
                </div>
                <button class="go-to-cart-btn" @click="goToCart">前往購物車</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart || []);

// 用來控制購物車顯示與隱藏
const showCart = ref(false);

// 控制小購物車圖示
const cartIcon = ref("/src/assets/your-cart-icon.png");

// 計算總金額
const totalPrice = computed(() => {
    if (!cart.value.length) return 0;
    return cart.value.reduce(
        (total, item) => total + (item.product?.salePrice || 0) * item.quantity,
        0
    );
});

// 顯示購物車內容
const toggleCart = () => {
    showCart.value = !showCart.value;
    // 點擊後改變圖示
    cartIcon.value = showCart.value ? "/src/assets/your-cart-icon-open.png" : "/src/assets/your-cart-icon.png";
};

// 顯示購物車數量
const cartQuantity = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// 前往購物車頁面
const goToCart = () => {
    router.push('/shop/cart'); // 確保路由正確
};
</script>

<style scoped>
.small-cart-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.cart-icon {
    cursor: pointer;
    position: relative;
}

.cart-icon img {
    width: 60px;
    height: auto;
}

.cart-quantity {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px;
    font-size: 14px;
    font-weight: bold;
}

.cart-content {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #c6bc77;
    border: 1px solid #ccc;
    padding: 10px;
    width: 250px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: block;
}

.cart-item {
    display: flex;
    justify-content: space-between;
}

.product-image {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.total {
    margin-top: 10px;
    font-weight: bold;
}

.go-to-cart-btn {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
}

.go-to-cart-btn:hover {
    background-color: #0056b3;
}

/* Close button for cart */
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 18px;
}
</style>
