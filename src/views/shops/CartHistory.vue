<template>
    <div class="cart-history">
    <h2>購物車操作紀錄</h2>

    <div v-if="isLoading">加載中...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>

    <div v-else>
    <table class="history-table">
        <thead>
        <tr>
            <th>時間</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="log in cartActions" :key="log.id">
            <td>{{ log.timestamp }}</td>
            <td>{{ log.action }}</td>
        </tr>
        </tbody>
    </table>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CartService } from "@/services/CartService";

// ✅ 會員 ID (通常應該從 Vuex/Pinia 或 localStorage 取得)
const memberId = 1;
const cartActions = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

// 🔹 獲取購物車行為
const fetchCartActions = async () => {
try {
    cartActions.value = await CartService.getCartActions(memberId);
} catch (error) {
    errorMessage.value = "無法獲取購物車行為";
} finally {
    isLoading.value = false;
}
};

onMounted(fetchCartActions);
</script>

<style scoped>
.cart-history {
padding: 20px;
}

.history-table {
width: 100%;
border-collapse: collapse;
}

.history-table th, .history-table td {
border: 1px solid #ddd;
padding: 8px;
text-align: left;
}
</style>
