import React, { useState } from "react";
import styles from "./NewDepartment.module.scss";

const assignedCourses = ["Course CS 61A", "Course CS 61B"];
const assignedProfessors = ["Sirojiddin Juraev", "Lee Sang Hyuook"];

const availableCourses = [
  "Course CS 61C",
  "Course EECS 16A",
  "Course EECS 16B",
  "Course CS 70",
];

const availableProfessors = [
  "Sultanbek Erkinbaev 1",
  "Sultanbek Erkinbaev 2",
  "Sultanbek Erkinbaev 3",
  "Sultanbek Erkinbaev 4",
];

const NewDepartment = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [showProfessors, setShowProfessors] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState(assignedCourses);
  const [selectedProfessors, setSelectedProfessors] =
    useState(assignedProfessors);
  const [departmentName, setDepartmentName] = useState("");
  const [headProfessor, setHeadProfessor] = useState("Lee Sang Hyook");

  const toggleCourses = () => setShowCourses((prev) => !prev);
  const toggleProfessors = () => setShowProfessors((prev) => !prev);

  const assignCourse = (course) => {
    if (!selectedCourses.includes(course)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
  };

  const assignProfessor = (professor) => {
    if (!selectedProfessors.includes(professor)) {
      setSelectedProfessors((prev) => [...prev, professor]);
    }
  };

  const saveAssignments = () => {
    console.log("Department Name:", departmentName);
    console.log("Head Professor:", headProfessor);
    console.log("Assigned Courses:", selectedCourses);
    console.log("Assigned Professors:", selectedProfessors);
    alert("Assignments saved successfully!");
    setShowCourses(false);
    setShowProfessors(false);
  };

  return (
    <div className={styles.newDepartment}>
      <div className={styles.rightside}>
        <h1>New Department</h1>
        <div className={styles.info}>
          <div className={styles.inputGroup}>
            <label htmlFor="departmentName">
              <strong>Department Name:</strong>
            </label>
            <input
              type="text"
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="headProfessor">
              <strong>Head of Department:</strong>
            </label>
            <input
              type="text"
              id="headProfessor"
              value={headProfessor}
              onChange={(e) => setHeadProfessor(e.target.value)}
              placeholder="Enter head professor"
            />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={toggleCourses}>+Assign courses</button>
          <button onClick={toggleProfessors}>+Assign professors</button>
          <button className={styles.saveButton} onClick={saveAssignments}>
            Save & Assign
          </button>
        </div>
        <div className={styles.assignedSection}>
          <div className={styles.assignedList}>
            <div>
              <h3>Courses</h3>
              {selectedCourses.map((course, index) => (
                <p key={index}>{course}</p>
              ))}
            </div>
            <div>
              <h3>Professors</h3>
              {selectedProfessors.map((professor, index) => (
                <p key={index}>{professor}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.leftside}>
        <div className={styles.availablelists}>
          {showCourses && (
            <div className={styles.availableList}>
              {availableCourses.map((course, index) => {
                const [prefix, ...rest] = course.split(" ");
                const courseCode = rest.join(" ");
                return (
                  <div key={index} className={styles.listItem}>
                    <span style={{ marginRight: "-30px" }}>{prefix}</span>
                    <span>{courseCode}</span>
                    <button onClick={() => assignCourse(course)}>
                      Assign course
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {showProfessors && (
            <div className={styles.availableList}>
              {availableProfessors.map((professor, index) => {
                const [firstName, ...lastNameParts] = professor.split(" ");
                const lastName = lastNameParts.join(" ");
                return (
                  <div key={index} className={styles.listItem}>
                    <span style={{ marginRight: "-40px" }}>{firstName}</span>
                    <span>{lastName}</span>
                    <button onClick={() => assignProfessor(professor)}>
                      Assign professor
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDepartment;
