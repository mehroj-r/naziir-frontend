// src/pages/Statistics/index.jsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import styles from "./Statistics.module.scss"; // Import SCSS module

const Statistics = () => {
  return (
    <Box className={styles["statistics-page"]}>
      <Text className={styles.title}>Statistics</Text>
      <Text className={styles.content}>
        Here you can view the statistics of your quizzes and courses.
      </Text>
      {/* Add more content or components as needed */}
    </Box>
  );
};

export default Statistics;
