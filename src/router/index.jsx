import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateQuiz from "../pages/CreateQuiz";
import Statistics from "../pages/Statistics";
import { userActions } from "../store/slices/userSlice";
import { customToast } from "../utils/toastify";

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
          <Route index element={<Dashboard />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="courses" element={<div>Courses Page</div>} />
          <Route path="quizzes" element={<div>Quizzes Page</div>} />
          <Route path="logout" element={<button onClick={logout}>logout</button>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }
};

export default Router;
