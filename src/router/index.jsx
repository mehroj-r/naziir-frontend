import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { userActions } from "../store/slices/userSlice";
import { customToast } from "../utils/toastify";
import CoursesPage from "../pages/My Courses";
import Dashboard from "../pages/Dashboard";
import QuizzesPage from "../pages/My Quizzes";
import Statistics from "../pages/Statistics";
import QuizInfo from "../pages/QuizInfo";
import AddCourse from "../components/AddCourse";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import CreateQuiz from "../pages/CreateQuiz";

const Router = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();

  console.log("userData", userData) // log

  const logout = () => { // should be deleted
    dispatch(userActions.logout());
    customToast("success", "You have logged out successfully");
  }

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
          <Route path="*" element={<Navigate to="/" />} />
          <Route index element={<Dashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="quizzes/:quizId" element={<QuizInfo />} />
          <Route path="logout" element={<button onClick={logout}>logout</button>} />
        </Route>
      </Routes>
    );
  }
};

export default Router;
