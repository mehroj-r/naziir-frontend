import httpRequest from "./httpRequest";

// Should be corrected

export const notificationService = {

  getNotifications: async () => {

    const temporaryNotifications = [
      {
        id: 1,
        title: "Welcome to the platform!",
        description: "This is a temporary notification to check the design.",
        createdAt: "2025-01-16T12:00:00Z",
      },
      {
        id: 2,
        title: "Maintenance notice",
        description: "We are performing maintenance on the platform. Some features may be unavailable.",
        createdAt: "2025-01-16T12:30:00Z",
      },
    ];


    return { data: temporaryNotifications };
  },

  getNotificationById: async (id) => {
    const temporaryNotifications = [
      {
        id: 1,
        title: "Welcome to the platform!",
        description: "This is a temporary notification to check the design.",
        createdAt: "2025-01-16T12:00:00Z",
      },
      {
        id: 2,
        title: "Maintenance notice",
        description: "We are performing maintenance on the platform. Some features may be unavailable.",
        createdAt: "2025-01-16T12:30:00Z",
      },
    ];


    const notification = temporaryNotifications.find((notif) => notif.id === id);
    return { data: notification }; 
  },

  
  createNotification: async (body) => {
    try {
      const response = await httpRequest.post("/notifications", body);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;  
    }
  },


  updateNotification: async (id, body) => {
    try {
      const response = await httpRequest.put(`/notifications/${id}`, body);
      return response.data;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await httpRequest.delete(`/notifications/${id}`);
      return response.data;  
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};
