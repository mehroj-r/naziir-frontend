import React from "react";
import styles from "./NotFoundPage.module.scss";
import NotFoundImage from "../../assets/images/notfound.png";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <span className={styles.errorMessage}>404 Not found</span>
      <div className={styles.imageContainer}>
        <img
          src={NotFoundImage}
          alt="Not Found"
          className={styles.notFoundImage}
        />
      </div>
      <button className={styles.backButton}>Back</button>
    </div>
  );
}

export default NotFoundPage;
