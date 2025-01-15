import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import { Center, Spinner } from "@chakra-ui/react";
import styles from "./NotificationsDetail.module.scss";

const NotificationDetail = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      notificationService
        .getNotificationById(id)
        .then((res) => {
          setNotification(res?.data);
          setError(null);
        })
        .catch((err) => {
          setError("Failed to load notification details.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <Center className={styles.loadingContainer}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center className={styles.errorContainer}>
        <p>{error}</p>
        <Link to="/notifications" className={styles.backLink}>
          Back to Notifications
        </Link>
      </Center>
    );
  }

  return (
    <div className={styles.notificationDetailPage}>
      <div className={styles.header}>
        <h1>Notification Details</h1>
        <Link to="/notifications" className={styles.backLink}>
          Back to Notifications
        </Link>
      </div>

      {notification ? (
        <div className={styles.notificationContent}>
          <h2 className={styles.title}>{notification.title}</h2>
          <p className={styles.message}>{notification.message}</p>
          <p className={styles.date}>Date: {new Date(notification.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p className={styles.noData}>No details available for this notification.</p>
      )}
    </div>
  );
};

export default NotificationDetail;
