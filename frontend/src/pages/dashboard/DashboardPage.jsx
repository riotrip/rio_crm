import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BiUserVoice,
  BiCheckShield,
  BiBriefcaseAlt2,
  BiRightArrowAlt,
} from "react-icons/bi";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useLeadsStore } from "../../features/leads/store/leadsStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const {
    stats = { total: 0, deal: 0, customer: 0 },
    fetchLeads,
    isLoading,
  } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Selamat Datang, {user?.name?.split(" ")[0] || "User"}!
        </h2>
        <p className="text-gray-500 text-sm">
          {user?.role === "manager"
            ? "Memantau performa seluruh tim sales."
            : "Monitor aktivitas penjualan Anda hari ini."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/leads"
          className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {user?.role === "manager" ? "Total Leads Tim" : "Leads Saya"}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {isLoading ? "..." : stats?.total || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BiUserVoice size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 relative z-10 uppercase tracking-tighter">
            Lihat Detail <BiRightArrowAlt size={16} />
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
            <BiUserVoice size={120} />
          </div>
        </Link>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Proyek Deal
              </p>
              <h3 className="text-3xl font-black text-green-600 mt-1">
                {isLoading ? "..." : stats?.deal || 0}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <BiCheckShield size={24} />
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase relative z-10 tracking-widest">
            Target Terpenuhi
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 transition-all duration-500">
            <BiCheckShield size={120} />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Customer
              </p>
              <h3 className="text-3xl font-black text-purple-600 mt-1">
                {isLoading ? "..." : stats?.customer || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BiBriefcaseAlt2 size={24} />
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase relative z-10 tracking-widest">
            Akun Terdaftar
          </div>
          <div className="absolute -right-4 -bottom-4 text-gray-100 opacity-20 group-hover:opacity-40 transition-all duration-500">
            <BiBriefcaseAlt2 size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
