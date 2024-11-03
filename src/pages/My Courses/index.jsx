import React, { useState, useEffect } from "react";
import styles from "./MyCourses.module.scss";
import searchimg from "../../assets/images/search.png";
import addCourseImg from "../../assets/images/AddCourse.png";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    semester: "Fall 2025",
    credit: "6",
    passingPoint: "40",
  });

  useEffect(() => {
    const courseData = [
      {
        id: 1,
        name: "OOP",
        semester: "Fall 2025",
        credit: 6,
        passingPoint: 40,
      },
      {
        id: 2,
        name: "Database",
        semester: "Spring 2024",
        credit: 3,
        passingPoint: 50,
      },
      {
        id: 3,
        name: "Programming",
        semester: "Fall 2021",
        credit: 6,
        passingPoint: 40,
      },
      {
        id: 4,
        name: "Java",
        semester: "Fall 2022",
        credit: 3,
        passingPoint: 50,
      },
      {
        id: 5,
        name: "Algorithms",
        semester: "Spring 2023",
        credit: 6,
        passingPoint: 40,
      },
      {
        id: 6,
        name: "Backend development",
        semester: "Fall 2023",
        credit: 3,
        passingPoint: 50,
      },
      {
        id: 7,
        name: "Frontend development",
        semester: "Fall 2023",
        credit: 6,
        passingPoint: 50,
      },
      {
        id: 8,
        name: "Data Structures",
        semester: "Fall 2025",
        credit: 3,
        passingPoint: 40,
      },
      {
        id: 9,
        name: "Software Engineering",
        semester: "Spring 2024",
        credit: 3,
        passingPoint: 50,
      },
      {
        id: 10,
        name: "Web Development",
        semester: "Spring 2023",
        credit: 6,
        passingPoint: 40,
      },
    ];
    setCourses(courseData);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSemester = course.semester === filters.semester;
    const matchesCredit = course.credit.toString() === filters.credit;
    const matchesPassingPoint =
      course.passingPoint.toString() === filters.passingPoint;

    return (
      matchesSearch && matchesSemester && matchesCredit && matchesPassingPoint
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

  const handleSyllabusClick = (courseId) => {
    navigate(`/syllabus/${courseId}`);
  };

  return (
    <div className={styles.coursesPage}>
      <h1>My courses:</h1>
      <div className={styles.coursesContainer}>
        <div className={styles.coursesList}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="button">
              <img src={searchimg} alt="Search" />
            </button>
          </div>
          <div className={styles.scrollableBox}>
            {filteredCourses.map((course) => (
              <div className={styles.courseItem} key={course.id}>
                <div className={styles.courseDetails}>
                  <h3>{course.name}</h3>
                  <p>{course.semester}</p>
                </div>
                <button
                  className={styles.syllabusButton}
                  onClick={() => handleSyllabusClick(course.id)}
                >
                  Syllabus
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.courseFilter}>
          <h2>Filter:</h2>
          <div className={styles.filterGroup}>
            <label>Select semester:</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
            >
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Spring 2023">Spring 2023</option>
              <option value="Fall 2022">Fall 2022</option>
              <option value="Fall 2021">Fall 2021</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Select credit:</label>
            <select
              name="credit"
              value={filters.credit}
              onChange={handleFilterChange}
            >
              <option value="6">6</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Select course's passing point:</label>
            <select
              name="passingPoint"
              value={filters.passingPoint}
              onChange={handleFilterChange}
            >
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
          <div
            className={styles.addCourse}
            onClick={() => navigate("/add-course")}
          >
            <img src={addCourseImg} alt="Add new course" />
            <p>Add new course</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
