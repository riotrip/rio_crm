import { useState, useEffect } from "react";
import { useLeadsStore } from "../../features/leads/store/leadsStore";
import LeadModal from "./components/LeadModal";
import {
  BiPlus,
  BiEdit,
  BiTrash,
  BiSearch,
  BiChevronLeft,
  BiChevronRight,
  BiChevronDown,
  BiUserVoice,
} from "react-icons/bi";

export default function LeadsPage() {
  const { leads, fetchLeads, pagination, isLoading, deleteLead } =
    useLeadsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ month: "", year: "", status: "" });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLeads({ page: currentPage, search, ...filters });
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, currentPage, filters, fetchLeads]);

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      contacted: "bg-amber-50 text-amber-700 border-amber-200",
      qualified: "bg-purple-50 text-purple-700 border-purple-200",
      deal: "bg-green-50 text-green-700 border-green-200",
      lost: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BiUserVoice className="text-blue-600" /> Manajemen Leads
          </h1>
          <p className="text-sm text-gray-500">
            Daftar prospek masuk. Status akan berubah otomatis via Projects.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLead(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <BiPlus size={20} /> Tambah Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <BiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama pelanggan atau kontak..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="relative">
            <select
              className="py-2.5 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              value={filters.month}
              onChange={(e) => {
                setFilters({ ...filters, month: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Bulan</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <BiChevronDown size={16} />
            </div>
          </div>

          <div className="relative">
            <select
              className="py-2.5 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              value={filters.year}
              onChange={(e) => {
                setFilters({ ...filters, year: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Tahun</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <BiChevronDown size={16} />
            </div>
          </div>

          <div className="relative">
            <select
              className="py-2.5 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="deal">Deal</option>
              <option value="lost">Lost</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <BiChevronDown size={16} />
            </div>
          </div>

          {(filters.month || filters.year || filters.status) && (
            <button
              onClick={() => {
                setFilters({ month: "", year: "", status: "" });
                setCurrentPage(1);
              }}
              className="text-xs text-red-500 font-bold hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Prospek</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">Kebutuhan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Belum ada data leads.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        Sales: {lead.sales?.name || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{lead.contact}</td>

                    <td className="px-6 py-4 text-gray-500 max-w-[200px]">
                      <p className="truncate" title={lead.address}>
                        {lead.address || "-"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-500 max-w-[250px]">
                      <p className="line-clamp-2" title={lead.requirement}>
                        {lead.requirement || "-"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <BiEdit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Hapus lead?")) deleteLead(lead.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <BiTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Total{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{" "}
              data
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 border rounded-lg bg-white disabled:opacity-50"
              >
                <BiChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium px-4">
                Halaman {pagination.currentPage} / {pagination.lastPage}
              </span>
              <button
                disabled={pagination.currentPage === pagination.lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 border rounded-lg bg-white disabled:opacity-50"
              >
                <BiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadModal
        isOpen={isModalOpen}
        editData={selectedLead}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
