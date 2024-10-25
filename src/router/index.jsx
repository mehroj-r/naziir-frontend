// src/router/index.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateQuiz from "../pages/CreateQuiz";
import Statistics from "../pages/Statistics"; // Import the Statistics page

const Router = () => {
  const isAuth = useSelector((state) => state.user.isAuth);

  if (!isAuth && false) {
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
          <Route index element={<Dashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="courses" element={<div>Courses Page</div>} />
          <Route path="quizzes" element={<div>Quizzes Page</div>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    );
  }
};

export default Router;
