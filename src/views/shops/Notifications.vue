<template>
    <div class="notification-container">
        <h1>{{ isAdmin ? "管理員通知" : "我的通知" }}</h1>

        <div v-if="isLoading" class="loading">加載中...</div>
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div v-else>
            <div v-if="notifications.length > 0">
                <div v-for="notification in notifications" :key="notification.id" class="notification-item">
                <p>{{ notification.message }}</p>
                <button class="btn btn-primary" @click="markAsRead(notification.id)">標記為已讀</button>
                </div>
            </div>
        <div v-else>
            <p class="empty-message">沒有新的通知</p>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { NotificationService } from "@/services/NotificationService";

// ✅ 假設會員 ID 與管理員 ID 從 `localStorage` 取得
const userId = localStorage.getItem("userId") || 1; // 預設為會員 ID 1
const isAdmin = localStorage.getItem("isAdmin") === "true"; // 是否為管理員
const notifications = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// ✅ 獲取未讀通知
const fetchNotifications = async () => {
isLoading.value = true;
try {
    const response = await NotificationService.getUnreadNotifications(userId, isAdmin);
    if (response) {
    notifications.value = response;
    } else {
    errorMessage.value = "無法獲取通知";
    }
} catch (error) {
    console.error("獲取通知錯誤:", error);
    errorMessage.value = "請稍後重試";
} finally {
    isLoading.value = false;
}
};

// ✅ 標記通知為已讀
const markAsRead = async (notificationId) => {
try {
    const response = await NotificationService.markAsRead(notificationId);
    if (response) {
    notifications.value = notifications.value.filter(n => n.id !== notificationId);
    } else {
    alert("標記為已讀失敗");
    }
} catch (error) {
    console.error("標記通知為已讀錯誤:", error);
}
};

// ✅ 初始化時加載通知
onMounted(fetchNotifications);
</script>

<style scoped>
.notification-container {
text-align: center;
padding: 20px;
}

.notification-item {
display: flex;
justify-content: space-between;
align-items: center;
border: 1px solid #ddd;
padding: 10px;
margin: 10px auto;
width: 80%;
}

.empty-message {
font-size: 18px;
color: #999;
}
</style>
