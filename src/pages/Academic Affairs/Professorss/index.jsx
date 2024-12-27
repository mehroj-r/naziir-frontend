import React from "react";
import styles from "./Professorss.module.scss";

function Professorss() {
  const professors = [
    { name: "Sultanbek Erkinbaev", code: "MNG", section: "SE" },
    { name: "Sultanbek Erkinbeav", code: "GD", section: "SE" },
    { name: "Sultanbek Erkinbaev", code: "SD", section: "SE" },
  ];

  const departments = [
    { name: "Industrial Management", count: "16 professors" },
    { name: "Software Engineering", count: "16 professors" },
    { name: "Mechanical Engineering", count: "16 professors" },
  ];

  return (
    <div className={styles.Pagebody}>
      <h1>Professor</h1>
      <div className={styles.container}>
        <div className={styles.leftPart}>
          <div className={styles.searchSection}>
            <input type="text" placeholder="Search professor..." />
          </div>
          <div className={styles.professorList}>
            {professors.map((professor, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.avatar}></div>
                <span>{professor.name}</span>
                <span>
                  {professor.code} {professor.section}
                </span>
                <button className={styles.detailsButton}>Details</button>
              </div>
            ))}
          </div>
          <div className={styles.searchSection} style={{ marginTop: "20px" }}>
            <input type="text" placeholder="Search department..." />
          </div>
          <div className={styles.departmentList}>
            {departments.map((dept, index) => (
              <div key={index} className={styles.listItem}>
                <span>{dept.name}</span>
                <button className={styles.detailsButton}>{dept.count}</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightPart}>
          <div className={styles.addButtons}>
            <button>+ Add professor</button>
            <button>+ Add Department</button>
          </div>
          <div className={styles.statisticsContainer}>
            <div className={styles.statisticsSection}>
              <h3>Professor's statistics:</h3>
            </div>

            <div className={styles.statisticsSection}>
              <h3>Department's statistics:</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Professorss;
