import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import { Navigate } from "react-router-dom";

const authRoutes = [
  {
    path: "/",
    element: AuthLayout,
    id: 'authLayout',
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: LoginPage,
      },
      {
        path: "/register",
        element: RegisterPage,
      },
      {
        path: "*",
        element: <Navigate to="/login" />,
      },
    ].map(item => ({...item, id: item.path}))
  },
]
const mainRoutes = [
  {
    path: "/",
    element: MainLayout,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: LoginPage,
      },
      {
        path: "/register",
        element: RegisterPage,
      },
      {
        path: "*",
        element: <Navigate to="/login" />,
      },
    ],
  },
];

// routes.map(item => )
