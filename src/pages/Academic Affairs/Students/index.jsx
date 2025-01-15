import React from "react";
import styles from "./Students.module.scss";
import imgprofile from "../../../assets/images/sultan.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";

const students = [
  {
    id: 1,
    name: "Sultanbek Erkinbaev",
    group: "NSE 04",
    grade: "A",
    avatar: imgprofile,
  },
  {
    id: 2,
    name: "Sultanbek Erkinbaev",
    group: "NSE 04",
    grade: "A",
    avatar: imgprofile,
  },
  {
    id: 3,
    name: "Sultanbek Erkinbaev",
    group: "NSE 04",
    grade: "A",
    avatar: imgprofile,
  },
  {
    id: 4,
    name: "Sultanbek Erkinbaev",
    group: "JSE 05",
    grade: "B+",
    avatar: imgprofile,
  },
  {
    id: 5,
    name: "Sultanbek Erkinbaev",
    group: "NSE 04",
    grade: "B",
    avatar: imgprofile,
  },
  {
    id: 6,
    name: "Sultanbek Erkinbaev",
    group: "NSE 04",
    grade: "A-",
    avatar: imgprofile,
  },
  {
    id: 7,
    name: "Sultanbek Erkinbaev",
    group: "NSE 03",
    grade: "A+",
    avatar: imgprofile,
  },
];

const Students = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Students</h1>
          <p>Manage and view student profiles</p>
        </div>
        <button className={styles.addButton}>+ Add student</button>
      </div>

      <div className={styles.Searchbar}>
        <button>
          <SearchIcon />
        </button>
        <input type="text" placeholder="Search professors" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th className={styles.name}>Student name</th>
              <th>Groups</th>
              <th>Avg Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <img src={student.avatar} alt="avatar" />
                </td>
                <td>{student.name}</td>
                <td>{student.group}</td>
                <td>{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
