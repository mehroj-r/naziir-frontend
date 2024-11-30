import React from "react";
import styles from "./StudentResults.module.scss";
import ai_image from "../../assets/images/ai_image.png";
const sampleResults = {
  correctAnswers: [1, 5, 6, 9, 11, 12, 2],
  wrongAnswers: [
    3, 4, 7, 8, 10, 13, 14, 4, 7, 8, 10, 13, 14, 4, 7, 8, 10, 13, 14,
  ],
  totalPoints: 70,
};

const StudentResults = () => {
  const { correctAnswers, wrongAnswers, totalPoints } = sampleResults;

  return (
    <div className={styles.studentResultsPage}>
      <h1 className={styles.pageTitle}>Your results:</h1>
      <div className={styles.resultsContainer}>
        <div className={styles.answersBox}>
          <h2>Right answers:</h2>
          <div className={styles.answerList}>
            {correctAnswers.map((number, index) => (
              <span
                key={index}
                className={`${styles.answer} ${styles.correct}`}
              >
                {number}
              </span>
            ))}
          </div>

          <h2>Wrong answers:</h2>
          <div className={styles.answerList}>
            {wrongAnswers.map((number, index) => (
              <span
                key={index}
                className={`${styles.answer} ${styles.incorrect}`}
              >
                {number}
              </span>
            ))}
          </div>

          <p className={styles.totalPoints}>Total: {totalPoints} points</p>
        </div>

        <div className={styles.aiBox}>
          <img src={ai_image} />
          <h2>Check by AI</h2>
          <p>
            Check your written responses by AI faster and more efficiently than
            hand-checking.
          </p>
        </div>
      </div>

      <button className={styles.backButton}>Back</button>
    </div>
  );
};

export default StudentResults;
