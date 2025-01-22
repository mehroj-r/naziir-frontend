import React from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Courses.module.scss";

const coursesData = [
  {
    course: "Economics 101",
    professor: "Dr. John Smith",
    students: 120,
    avgGrade: "B+",
    started: "Jun 1, 2024",
    ended: "Active",
  },
  {
    course: "Mathematics 201",
    professor: "Dr. Jane Doe",
    students: 150,
    avgGrade: "A-",
    started: "Jun 1, 2024",
    ended: "Active",
  },
  {
    course: "History 301",
    professor: "Dr. Michael Johnson",
    students: 110,
    avgGrade: "B",
    started: "Jun 1, 2024",
    ended: "Active",
  },
  {
    course: "Psychology 401",
    professor: "Dr. Emily Brown",
    students: 130,
    avgGrade: "A",
    started: "Jun 1, 2024",
    ended: "Active",
  },
  {
    course: "Physics 501",
    professor: "Dr. David Wilson",
    students: 140,
    avgGrade: "B-",
    started: "Jun 1, 2024",
    ended: "Active",
  },
  {
    course: "Chemistry 601",
    professor: "Dr. Sarah Lee",
    students: 160,
    avgGrade: "A+",
    started: "Jun 1, 2024",
    ended: "Active",
  },
];

const ACourses = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Courses</h1>
        <button className={styles.newCourseButton}>+ New course</button>
      </div>
      <div className={styles.Searchbar}>
          <SearchIcon />
        <input type="text" placeholder="Search professors" />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Professor</th>
              <th>Students</th>
              <th>Avg grade</th>
              <th>Started</th>
              <th>Ended</th>
            </tr>
          </thead>
          <tbody>
            {coursesData.map((course, index) => (
              <tr key={index}>
                <td>{course.course}</td>
                <td>{course.professor}</td>
                <td>{course.students}</td>
                <td>{course.avgGrade}</td>
                <td>{course.started}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      course.ended === "Active" ? styles.active : ""
                    }`}
                  >
                    {course.ended}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ACourses;
