import React from "react";
import { Button, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";

const courses = [
  { id: 1, name: "OOP", term: "Fall 2025" },
  { id: 2, name: "Database", term: "Spring 2024" },
  { id: 3, name: "Programming", term: "Fall 2021" },
  { id: 5, name: "Algorithms", term: "Spring 2023" },
  { id: 6, name: "Backend", term: "Fall 2023" },
  { id: 7, name: "Frontend", term: "Fall 2023" },
];

const quizzes = [
  { id: 1, name: "OOP", weeks: "Week 1-2" },
  { id: 2, name: "Database", weeks: "Week 4-5-6" },
  { id: 3, name: "Programming", weeks: "Week 11-12-13" },
  { id: 5, name: "Algorithms", weeks: "Week 7-8" },
  { id: 6, name: "Backend", weeks: "Week 9-10" },
  { id: 7, name: "Frontend", weeks: "Week 15-16" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <div className={styles.section}>
        <div
          className={styles.dashboardCard}
          onClick={() => navigate("/courses")}
        >
          <Image
            src="/src/assets/images/courses.png"
            className={styles.cardImage}
          />
          <Text className={styles.cardTitle}>My Courses</Text>
          <Text className={styles.cardDescription}>
            Instant access to your courses, syllabus
          </Text>
          <Button colorScheme="teal">Go to Courses</Button>
        </div>
        <div className={styles.secondcard}>
          <div className={styles.listContainer}>
            {courses.map((course) => (
              <div key={course.id} className={styles.listItem}>
                <Text className={styles.listItemText}>
                  {course.name} - {course.term}
                </Text>
                <Button size="sm" className={styles.listButton}>
                  Syllabus
                </Button>
              </div>
            ))}
          </div>
          <div className={styles.emptyCard}></div>
        </div>
      </div>

      <div className={styles.section}>
        <div
          className={styles.dashboardCard}
          onClick={() => navigate("/quizzes")}
        >
          <Image
            src="/src/assets/images/myquizes.png"
            className={styles.cardImage}
          />
          <Text className={styles.cardTitle}>My Quizzes</Text>
          <Text className={styles.cardDescription}>
            Instant access to your latest quizzes' data. See and check results
          </Text>
          <Button colorScheme="teal">Go to Quizzes</Button>
        </div>
        <div className={styles.secondcard}>
          <div className={styles.listContainer}>
            {quizzes.map((quiz) => (
              <div key={quiz.id} className={styles.listItem}>
                <Text className={styles.listItemText}>
                  {quiz.name} - {quiz.weeks}
                </Text>
                <Button size="sm" className={styles.listButton}>
                  Results
                </Button>
              </div>
            ))}
          </div>
          <div className={styles.emptyCard}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
