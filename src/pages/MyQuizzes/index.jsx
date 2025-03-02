import React, { useState, useEffect } from "react";
import styles from "./MyQuizzes.module.scss";
import bgImage from "../../assets/images/background.png";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../assets/icons/headerIcons";

const defaultQuizData = [
  {
    id: 1,
    name: "Quiz 1",
    subject: "Algorithms and Structure",
    questions: 30,
    status: "Completed",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 2,
    name: "Quiz 2",
    subject: "Data Structures",
    questions: 30,
    status: "Uncompleted",
    semester: "Fall 2025",
    group: "Group B",
  },
  {
    id: 3,
    name: "Quiz 3",
    subject: "Algorithms and Structure",
    questions: 30,
    status: "Completed",
    semester: "Spring 2025",
    group: "NSE 05",
  },
  {
    id: 4,
    name: "Quiz 4",
    subject: "Data Structures",
    questions: 30,
    status: "Completed",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 5,
    name: "Quiz 5",
    subject: "Algorithms and Structure",
    questions: 20,
    status: "Uncompleted",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 6,
    name: "Quiz 6",
    subject: "Data Structures",
    questions: 25,
    status: "Completed",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 7,
    name: "Quiz 7",
    subject: "Algorithms and Structure",
    questions: 15,
    status: "Uncompleted",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 8,
    name: "Quiz 8",
    subject: "Data Structures",
    questions: 18,
    status: "Completed",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 9,
    name: "Quiz 9",
    subject: "Algorithms and Structure",
    questions: 22,
    status: "Completed",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 10,
    name: "Quiz 10",
    subject: "Data Structures",
    questions: 10,
    status: "Uncompleted",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 11,
    name: "Quiz 11",
    subject: "Algorithms and Structure",
    questions: 35,
    status: "Completed",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 12,
    name: "Quiz 12",
    subject: "Data Structures",
    questions: 40,
    status: "Uncompleted",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 13,
    name: "Quiz 13",
    subject: "Algorithms and Structure",
    questions: 28,
    status: "Completed",
    semester: "Fall 2025",
    group: "NSE 05",
  },
  {
    id: 14,
    name: "Quiz 14",
    subject: "Data Structures",
    questions: 30,
    status: "Uncompleted",
    semester: "Spring 2025",
    group: "Group B",
  },
  {
    id: 15,
    name: "Quiz 15",
    subject: "Algorithms and Structure",
    questions: 32,
    status: "Completed",
    semester: "Fall 2025",
    group: "NSE 05",
  },
];

const QuizzesPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(defaultQuizData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    semester: "Fall 2025",
    subject: "Algorithms and Structure",
    group: "NSE 05",
    status: "All",
  });

  const handleQuizClick = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject = quiz.subject === filters.subject;
    const matchesSemester = quiz.semester === filters.semester;
    const matchesGroup = quiz.group === filters.group;
    const matchesStatus =
      filters.status === "All" || quiz.status === filters.status;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesSemester &&
      matchesGroup &&
      matchesStatus
    );
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.quizzesPage}>
      <img src={bgImage} alt="Background Left" className={styles.bgLeft} />
      <img src={bgImage} alt="Background Right" className={styles.bgRight} />
      <h1>My quizzes:</h1>
      <div className={styles.quizzesContainer}>
        <div className={styles.quizzesList}>
          <div className={styles.searchBar}>
            <div className={styles.input}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <SearchIcon />
            </div>
          </div>
          <div className={styles.scrollableBox}>
            {filteredQuizzes.map((quiz) => (
              <div className={styles.quizItem} key={quiz.id}>
                <div className={styles.quizDetails}>
                  <div>
                    <h3>{quiz.name}</h3>
                    <p>{quiz.subject}</p>
                  </div>
                  <div className={styles.nmbquestions}>
                    <p>Number of questions: {quiz.questions}</p>
                  </div>
                </div>
                <div
                  onClick={() => handleQuizClick(quiz.id)}
                  className={`${styles.quizStatus} ${
                    styles[quiz.status.toLowerCase()]
                  }`}
                >
                  <p>{quiz.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.quizFilter}>
          <h2>Filter:</h2>
          <div className={styles.filterGroup}>
            <label>Select semester:</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
            >
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2025">Spring 2025</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Select subject:</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="Algorithms and Structure">
                Algorithms and Structure
              </option>
              <option value="Data Structures">Data Structures</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Select group:</label>
            <select
              name="group"
              value={filters.group}
              onChange={handleFilterChange}
            >
              <option value="NSE 05">NSE 05</option>
              <option value="Group B">Group B</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Select status:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Uncompleted">Uncompleted</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;
