import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfessorInfo.module.scss";
import img1 from "../../assets/images/sultan.png";
import img2 from "../../assets/images/profilepicture2.png";
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

const ProfessorInfo = () => {
  const { professorId } = useParams();
  const navigate = useNavigate();

  const professor = professorsData.find((prof) => prof.id === professorId);

  if (!professor) {
    return (
      <div className={styles.notFound}>
        <h1>Professor not found</h1>
        <button onClick={() => navigate("/professors")}>
          Back to Professors
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <h1>Professor</h1>
      <div className={styles.detailContainer}>
        <img
          className={styles.avatarLarge}
          src={professor.avatar}
          alt={professor.name}
        />
        <div>
          <h2>{professor.name}</h2>
          <p>{professor.title}</p>
          <p>{professor.university}</p>
        </div>
      </div>
      <div className={styles.courseContainer}>
        {professor.courses.map((course, index) => (
          <div key={index} className={styles.courseItem}>
            {course}
          </div>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={() => navigate("/professors")}>Back</button>
      </div>
    </div>
  );
};

export default ProfessorInfo;
