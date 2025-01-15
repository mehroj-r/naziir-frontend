import React from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Groups.module.scss";

const Groups = () => {
  const groups = [
    {
      id: 1,
      groupName: "NSE05",
      department: "Software Eng",
      students: 20,
      avgGrade: "B+",
      started: "Jun 1, 2022",
      ended: "-",
    },
    {
      id: 2,
      groupName: "NSE05",
      department: "Software Eng",
      students: 20,
      avgGrade: "A-",
      started: "Jun 1, 2022",
      ended: "-",
    },
    {
      id: 3,
      groupName: "NSE04",
      department: "Software Eng",
      students: 20,
      avgGrade: "B",
      started: "Jun 1, 2022",
      ended: "-",
    },
    {
      id: 4,
      groupName: "NSE03",
      department: "Software Eng",
      students: 20,
      avgGrade: "A",
      started: "Jun 1, 2022",
      ended: "-",
    },
    {
      id: 5,
      groupName: "NSE02",
      department: "Software Eng",
      students: 20,
      avgGrade: "A+",
      started: "Jun 1, 2022",
      ended: "-",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Groups</h1>
        <button className={styles.addButton}>+ New group</button>
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
              <th>Group name</th>
              <th>Department</th>
              <th>Students</th>
              <th>Avg grade</th>
              <th>Started</th>
              <th>Ended</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.groupName}</td>
                <td>{group.department}</td>
                <td>{group.students}</td>
                <td>{group.avgGrade}</td>
                <td>{group.started}</td>
                <td>{group.ended}</td>
                <td>
                  <button className={styles.viewButton}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Groups;
