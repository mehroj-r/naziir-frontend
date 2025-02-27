import React, { useState } from "react";
import styles from "./Economics.module.scss";
import searchimg from "../../assets/images/search.png";

const quizData = [
  { id: 1, name: "Quiz 1", subject: "Economics 112" },
  { id: 2, name: "Quiz 2", subject: "Economics 112" },
  { id: 3, name: "Quiz 3", subject: "Economics 112" },
  { id: 4, name: "Quiz 4", subject: "Economics 112" },
  { id: 5, name: "Quiz 5", subject: "Economics 112" },
  { id: 6, name: "Quiz 6", subject: "Economics 112" },
];

const EconomicsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizData.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.economicsPage}>

      <div className={styles.header}>
        <h1>Economics 101</h1>
        <button className={styles.deleteButton}>Delete</button>
      </div>


      <div className={styles.details}>
        <div className={styles.detailsRow}>
          <span className={styles.detailLabel}>Semester</span>
          <span className={styles.detailValue}>Fall 2023</span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailLabel}>Professor</span>
          <span className={styles.detailValue}>Dr. Jane Doe</span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailLabel}>Passing Point</span>
          <span className={styles.detailValue}>60%</span>
        </div>
      </div>


      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img src={searchimg} alt="Search" />
      </div>


      <div className={styles.quizTableContainer}>
        <table className={styles.quizTable}>
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Subject</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.name}</td>
                <td>{quiz.subject}</td>
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

export default EconomicsPage;