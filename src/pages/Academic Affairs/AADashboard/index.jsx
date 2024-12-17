import React from "react";
import { Text, Button, Grid, GridItem, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./AADashboard.module.scss";
import bgImage from "../../../assets/images/background.png";

const cards = [
  {
    id: 1,
    title: "Upcoming Quizzes",
    description: "See upcoming and next quizzes",
    btnText: "Go to Courses",
    imgSrc: "/src/assets/images/courses.png",
    linkTo: "/courses",
  },
  {
    id: 2,
    title: "My Quizzes",
    description:
      "Instant access to your latest quizzes' data. See and check results",
    btnText: "Go to Quizzes",
    imgSrc: "/src/assets/images/myquizes.png",
    linkTo: "/quizzes",
  },
  {
    id: 3,
    title: "Suggest questions for professor",
    description:
      "With a variety of question kinds and formatting options, you can quickly design visually appealing examinations.",
    btnText: "Create Quiz",
    imgSrc: "/src/assets/images/startquiz.png",
    linkTo: "/create-quiz",
  },
];

const AADashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <img src={bgImage} alt="Background Left" className={styles.bgLeft} />
      <img src={bgImage} alt="Background Right" className={styles.bgRight} />
      <Grid templateColumns="repeat(3, 1fr)" gap="36px">
        {cards.map((card) => (
          <GridItem
            key={card.id}
            className={styles.dashboardCard}
            onClick={() => navigate(card.linkTo)}
          >
            <img src={card.imgSrc} className={styles.cardImage} />
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDescription}>{card.description}</p>
            <Button colorScheme="teal" onClick={() => navigate("/courses")}>
              {card.btnText}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default AADashboard;
