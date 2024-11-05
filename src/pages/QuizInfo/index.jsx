import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./QuizInfo.module.scss";

const QuizInfo = () => {
  const { quizId } = useParams();
  const [students, setStudents] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    const exampleStudents = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      name: `Student ${index + 1}`,
      studentId: `210193${index}`,
      group: index % 2 === 0 ? "NSE04" : "NSE05",
    }));
    setStudents(exampleStudents);

    const fetchQuizData = async () => {
      const quizzes = [
        {
          id: 1,
          name: "Quiz 1",
          subject: "Algorithms",
          groups: ["NSE05", "NSE04"],
          status: "Completed",
        },
      ];

      const selectedQuiz = quizzes.find((q) => q.id === parseInt(quizId));
      setQuiz(selectedQuiz);
    };

    fetchQuizData();
  }, [quizId]);

  const handleStatusChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      status: prevQuiz.status === "Completed" ? "Uncompleted" : "Completed",
    }));
  };

  const handleDeleteGroup = (groupToDelete) => {
    if (quiz.groups.length > 1) {
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        groups: prevQuiz.groups.filter((group) => group !== groupToDelete),
      }));
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.group !== groupToDelete)
      );
    }
  };

  const handleAddGroup = () => {
    const formattedGroup = newGroup.toUpperCase().replace(/\s+/g, "");

    if (formattedGroup && !quiz.groups.includes(formattedGroup)) {
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        groups: [...prevQuiz.groups, formattedGroup],
      }));
      setNewGroup("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]:
        name === "subject" ? value : value.toUpperCase().replace(/\s+/g, ""),
    }));
  };

  const updateQuiz = async () => {
    try {
      await fetch(`https://......../quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });
      alert("Quiz updated successfully!");
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className={styles.quizInfoPage}>
      <h1 className={styles.pageTitle}>Quiz Information</h1>
      <div className={styles.container}>
        <div className={styles.quizInfo}>
          <h2>Quiz Info:</h2>
          <div className={styles.infoField}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={quiz.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.infoField}>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={quiz.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.infoField}>
            <label>Assigned Groups</label>
            <div className={styles.assignedGroups}>
              {quiz.groups.map((group, index) => (
                <span key={index} className={styles.groupBadge}>
                  {group}
                  {quiz.groups.length > 1 && (
                    <span
                      className={styles.deleteGroup}
                      onClick={() => handleDeleteGroup(group)}
                    >
                      x
                    </span>
                  )}
                </span>
              ))}
              <div className={styles.addGroupDiv}>
                <input
                  type="text"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  placeholder="Add new group"
                  className={styles.addGroupInput}
                />
                <button onClick={handleAddGroup} className={styles.addButton}>
                  Add
                </button>
              </div>
            </div>
          </div>
          <div
            className={`${styles.statusBadge} ${
              quiz.status === "Completed"
                ? styles.completed
                : styles.uncompleted
            }`}
            onClick={handleStatusChange}
          >
            {quiz.status}
          </div>
          <button className={styles.updateButton} onClick={updateQuiz}>
            Update
          </button>
        </div>
        <div className={styles.studentsList}>
          <h2>List of Students:</h2>
          <div className={styles.studentItems}>
            {students.map((student) => (
              <div className={styles.studentItem} key={student.id}>
                <img src="" alt="" className={styles.avatar} />
                <span className={styles.studentName}>{student.name}</span>
                <span className={styles.studentId}>{student.studentId}</span>
                <span className={styles.studentGroup}>{student.group}</span>
                <button className={styles.resultsButton}>Results</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInfo;
