<script setup>
import { computed } from "vue";
import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();

// 使用 computed 來確保內容即時變更
const notifications = computed(() => notificationStore.notifications);

// 觸發 Vue 更新
const refreshNotification = () => {
  notificationStore.$patch({ notifications: [...notificationStore.notifications] }); 
};

// **標記為已讀**
const markAsRead = (notificationId) => {
  notificationStore.markAsRead(notificationId);
};

// **頁面加載時獲取通知數據**
onMounted(() => {
  notificationStore.fetchNotifications();
});
</script>

<template>
  <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true"
  @shown.bs.modal="refreshNotification">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="notificationModalLabel">通知中心</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul v-if="notificationStore.notifications.length > 0">
            <li v-for="notification in notificationStore.notifications" :key="notification.id">
              <span :class="{ 'text-muted': notification.isRead }">
                {{ notification.message }}
              </span>
              <button v-if="!notification.isRead" @click="markAsRead(notification.id)" class="btn btn-sm btn-primary ms-2">
                標記為已讀
              </button>
            </li>
          </ul>
          <p v-else>目前沒有通知</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>
