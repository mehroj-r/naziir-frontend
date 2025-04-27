import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { userActions } from "../store/slices/userSlice";
import { customToast } from "../utils/toastify";
import CoursesPage from "../pages/MyCourses";
import Dashboard from "../pages/Dashboard";
import QuizzesPage from "../pages/MyQuizzes";
import Statistics from "../pages/Statistics";
import QuizInfo from "../pages/QuizInfo";
import AddCourse from "../pages/AddCourse";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import CreateQuiz from "../pages/CreateQuiz";
import NotFoundPage from "../pages/NotFoundPage";
import StudentResults from "../pages/StudentResults";
import AADashboard from "../pages/Academic Affairs/AADashboard";
import Professors from "../pages/Academic Affairs/Professors";
import ProfessorInfo from "../pages/Academic Affairs/ProfessorInfo";
import ACourses from "../pages/Academic Affairs/Courses";
import Departments from "../pages/Academic Affairs/Departments";
import NewDepartment from "../pages/Academic Affairs/NewDepartment";
import Students from "../pages/Academic Affairs/Students";
import Groups from "../pages/Academic Affairs/Groups";
import NotificationsPage from "../pages/Notifications";
import NotificationsDetail from "../pages/NotificationDetail";
import PDashboard from "../pages/Professors Pages/Dashboard";
import MyCourses from "../pages/Professors Pages/MyCourses";
import EconomicsPage from "../pages/Economics";
import QuizPage from "../pages/Quiz";
import GroupDetail from "@/pages/Academic Affairs/GroupId/index";
import CreateQuizPage from "@/pages/CreateQuizPage";
import ProfessorDetail from "@/pages/Academic Affairs/ProfessorDetail/index";
import StudentDetail from "@/pages/Academic Affairs/StudentDetail/index";
import OngoingQuizzes from "@/pages/Professors Pages/QuizStatus/OngoingQuiz/index";
import PastQuizzes from "@/pages/Professors Pages/QuizStatus/PastQuiz/index";
import UpcomingQuizzes from "@/pages/Professors Pages/QuizStatus/UpcomingQuiz/index";
import CourseIdPage from "@/pages/Academic Affairs/CourseDetail/index";
import DepartmentIdPage from "@/pages/Academic Affairs/DepartmentDetail/index";
import QuizDetail from "@/pages/Professors Pages/QuizStatus/Quizid/index";
import QuizId from "@/pages/Professors Pages/QuizStatus/Quizid/index";
import StudentQuiz from "@/pages/Startquiz/index";
import QuizAttempt from "@/pages/Startquiz/QuizAttempt/index";
import GradeQuiz from "@/pages/Professors Pages/QuizGrading/index";
import QuizResult from "@/pages/QuizResults/index";

