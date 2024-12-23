import React from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Departments.module.scss";

function Departments() {
  const departments = [
    {
      name: "Software Engineering",
      professor: 10,
      students: 120,
      subjects: 10,
      head: "Sirojiddin Juraev",
    },
    {
      name: "Chemical Engineering",
      professor: 10,
      students: 150,
      subjects: 10,
      head: "Lee",
    },
    {
      name: "Industrial Management",
      professor: 10,
      students: 110,
      subjects: 10,
      head: "Lee",
    },
    {
      name: "Physical Engineering",
      professor: 10,
      students: 130,
      subjects: 10,
      head: "Lee",
    },
    {
      name: "Pedagogics",
      professor: 10,
      students: 130,
      subjects: 10,
      head: "Lee",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Departments</h1>
        <button className={styles.newDeptButton}>+ New department</button>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
        <input type="text" placeholder="Search for a course" />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Department</th>
            <th>Professor</th>
            <th>Students</th>
            <th>Subjects</th>
            <th>Head of department</th>
            <th>See</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={index}>
              <td>{dept.name}</td>
              <td>{dept.professor}</td>
              <td>{dept.students}</td>
              <td>{dept.subjects}</td>
              <td>{dept.head}</td>
              <td>
                <button className={styles.viewButton}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Departments;
