import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PCourseDetail.module.scss";
import { courseService } from "../../../services/course.service";
import { professorService } from "../../../services/professors.service";
import { quizService } from "../../../services/quizService";

const PCourseIdPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await courseService.getById(courseId);
        const courseData = response.data;
        setCourse(courseData);

        const allQuizzesResponse = await quizService.getAll();
        const allQuizzes =
          allQuizzesResponse?.data?.data ?? allQuizzesResponse?.data ?? [];
        const courseQuizzes = allQuizzes.filter(
          (quiz) => quiz.courseId === courseId
        );

        setQuizzes(courseQuizzes);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className={styles.coursePage}>
      <div className={styles.header}>
        <h1>{course.courseName}</h1>
      </div>

      <div className={styles.details}>
        <div>
          <p>
            <strong>Course Code:</strong> {course.courseCode}
          </p>
          <p>
            <strong>Course Name:</strong> {course.courseName}
          </p>
          <p>
            <strong>Course Type:</strong> {course.courseType}
          </p>
          <p>
            <strong>Academic Term:</strong> {course.academicTerm}
          </p>
          <p>
            <strong>Credits:</strong> {course.credits}
          </p>
          <p>
            <strong>Academic Year:</strong> {course.academicYear}
          </p>
        </div>
      </div>

      <div className={styles.quizList}>
        <h3>Associated Quizzes</h3>
        {quizzes.length === 0 ? (
          <p className={styles.noGroups}>No quizzes assigned yet.</p>
        ) : (
          <table className={styles.groupTable}>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.status}</td>
                  <td>
                    <button onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                      See
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PCourseIdPage;
