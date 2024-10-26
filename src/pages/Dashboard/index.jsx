import React from "react";
import { Text, Button, Grid, GridItem, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";

const cards = [
  {
    id: 1,
    title: "My courses",
    description: "Instant access to your courses, syllabus",
    btnText: "Go to Courses",
    imgSrc: "/src/assets/images/courses.png",
    linkTo: '/courses'
  },
  {
    id: 2,
    title: "My Quizzes",
    description: "Instant access to your latest quizzes' data. See and check results",
    btnText: "Go to Quizzes",
    imgSrc: "/src/assets/images/myquizes.png",
    linkTo: '/quizzes'
  },
  {
    id: 3,
    title: "Create a New Quiz",
    description: "With various question types and formatting options, design visually appealing quizzes",
    btnText: "Create Quiz",
    imgSrc: "/src/assets/images/startquiz.png",
    linkTo: '/create-quiz'
  },
]

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>

      <Grid templateColumns="repeat(3, 1fr)" gap="36px">
        {cards.map(card => (
          <GridItem
            key={card.id}
            className={styles.dashboardCard}
            onClick={() => navigate(card.linkTo)}
          >
            <img
              src={card.imgSrc}
              className={styles.cardImage}
            />
            <p className={styles.cardTitle}>{ card.title }</p>
            <p className={styles.cardDescription}>{ card.description }</p>
            <Button
              colorScheme="teal"
              onClick={() => navigate("/courses")}
            >
              {card.btnText}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
