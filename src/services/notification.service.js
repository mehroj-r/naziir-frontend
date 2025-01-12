import axios from "axios";

export const notificationService = {
  getNotifications: () => {
    return axios.get("/api/notifications").then((res) => {
      console.log("API response:", res.data);
      return res;
    });

  },
  getNotificationById: (id) => {
    return axios.get(`/api/notifications/${id}`).then((res) => {
      console.log("API response for notification by ID:", res.data);
      return res;
    });
  },
};