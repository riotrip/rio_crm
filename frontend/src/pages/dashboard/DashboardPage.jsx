import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BiUserVoice,
  BiCheckShield,
  BiBriefcaseAlt2,
  BiRightArrowAlt,
} from "react-icons/bi";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useDashboardStore } from "../../features/dashboard/store/dashboardStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { stats, fetchStats, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="animate-in fade-in duration-500 px-3 md:px-0">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Selamat Datang, {user?.name?.split(" ")[0] || "User"}!
        </h2>
        <p className="text-gray-500 text-xs md:text-sm">
          {user?.role === "manager"
            ? "Memantau performa seluruh tim sales."
            : "Monitor aktivitas penjualan Anda hari ini."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Link
          to="/leads"
          className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                {user?.role === "manager" ? "Total Leads Tim" : "Leads Saya"}
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
                {isLoading ? "..." : stats?.total || 0}
              </h3>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BiUserVoice size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center gap-1 text-[10px] md:text-xs font-bold text-blue-600 relative z-10 uppercase tracking-tighter">
            Lihat Detail <BiRightArrowAlt size={14} className="md:w-4 md:h-4" />
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
            <BiUserVoice size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
        </Link>

        <Link
          to="/projects"
          className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all block"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                Proyek Deal
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-green-600 mt-1">
                {isLoading ? "..." : stats?.deal || 0}
              </h3>
            </div>
            <div className="p-2 md:p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <BiCheckShield size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase relative z-10 tracking-widest">
            Target Terpenuhi
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 transition-all duration-500">
            <BiCheckShield size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
        </Link>

        <Link
          to="/customers"
          className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all block"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                Customer
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-purple-600 mt-1">
                {isLoading ? "..." : stats?.customer || 0}
              </h3>
            </div>
            <div className="p-2 md:p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BiBriefcaseAlt2 size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase relative z-10 tracking-widest">
            Akun Terdaftar
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 transition-all duration-500">
            <BiBriefcaseAlt2 size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
