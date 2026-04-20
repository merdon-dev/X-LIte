import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/SidebarPanel";
import RightPanel from "../components/shared/RightPanel";
// import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex max-w-7xl mx-auto">
      {/* <Navbar /> */}
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
      <RightPanel />
    </div>
  );
}
