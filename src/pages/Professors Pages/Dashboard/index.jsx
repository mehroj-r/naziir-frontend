import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GradeQuizzesIcon,
  NewquizzesIcon,
  Ongoingquizzes,
  Pastquizzes,
  Upcomingquizzes,
} from "../../../assets/icons/professorsDashboardIcons";
import styles from "./Dashboard.module.scss";

const sampleData = {
  quickAccess: [
    {
      title: "Ongoing quizzes",
      icon: <Ongoingquizzes />,
      route: "/ongoing-quizzes",
    },
    {
      title: "Upcoming quizzes",
      icon: <Upcomingquizzes />,
      route: "/upcoming-quizzes",
    },
    {
      title: "Past quizzes",
      icon: <Pastquizzes />,
      route: "/past-quizzes",
    },
  ],
  messages: [
    {
      title: "1 hour left",
      content: "After 1 hour Quiz 17 from Economics 101 will start on NSE 05",
    },
    {
      title: "Evaluate NSE 05 from MNG101",
      content: "Check results of NSE 05 from Quiz 17 MNG101",
    },
    { title: "Sultanbek Erkinbaev", content: "I ask to evaluate my quiz" },
    { title: "Sultanbek Erkinbaev", content: "I ask to evaluate my quiz" },
    { title: "Sultanbek Erkinbaev", content: "I ask to evaluate my quiz" },
    { title: "Sultanbek Erkinbaev", content: "I ask to evaluate my quiz" },
  ],
};

const PDashboard = () => {
  const [data, setData] = useState(sampleData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAllMessages, setShowAllMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className={styles.empty}></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate();
      days.push(
        <td key={day} className={isToday ? styles.active : ""}>
          {day}
        </td>
      );
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
    }

    return weeks;
  };

  const handleToggleMessages = () => {
    setShowAllMessages((prev) => !prev);
  };

  const visibleMessages = showAllMessages
    ? data.messages
    : data.messages.slice(0, 4);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Hello, professor Juraev</h1>
        <div className={styles.headerActions}>
          <button>
            <GradeQuizzesIcon /> Grade Quizzes
          </button>
          <button>
            <NewquizzesIcon /> New Quiz
          </button>
        </div>
      </div>

      <h2>Quick access</h2>
      <div className={styles.quickAccess}>
        {data?.quickAccess?.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => navigate(item.route)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.icon}>{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      <div className={styles.messagecalendar}>
        <div className={styles.messagesSection}>
          <div className={styles.messagesHeader}>
            <h2>Important messages:</h2>
            <a
              href="#"
              className={styles.seeAll}
              onClick={handleToggleMessages}
            >
              {showAllMessages ? "Show less ⬇" : "See all ➡"}
            </a>
          </div>
          {visibleMessages.map((message, index) => (
            <div key={index} className={styles.messageCard}>
              <h4>{message.title}</h4>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <div className={styles.calendar}>
          <h2>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Su</th>
                <th>M</th>
                <th>T</th>
                <th>W</th>
                <th>T</th>
                <th>F</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>{generateCalendar()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PDashboard;
