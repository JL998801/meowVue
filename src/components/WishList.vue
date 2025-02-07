<template>
    <div class="wishlist-container">
    <h1>我的願望清單</h1>

    <div v-if="isLoading" class="loading">加載中...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else>
    <div v-if="wishList.length > 0">
        <div v-for="product in wishList" :key="product.productId" class="wishlist-item">
        <img :src="product.imageUrl || 'default.jpg'" alt="商品圖片" class="wishlist-img" />
        <div class="wishlist-details">
            <h3>{{ product.productName }}</h3>
            <p>價格: {{ product.salePrice }} 元</p>
            <button class="btn btn-danger" @click="removeFromWishList(product.productId)">移除</button>
        </div>
        </div>
    </div>
    <div v-else>
        <p class="empty-message">還沒找到喜歡的嗎?</p>  <!--建立按鈕"查看推薦商品"?-->
    </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { WishListService } from "@/services/WishListService";

// ✅ 會員 ID (實際應該從 Vuex/Pinia 或 API 取得)
const memberId = localStorage.getItem("memberId") || 1; // 假設會員 ID = 1
const wishList = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// ✅ 獲取願望清單
const fetchWishList = async () => {
isLoading.value = true;
try {
    const response = await WishListService.getWishList(memberId);
    if (response && response.success) {
    wishList.value = response.products || [];
    } else {
    errorMessage.value = "無法獲取願望清單";
    }
} catch (error) {
    console.error("獲取願望清單錯誤:", error);
    errorMessage.value = "請稍後重試";
} finally {
    isLoading.value = false;
}
};

// ✅ 移除願望清單商品
const removeFromWishList = async (productId) => {
try {
    const response = await WishListService.removeFromWishList(productId, memberId);
    if (response && response.success) {
    wishList.value = wishList.value.filter(product => product.productId !== productId);
    } else {
    alert("移除失敗，請稍後重試");
    }
} catch (error) {
    console.error("移除願望清單錯誤:", error);
}
};

// ✅ 初始化時加載願望清單
onMounted(fetchWishList);
</script>

<style scoped>
.wishlist-container {
text-align: center;
padding: 20px;
}

.wishlist-item {
display: flex;
align-items: center;
border: 1px solid #ddd;
padding: 10px;
margin: 10px auto;
width: 80%;
}

.wishlist-img {
width: 100px;
height: auto;
margin-right: 20px;
}

.wishlist-details {
flex-grow: 1;
}

.empty-message {
font-size: 18px;
color: #999;
}
</style>
  