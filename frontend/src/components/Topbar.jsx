import { useAuthStore } from "../features/auth/store/authStore";
import { useState, useEffect } from "react";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);
  const [pageName, setPageName] = useState("Dashboard");

  useEffect(() => {
    const path = window.location.pathname.replace("/", "");
    if (path === "") setPageName("Dashboard");
    else if (path === "leads") setPageName("Manajemen Leads");
    else if (path === "products") setPageName("Manajemen Produk");
    else if (path === "projects") setPageName("Manajemen Project");
    else if (path === "customers") setPageName("Manajemen Pelanggan");
    else setPageName(path);
  }, [window.location.pathname]);

  return (
    <header className="h-16 min-h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
      <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
        <span className="hover:text-blue-600 cursor-pointer transition-colors">
          Menu Utama
        </span>
        <span>/</span>
        <span className="font-medium text-gray-800 uppercase tracking-wider text-xs">
          {pageName}
        </span>
      </div>
      <div className="md:hidden">
        <h1 className="text-lg font-bold text-gray-800">
          CRM <span className="text-blue-600">SMART</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm font-bold text-gray-800 leading-none">
            {user?.name}
          </p>
          <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-blue-100 text-blue-600 rounded-md mt-1">
            {user?.role}
          </span>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-xl font-bold shadow-md border-2 border-white text-sm md:text-base">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
