import { jsonRequest } from "@/plugins/axios";

const API_URL = "/notifications";

export const NotificationService = {
  async getNotifications(userId, isAdmin = false) {
    const url = isAdmin
      ? `${API_URL}/admin/${userId}/unread`
      : `${API_URL}/member/${userId}/unread`;
    return jsonRequest("get", url);
  },

  async markAsRead(notificationId) {
    return jsonRequest("post", `${API_URL}/${notificationId}/read`);
  },
};
