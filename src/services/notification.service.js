import axios from "axios";

export const notificationService = {
  // /notifications uchun
  getNotifications: () => {
    return axios.get("/api/notifications").then((res) => {
      console.log("API response:", res.data);
      return res;
    });
  },

  // /notifications/:id uchun
  getNotificationById: (id) => {
    return axios.get(`/api/notifications/${id}`).then((res) => {
      console.log("API response for notification by ID:", res.data);
      return res;
    });
  },
};