import { Link, useLocation } from "react-router-dom";
import {
  BiGridAlt,
  BiUserVoice,
  BiFolder,
  BiBuilding,
  BiLogOut,
  BiMenu,
  BiX,
} from "react-icons/bi";
import { useAuthStore } from "../features/auth/store/authStore";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <BiGridAlt size={20} /> },
    {
      name: "Manajemen Leads",
      path: "/leads",
      icon: <BiUserVoice size={20} />,
    },
    {
      name: "Manajemen Produk",
      path: "/products",
      icon: <BiFolder size={20} />,
    },
    {
      name: "Manajemen Project",
      path: "/projects",
      icon: <BiBuilding size={20} />,
    },
    {
      name: "Manajemen Pelanggan",
      path: "/customers",
      icon: <BiUserVoice size={20} />,
    },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <BiBuilding size={20} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          CRM <span className="text-blue-600">SMART</span>
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <BiLogOut size={20} />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-screen z-40 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
