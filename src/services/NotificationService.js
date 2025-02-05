import axios from "axios";

const API_BASE_URL = "/notifications";

export const NotificationService = {
  // ✅ 獲取未讀通知 (根據用戶類型)
async getUnreadNotifications(userId, isAdmin = false) {
try {
    const url = isAdmin
    ? `${API_BASE_URL}/admin/${userId}/unread`
    : `${API_BASE_URL}/member/${userId}/unread`;

    const response = await fetch(url);
    return await response.json();
} catch (error) {
    console.error("獲取未讀通知失敗:", error);
    return [];
}
},

// ✅ 標記通知為已讀
async markAsRead(notificationId) {
try {
    const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
    method: "POST"
    });
    return await response.json();
} catch (error) {
    console.error("標記通知為已讀失敗:", error);
    return null;
}
}
};
