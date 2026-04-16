import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* <Navbar /> */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
