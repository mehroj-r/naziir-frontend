import React, { useState } from "react";
import styles from "./MyCourses.module.scss";

const courses = [
  { course: "Economics 101", professor: "Dr. John Smith", students: 120, avgGrade: "B+", started: "Jun 1, 2022", ended: "Active" },
  { course: "Mathematics 201", professor: "Dr. Jane Doe", students: 150, avgGrade: "A-", started: "Jun 1, 2022", ended: "Active" },
  { course: "History 301", professor: "Dr. Michael Johnson", students: 110, avgGrade: "B", started: "Jun 1, 2022", ended: "Active" },
  { course: "Psychology 401", professor: "Dr. Emily Brown", students: 130, avgGrade: "A", started: "Jun 1, 2022", ended: "Active" },
  { course: "Physics 501", professor: "Dr. David Wilson", students: 140, avgGrade: "B-", started: "Jun 1, 2022", ended: "Active" },
  { course: "Chemistry 601", professor: "Dr. Sarah Lee", students: 160, avgGrade: "A+", started: "Jun 1, 2022", ended: "Active" },
];

const MyCourses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.myCourses}>
     
      <div className={styles.header}>
        <h2 className={styles.title}>Courses</h2>
        <div className={styles.searchWrapper}>
          <input className={styles.searchBar} type="text" placeholder="Search for a course" />
          <button className={styles.addCourseButton} onClick={() => setIsModalOpen(true)}>
            + New Course
          </button>
        </div>
      </div>

     
      <table className={styles.coursesTable}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Professor</th>
            <th>Students</th>
            <th>Avg Grade</th>
            <th>Started</th>
            <th>Ended</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.course}</td>
              <td>{course.professor}</td>
              <td>{course.students}</td>
              <td>{course.avgGrade}</td>
              <td>{course.started}</td>
              <td>
                <span className={styles.status}>{course.ended}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>New Course</h3>
            <input className={styles.modalInput} type="text" placeholder="Course Info 1" />
            <input className={styles.modalInput} type="text" placeholder="Course Professor" />
            <input className={styles.modalInput} type="text" placeholder="Course Range" />
            <button className={styles.modalButton}>Add Course</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;