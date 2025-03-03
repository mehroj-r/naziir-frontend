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

const Router = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    // should be deleted
    dispatch(userActions.logout());
    customToast("success", "You have logged out successfully");
  };

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
  } else {
    return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AADashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="quizzes/:quizId" element={<QuizInfo />} />
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
          <Route path="academic-affairs-dashboard" element={<AADashboard />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:professorId" element={<ProfessorInfo />} />
          <Route path="professorss" element={<Professors />} />
          <Route path="courses-list" element={<ACourses />} />
          <Route path="departments" element={<Departments />} />
          <Route path="students" element={<Students />} />
          <Route path="groups" element={<Groups />} />
          <Route path="departments/create" element={<NewDepartment />} />
          <Route path="professors-pages" element={<PDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
        </Route>
      </Routes>
    );
  }
};

export default Router;
