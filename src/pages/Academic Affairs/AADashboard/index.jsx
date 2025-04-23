import React from "react";
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
import SearchBar from "../../../components/SearchBar";
import { useSelector } from "react-redux";

const cards = [
  {
    id: 1,
    title: "Courses",
    description: "View courses and manage course-related operations",
    icon: <Courselisticon />,
    linkTo: "/courses",
  },
  {
    id: 2,
    title: "Professors",
    description: "View professors and manage professor-related operations",
    icon: <Professorlisticon />,
    linkTo: "/professors",
  },
  {
    id: 4,
    title: "Students",
    description: "View students and manage student-related operations",
    icon: <StudentlistIcon />,
    linkTo: "/students",
  },
  {
    id: 5,
    title: "Departments",
    description: "View departments and manage deparment-related operations",
    icon: <Departmentlisticon />,
    linkTo: "/departments",
  },
  {
    id: 6,
    title: "Groups",
    description: "View groups and manage group-related operations",
    icon: <Grouplisticon />,
    linkTo: "/groups",
  },
];

const AADashboard = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  return (
    <div className={styles.dashboard}>
      <div className={styles.titles}>
        <h1 className={styles.title}>{userData.role === 'ACADEMIC_AFFAIRS' ? "Academic Affairs dashboard" : "Manager dashboard"}</h1>
        <h2 className={styles.subTitle}>Quick access</h2>
        <SearchBar />
      </div>
      <div
        gap="24px"
        className={styles.cardContainer}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={styles.card}
            onClick={() => navigate(card.linkTo)}
          >
            <div className={styles.cardIcon}>{card.icon}</div>
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDescription}>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AADashboard;
