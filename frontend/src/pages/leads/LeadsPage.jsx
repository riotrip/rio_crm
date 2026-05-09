import { useState, useEffect } from "react";
import { useLeadsStore } from "../../features/leads/store/leadsStore";
import LeadModal from "./components/LeadModal";
import {
  BiPlus,
  BiEdit,
  BiTrash,
  BiSearch,
  BiFilterAlt,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";

export default function LeadsPage() {
  const {
    leads,
    fetchLeads,
    pagination,
    isLoading,
    updateLeadStatus,
    deleteLead,
  } = useLeadsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLeads({ page: currentPage, search, status: statusFilter });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, currentPage, fetchLeads]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus data ${name}?`)) {
      deleteLead(id);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
      qualified: "bg-purple-50 text-purple-700 border-purple-200",
      deal: "bg-green-50 text-green-700 border-green-200",
      lost: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Leads</h1>
          <p className="text-sm text-gray-500">
            Kelola dan pantau prospek pelanggan Anda di sini.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <BiPlus size={20} /> Tambah Lead Baru
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex-1 relative">
          <BiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nama pelanggan atau kontak..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div className="flex items-center relative min-w-[200px]">
          <BiFilterAlt
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            size={20}
          />
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="new">NEW</option>
            <option value="contacted">CONTACTED</option>
            <option value="qualified">QUALIFIED</option>
            <option value="deal">DEAL</option>
            <option value="lost">LOST</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Sales</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Input</th>
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
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.sales?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.contact}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none cursor-pointer border-2 appearance-none ${getStatusBadge(lead.status)}`}
                      >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="qualified">QUALIFIED</option>
                        <option value="deal">DEAL</option>
                        <option value="lost">LOST</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <BiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <BiChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 px-4">
                Halaman {pagination.currentPage} dari {pagination.lastPage}
              </span>
              <button
                disabled={pagination.currentPage === pagination.lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
