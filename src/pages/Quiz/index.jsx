import React, { useState } from "react";
import styles from "./Quiz.module.scss";
// import searchimg from "../../assets/images/search.png";

const quizData = [
  { id: 1, name: "NSE 05", subject: "Economics 112" },
  { id: 2, name: "NSE 04", subject: "Economics 112" },
  { id: 3, name: "NSE 03", subject: "Economics 112" },
  { id: 4, name: "NSE 01", subject: "Economics 112" },
  { id: 5, name: "NSE 02", subject: "Economics 112" },
  { id: 6, name: "NSE 01", subject: "Economics 112" },
];

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizData.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.economicsPage}>

      <div className={styles.header}>
        <h1>Quiz1</h1>
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
        {/* <img src={searchimg} alt="Search" /> */}
      </div>


      <div className={styles.quizTableContainer}>
        <table className={styles.quizTable}>
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Subject</th>
              <th>Avg.grade</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.name}</td>
                <td>{quiz.subject}</td>
                <td>
                  <button className={styles.viewButton}>70</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizPage;