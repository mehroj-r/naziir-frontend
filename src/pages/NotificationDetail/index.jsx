import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import styles from "./NotificationsDetail.module.scss";

const NotificationDetailPage = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      notificationService
        .getNotificationById(id)
        .then((response) => {
          setNotification(response.data); 
        })
        .catch((err) => {
          console.error("Error fetching notification by ID:", err);
          setError("Xabarni olishda xato yuz berdi.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!notification) {
    return <div>Xabar topilmadi.</div>;
  }

  return (
    <div className={styles.notificationDetail}>
      <div className={styles.header}>{notification.title}</div>
      <div className={styles.message}>{notification.description}</div>
      <div className={styles.date}>{notification.date}</div>
      <button className={styles.backButton} onClick={() => navigate("/notifications")}>
        Back to Notifications
      </button>
    </div>
  );
};

export default NotificationDetailPage;
