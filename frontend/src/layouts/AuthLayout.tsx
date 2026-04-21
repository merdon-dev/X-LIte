import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/skeletons/LoadingSpinner";
import { useAuthHook } from "../hooks/useAuthHook";

export default function AuthLayout() {
  const { data, isPending } = useAuthHook();

  if (isPending) {
    return (
      <div className="w-full h-screen grid place-content-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      {!data ? <Outlet /> : <Navigate to="/" />}
    </div>
  );
}
