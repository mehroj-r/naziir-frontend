import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./AADashboard.module.scss";
import bgImage from "../../../assets/images/background.png";

import courseImage from "../../../assets/icons/Imageicons/courses.png";
import professorImage from "../../../assets/icons/Imageicons/proflist.png";
import studentImage from "../../../assets/icons/Imageicons/studentlist.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";

const cards = [
  {
    id: 1,
    title: "Course List",
    description: "View courses and manage course-related operations",
    imgSrc: courseImage,
    linkTo: "/courses-list",
  },
  {
    id: 2,
    title: "Professor List",
    description: "View professors and manage professor-related operations",
    imgSrc: professorImage,
    linkTo: "/professors",
  },
  {
    id: 3,
    title: "Student List",
    description: "View students and manage student-related operations",
    imgSrc: studentImage,
    linkTo: "/students",
  },
  {
    id: 4,
    title: "Department List",
    description: "View departments and manage deparment-related operations",
    imgSrc: studentImage,
    linkTo: "/departments",
  },
];

const AADashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <div className={styles.titles}>
        <h1 className={styles.title}>Academic Affairs</h1>
        <p className={styles.subTitle}>Quick access</p>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBox}
            placeholder="Search for courses, professors and students"
          />
          <button>
            <SearchIcon />
          </button>
        </div>
      </div>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap="24px"
        className={styles.cardContainer}
      >
        {cards.map((card) => (
          <GridItem
            key={card.id}
            className={styles.card}
            onClick={() => navigate(card.linkTo)}
          >
            <img
              src={card.imgSrc}
              alt={card.title}
              className={styles.cardImage}
            />
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDescription}>{card.description}</p>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default AADashboard;
