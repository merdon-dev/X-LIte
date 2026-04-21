import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/shared/SidebarPanel";
import RightPanel from "../components/shared/RightPanel";
import { type ApiErrorResponse } from "../services/axiosInstance";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import LoadingSpinner from "../components/skeletons/LoadingSpinner";
import { useAuthHook } from "../hooks/useAuthHook";

export default function MainLayout() {
  const { data: authUser, error, isError, isPending } = useAuthHook();

  useEffect(() => {
    if (isError) {
      const err = error as AxiosError<ApiErrorResponse>;
      const message = err?.message || "Something went wrong";

      toast.error(message);
    }
  }, [isError, error]);

  if (isPending) {
    return (
      <div className="w-full h-screen grid place-content-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      {/* <Navbar /> */}
      <Sidebar />
      <main className="flex-1">
        {authUser ? <Outlet /> : <Navigate to="/login" />}
      </main>
      {authUser ? <RightPanel /> : null}
    </div>
  );
}
