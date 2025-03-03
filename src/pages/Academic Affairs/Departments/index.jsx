import React, { useMemo } from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Departments.module.scss";
import { useNavigate } from "react-router-dom";
import { useDepartments } from "@/services/department.service";

function Departments() {
  const navigate = useNavigate();
  
  const { data, isLoading } = useDepartments({
    params: { page: 1, limit: 10 },
  });

  const departments = useMemo(() => {
    return data?.data?.data
  }, [data])

  if(isLoading){
    return (
      <>Loading...</>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Departments</h1>
        <button
          className={styles.newDeptButton}
          onClick={() => navigate("/departments/create")}
        >
          + New department
        </button>
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
          {departments.map((item, index) => (
            <tr key={index}>
              <td>{item?.name}</td>
              <td>{item?.professor}</td>
              <td>{item?.students}</td>
              <td>{item?.subjects}</td>
              <td>{item?.head}</td>
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
