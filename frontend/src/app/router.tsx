import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      //   {
      //     path: "/",
      //     element: <HomePage />,
      //   },
      //   {
      //     path: "/about",
      //     element: <AboutPage />,
      //   },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      // {
      //   path: "/login",
      //   element: <LoginPage />,
      // },
    ],
  },
]);