const Router = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log(" userData:", userData); // log

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    );
  } else if (userData.role === "MANAGER") {
    return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AADashboard />} />
          <Route path="not-found" element={<NotFoundPage />} />

          <Route path="groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />

          <Route path="students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />

          <Route path="courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseIdPage />} />

          <Route path="departments" element={<Departments />} />
          <Route path="/departments/:id" element={<DepartmentIdPage />} />

          <Route path="professors" element={<Professors />} />
          <Route path="/professors/:id" element={<ProfessorDetail />} />

          {/* <Route path="create-quiz" element={<CreateQuiz />} /> */}
          {/* <Route path="add-course" element={<AddCourse />} /> */}
          {/* <Route path="statistics" element={<Statistics />} /> */}
          {/* <Route path="quizzes" element={<QuizzesPage />} /> */}
          {/* <Route path="quizzes/create" element={<CreateQuizPage />} /> */}
          {/*<Route path="quizzes/:quizId" element={<QuizInfo />} /> */}
          {/* <Route path="notifications" element={<NotificationsPage />} /> */}
          {/* <Route path="/notifications/:id" element={<NotificationsDetail />} /> */}
          {/* <Route path="courses/economics" element={<EconomicsPage />} /> */}
          {/* <Route path="courses/quiz" element={<QuizPage />} /> */}
          {/* <Route path="students/:studentId/results" element={<StudentResults />}/> */}
          {/* <Route path="academic-affairs-dashboard" element={<AADashboard />} /> */}
          {/* <Route path="students-dashboard" element={<Dashboard />} /> */}
          {/* <Route path="professors/:professorId" element={<ProfessorInfo />} /> */}
          {/* <Route path="courses-list" element={<ACourses />} /> */}
          {/* <Route path="/quizzes/:quizId" element={<QuizId />} /> */}
          {/* <Route path="departments/create" element={<NewDepartment />} /> */}
          {/* <Route path="professors/dashboard" element={<PDashboard />} /> */}
          {/* <Route path="my-courses" element={<MyCourses />} /> */}
          {/* <Route path="/ongoing-quizzes" element={<OngoingQuizzes />} />
          <Route path="/past-quizzes" element={<PastQuizzes />} />
          <Route path="/upcoming-quizzes" element={<UpcomingQuizzes />} /> */}
          {/* <Route path="/student/quizzes/:quizId/attempt" element={<QuizAttempt />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  } else if (userData.role === "PROFESSOR") {
    return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PDashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="quizzes" element={<OngoingQuizzes />} />
          <Route path="quizzes/create" element={<CreateQuizPage />} />
          {/*<Route path="quizzes/:quizId" element={<QuizInfo />} /> */}
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationsDetail />} />
          <Route path="courses/economics" element={<EconomicsPage />} />
          <Route path="courses/quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="students/:studentId/results"
            element={<StudentResults />}
          />
          <Route path="/professors/:id" element={<ProfessorDetail />} />
          <Route path="academic-affairs-dashboard" element={<AADashboard />} />
          <Route path="students-dashboard" element={<Dashboard />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:professorId" element={<ProfessorInfo />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/courses/:id" element={<CourseIdPage />} />
          <Route path="/departments/:id" element={<DepartmentIdPage />} />
          {/* <Route path="courses-list" element={<ACourses />} /> */}
          <Route path="/quizzes/:quizId" element={<QuizId />} />
          <Route path="departments" element={<Departments />} />
          <Route path="students" element={<Students />} />
          <Route path="groups" element={<Groups />} />
          <Route path="departments/create" element={<NewDepartment />} />
          {/* <Route path="professors/dashboard" element={<PDashboard />} /> */}
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="/ongoing-quizzes" element={<OngoingQuizzes />} />
          <Route path="/past-quizzes" element={<PastQuizzes />} />
          <Route path="/upcoming-quizzes" element={<UpcomingQuizzes />} />
          <Route path="/professor/grading/quiz/:id" element={<GradeQuiz />} />

          <Route
            path="/student/quizzes/:quizId/attempt"
            element={<QuizAttempt />}
          />
        </Route>
      </Routes>
    );
  } else if (userData.role === "STUDENT") {
    return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PDashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="quizzes/create" element={<CreateQuizPage />} />
          {/*<Route path="quizzes/:quizId" element={<QuizInfo />} /> */}
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationsDetail />} />
          <Route path="courses/economics" element={<EconomicsPage />} />
          <Route path="courses/quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="students/:studentId/results"
            element={<StudentResults />}
          />
          <Route path="/professors/:id" element={<ProfessorDetail />} />
          <Route path="academic-affairs-dashboard" element={<AADashboard />} />
          <Route path="students-dashboard" element={<Dashboard />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:professorId" element={<ProfessorInfo />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/courses/:id" element={<CourseIdPage />} />
          <Route path="/departments/:id" element={<DepartmentIdPage />} />
          {/* <Route path="courses-list" element={<ACourses />} /> */}
          <Route path="/quizzes/:quizId" element={<QuizId />} />
          <Route path="departments" element={<Departments />} />
          <Route path="students" element={<Students />} />
          <Route path="groups" element={<Groups />} />
          <Route path="departments/create" element={<NewDepartment />} />
          {/* <Route path="professors/dashboard" element={<PDashboard />} /> */}
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="/ongoing-quizzes" element={<OngoingQuizzes />} />
          <Route path="/past-quizzes" element={<PastQuizzes />} />
          <Route path="/upcoming-quizzes" element={<UpcomingQuizzes />} />

          <Route
            path="/student/quizzes/:quizId/attempt"
            element={<QuizAttempt />}
          />
          <Route
            path="/student/quizzes/attempts/:quizId/result"
            element={<QuizResult />}
          />
        </Route>
      </Routes>
    );
  } else if (userData.role === "ACADEMIC_AFFAIRS") {
    return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AADashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="quizzes/create" element={<CreateQuizPage />} />
          {/*<Route path="quizzes/:quizId" element={<QuizInfo />} /> */}
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationsDetail />} />
          <Route path="courses/economics" element={<EconomicsPage />} />
          <Route path="courses/quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="students/:studentId/results"
            element={<StudentResults />}
          />
          <Route path="/professors/:id" element={<ProfessorDetail />} />
          <Route path="academic-affairs-dashboard" element={<AADashboard />} />
          <Route path="students-dashboard" element={<Dashboard />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:professorId" element={<ProfessorInfo />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/courses/:id" element={<CourseIdPage />} />
          <Route path="/departments/:id" element={<DepartmentIdPage />} />
          {/* <Route path="courses-list" element={<ACourses />} /> */}
          <Route path="/quizzes/:quizId" element={<QuizId />} />
          <Route path="departments" element={<Departments />} />
          <Route path="students" element={<Students />} />
          <Route path="groups" element={<Groups />} />
          <Route path="departments/create" element={<NewDepartment />} />
          <Route path="professors/dashboard" element={<PDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="/ongoing-quizzes" element={<OngoingQuizzes />} />
          <Route path="/past-quizzes" element={<PastQuizzes />} />
          <Route path="/upcoming-quizzes" element={<UpcomingQuizzes />} />

          <Route
            path="/student/quizzes/:quizId/attempt"
            element={<QuizAttempt />}
          />
        </Route>
      </Routes>
    );
  }
};

// quizzes/ongoing
// quizzes/past
// quizzes/upcoming

export default Router;
