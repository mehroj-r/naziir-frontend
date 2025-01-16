import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./AADashboard.module.scss";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import {
  Courselisticon,
  Departmentlisticon,
  Grouplisticon,
  Professorlisticon,
  StudentlistIcon,
} from "../../../assets/icons/aaDashboardIcons";

const cards = [
  {
    id: 1,
    title: "Course List",
    description: "View courses and manage course-related operations",
    icon: <Courselisticon />,
    linkTo: "/courses-list",
  },
  {
    id: 2,
    title: "Professor List",
    description: "View professors and manage professor-related operations",
    icon: <Professorlisticon />,
    linkTo: "/professors",
  },
  {
    id: 3,
    title: "Student List",
    description: "View students and manage student-related operations",
    icon: <StudentlistIcon />,
    linkTo: "/students",
  },
  {
    id: 4,
    title: "Department List",
    description: "View departments and manage deparment-related operations",
    icon: <Departmentlisticon />,
    linkTo: "/departments",
  },
  {
    id: 5,
    title: "Group List",
    description: "View groups and manage group-related operations",
    icon: <Grouplisticon />,
    linkTo: "/groups",
  },
];

// {
//   "email":"2110017@newuu.uz",
//   "password":"n9^V%#y%",
//   "role": "ACADEMIC_AFFAIRS",
//   "organizationId":"fca535c2-8c67-4263-96bf-a711fe4b5020"
// }

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
            <div className={styles.cardIcon}>{card.icon}</div>
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDescription}>{card.description}</p>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default AADashboard;
