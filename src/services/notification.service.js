import axios from "axios";

export const notificationService = {
  getNotifications: () => {
    return axios.get("/api/notifications").then((res) => {
      console.log("API response:", res.data);
      return res;
    });
  },
};
