import { defineStore } from "pinia";
import { NotificationService } from "@/services/NotificationService";
import Swal from "sweetalert2";

const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),

  actions: {
    // ✅ 取得通知
    async fetchNotifications() {
      try {
        this.notifications = await NotificationService.getNotifications();
      } catch (error) {
        console.error("無法獲取通知:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: error.message || "發生未知錯誤",
        });
      }
    },

    // ✅ 標記通知為已讀
    async markAsRead(notificationId) {
      try {
        await NotificationService.markAsRead(notificationId);
        await this.fetchNotifications();
      } catch (error) {
        console.error("無法標記通知為已讀:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },
  },
});
export default useNotificationStore;