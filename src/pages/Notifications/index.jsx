import React, { useState, useEffect } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { customToast } from "../../utils/toastify";
import { notificationService } from "../../services/notification.service";
import styles from "./Notifications.module.scss";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    notificationService
      .getNotifications()
      .then((res) => {
        console.log("API response:", res);
        if (res?.status === 200 && Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          customToast("error", "Invalid response from server");
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        customToast("error", "An error occurred while fetching notifications");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <button className={styles.writeMessageButton}>
          Write a message for users
        </button>
      </div>
      <Center className={styles.notificationsList}>
        {isLoading ? (
          <Spinner size="lg" />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={styles.notificationCard}>
              <div className={styles.notificationContent}>
                <h2>{notification.title}</h2>
                <p>{notification.description}</p>
              </div>
              <button className={styles.viewButton}>View</button>
            </div>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </Center>
    </div>
  );
};

export default NotificationsPage;
