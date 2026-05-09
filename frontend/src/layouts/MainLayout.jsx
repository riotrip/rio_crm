import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar"; 

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
