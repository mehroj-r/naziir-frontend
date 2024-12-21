import React, { useState } from "react";
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

const availableCourses = [
  "Course CS 61A",
  "Course CS 61B",
  "Course CS 61C",
  "Course EECS 16A",
  "Course EECS 16B",
  "Course CS 70",
];

const ProfessorInfo = () => {
  const { professorId } = useParams();
  const navigate = useNavigate();
  const [showCourseList, setShowCourseList] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const professor = professorsData.find((prof) => prof.id === professorId);

  const toggleCourseList = () => {
    setShowCourseList((prev) => !prev);
  };

  const handleAssignCourse = (course) => {
    if (!selectedCourses.includes(course)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
  };

  const handleSave = () => {
    console.log("Assigned courses:", selectedCourses);
    alert("Courses assigned successfully!");
    setShowCourseList(false);
  };

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
      <div className={styles.buttonGroup}>
        <button onClick={() => navigate("/professors")}>Back</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={toggleCourseList}>Assign Courses</button>
      </div>
      <div className={styles.coursescontainer}>
        <div className={styles.selectedCourses}>
          {selectedCourses.length > 0 && (
            <div className={styles.selectedCourses}>
              {selectedCourses.map((course, index) => (
                <div key={index} className={styles.courseItem}>
                  {course}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.courses}>
          {showCourseList && (
            <div className={styles.courseList}>
              {availableCourses.map((course, index) => {
                const [prefix, ...rest] = course.split(" ");
                const courseCode = rest.join(" ");
                return (
                  <div key={index} className={styles.courseItem}>
                    <span style={{ marginRight: "-5vw" }}>{prefix}</span>
                    <span>{courseCode}</span>
                    <button onClick={() => handleAssignCourse(course)}>
                      Assign course
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorInfo;
