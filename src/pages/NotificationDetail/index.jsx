// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { notificationService } from "../../services/notification.service";
// import styles from "./NotificationsDetail.module.scss";

// const NotificationDetailPage = () => {
//   const [notification, setNotification] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { id } = useParams(); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsLoading(true);
//     notificationService
//       .getNotificationById(id) 
//       .then((res) => {
//         console.log("Notification detail:", res);
//         if (res?.status === 200 && res?.data) {
//           setNotification(res.data);
//         } else {
//           navigate("/notifications");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching notification:", err);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [id, navigate]);

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className={styles.notificationDetailPage}>
//       {notification ? (
//         <>
//           <h1>{notification.title}</h1>
//           <p>{notification.description}</p>
//         </>
//       ) : (
//         <p>No notification found</p>
//       )}
//     </div>
//   );
// };

// export default NotificationDetailPage;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import styles from "./NotificationsDetail.module.scss";

const NotificationDetailPage = () => {
  const { id } = useParams(); // URL'dan id olish
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
