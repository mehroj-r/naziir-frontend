import React from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Groups.module.scss";
import { useGroups } from "@/services/groups.service";

const Groups = () => {

  const { data, isLoading } = useGroups({
    params: { page: 1, limit: 10 },
  });


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
            {data?.data?.data?.map((group) => (
              <tr key={group?.id}>
                <td>{group?.name}</td>
                <td>{group?.department}</td>
                <td>{group?.students}</td>
                <td>{group?.avgGrade}</td>
                <td>{group?.year}</td>
                <td>{group?.ended}</td>
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
