import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Professors.module.scss";
import img1 from "../../../assets/images/sultan.png";
import img2 from "../../../assets/images/profilepicture2.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";
const professorsData = [
  {
    id: "1",
    name: "Sultanbek Erkinbaev, Ph.D.",
    title: "Assistant Professor of Computer Science",
    university: "University of California, Berkeley",
    avatar: img1,
    courses: ["Course CS 61A", "Course CS 61B"],
  },
  {
    id: "2",
    name: "Tara M. Richardson, Ph.D.",
    title: "Assistant Professor of Computer Science",
    university: "University of California, Berkeley",
    avatar: img2,
    courses: ["Course CS 61A", "Course CS 61B"],
  },
  {
    id: "3",
    name: "Emma L. Brown, Ph.D.",
    title: "Associate Professor of Physics",
    university: "MIT",
    avatar: img2,
    courses: ["Course Physics 1", "Course Physics 2"],
  },
];

const Professors = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageBody}>
      <h1>Professors</h1>
      <div className={styles.Searchbar}>
        <button>
          <SearchIcon />
        </button>
        <input type="text" placeholder="Search professors" />
      </div>
      <div className={styles.professorList}>
        {professorsData.map((professor) => (
          <div
            key={professor.id}
            className={styles.professorItem}
            onClick={() => navigate(`/professors/${professor.id}`)}
          >
            <img
              src={professor.avatar}
              alt={professor.name}
              className={styles.avatarSmall}
            />
            <div className={styles.description}>
              <h2>{professor.name}</h2>
              <p>{professor.title}</p>
            </div>
            <button className={styles.detailsButton}>View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Professors;
