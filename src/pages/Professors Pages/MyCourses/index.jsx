import React from "react";
import styles from "./MyCourses.module.scss";
import img1 from "../../../assets/images/image-courses/microeconomics.png";
import img2 from "../../../assets/images/image-courses/microeconomics2.png";
const courses = [
  {
    id: 1,
    title: "Microeconomics 1",
    code: "ECON101",
    instructors: ["G.Uzuner", "M.Rasim"],
    schedule: "Thu & Fri, 10:00 AM - 12:00 AM",
    location: "L106 & L107",
    level: "Undergraduate, Freshman",
    students: "45/60 students",
    image: img1,
  },
  {
    id: 2,
    title: "Microeconomics 1",
    code: "ECON101",
    instructors: ["G.Uzuner", "M.Rasim"],
    schedule: "Thu & Fri, 10:00 AM - 12:00 AM",
    location: "L106 & L107",
    level: "Undergraduate, Freshman",
    students: "45/60 students",
    image: img2,
  },
];

const MyCourses = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>My courses</h3>
          <button className={styles.createButton}>+ Create new course</button>
        </div>
        <div></div>
        <div className={styles.courseList}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <img
                src={course.image}
                alt={course.title}
                className={styles.courseImage}
              />
              <div className={styles.courseInfo}>
                <h4>{course.title}</h4>
                <p className={styles.courseCode}># {course.code}</p>
                <p className={styles.instructors}>
                  📖 {course.instructors.join(" ")}
                </p>
                <p>⏰ {course.schedule}</p>
                <p>📍 {course.location}</p>
                <p>📄 {course.level}</p>
                <p>👥 {course.students}</p>
              </div>
              <button className={styles.manageButton}>Manage course</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
