import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Outlet />
    </div>
  );
}
