import { useState, useEffect } from "react";
import { useProjectStore } from "../../features/projects/store/projectStore";
import ProjectModal from "./components/ProjectModal";
import axios from "../../lib/axios";
import {
  BiSearch,
  BiBriefcase,
  BiCheckShield,
  BiChevronLeft,
  BiChevronRight,
  BiChevronDown,
  BiShowAlt,
  BiPlus,
  BiEdit,
  BiXCircle,
  BiTask,
  BiDownload,
} from "react-icons/bi";

export default function ProjectsPage() {
  const {
    projects,
    fetchProjects,
    pagination,
    isLoading,
    updateStatus,
    fetchProjectDetail,
  } = useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
    id_sales: "",
    status: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    sales: [],
  });
  const [isExporting, setIsExporting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role === "manager") {
      axios
        .get("/reports/filter-data")
        .then((res) => {
          if (res.data.success) {
            setFilterOptions({
              sales: res.data.sales || [],
            });
          }
        })
        .catch((err) => console.error("Gagal memuat filter", err));
    }
  }, [user.role]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects({ page: currentPage, search, ...filters });
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, currentPage, filters, fetchProjects]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await axios.get("/reports/export-projects", {
        params: { search, ...filters },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Projects_${filters.month || "All"}_${filters.year}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengekspor data laporan");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAction = async (id, status) => {
    const confirmMsg =
      status === "approved" ? "Setujui project ini?" : "Tolak project ini?";
    if (window.confirm(confirmMsg)) {
      const res = await updateStatus(id, status);
      if (res.success) {
        alert(`Project berhasil di-${status}`);
        fetchProjects({ page: currentPage, search, ...filters });
      }
    }
  };

  const handleOpenModal = async (project = null, viewMode = false) => {
    setIsViewOnly(viewMode);
    if (project) {
      const res = await fetchProjectDetail(project.id);
      if (res.success) setSelectedProject(res.data);
    } else {
      setSelectedProject(null);
    }
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      process: "bg-blue-50 text-blue-700 border-blue-200",
      waiting_approval: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-100">
              <BiBriefcase size={20} />
            </div>
            Manajemen Project
          </h1>
          <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-tighter">
            Role: {user.role}
          </p>
        </div>

        <div className="flex gap-2">
          {user.role === "manager" && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <BiDownload size={20} />{" "}
              {isExporting ? "Mengekspor..." : "Export Excel"}
            </button>
          )}

          {user.role === "sales" && (
            <button
              onClick={() => handleOpenModal(null, false)}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <BiPlus size={20} /> Buat Project
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari prospek..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="relative">
          <select
            className="py-2 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
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
            className="py-2 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            value={filters.year}
            onChange={(e) => {
              setFilters({ ...filters, year: e.target.value });
              setCurrentPage(1);
            }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <BiChevronDown size={16} />
          </div>
        </div>

        {user.role === "manager" && (
          <div className="relative">
            <select
              className="py-2 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[130px]"
              value={filters.id_sales}
              onChange={(e) => {
                setFilters({ ...filters, id_sales: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Sales</option>
              {filterOptions.sales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <BiChevronDown size={16} />
            </div>
          </div>
        )}

        {user.role === "manager" && (
          <div className="relative">
            <select
              className="py-2 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[140px]"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Status</option>
              <option value="waiting_approval">Waiting Approval</option>
              <option value="process">Process</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <BiChevronDown size={16} />
            </div>
          </div>
        )}

        {(filters.month ||
          filters.year !== "2026" ||
          filters.id_sales ||
          filters.status) && (
          <button
            onClick={() => {
              setFilters({
                month: "",
                year: "2026",
                id_sales: "",
                status: "",
              });
              setCurrentPage(1);
            }}
            className="text-xs text-red-500 font-bold hover:underline px-2"
          >
            Reset
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Project & Lead</th>
                <th className="px-6 py-4">Sales</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tgl Dibuat</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400 font-medium"
                  >
                    Belum ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <BiTask className="text-gray-400" />
                        <span className="truncate max-w-[150px]">
                          {p.notes || "Project Baru"}
                        </span>
                      </div>
                      <div className="text-[11px] text-blue-600 font-bold uppercase mt-0.5">
                        Lead: {p.lead?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {p.sales?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(p.status)}`}
                      >
                        {p.status === "waiting_approval"
                          ? "WAITING APPROVAL"
                          : p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      {new Date(p.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleOpenModal(p, true)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Lihat"
                        >
                          <BiShowAlt size={18} />
                        </button>

                        {user.role === "sales" && p.status === "process" && (
                          <button
                            onClick={() => handleOpenModal(p, false)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <BiEdit size={18} />
                          </button>
                        )}

                        {user.role === "manager" &&
                          (p.status === "process" ||
                            p.status === "waiting_approval") && (
                            <div className="flex gap-1 border-l ml-1 pl-1">
                              <button
                                onClick={() => handleAction(p.id, "approved")}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Approve"
                              >
                                <BiCheckShield size={20} />
                              </button>
                              <button
                                onClick={() => handleAction(p.id, "rejected")}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Reject"
                              >
                                <BiXCircle size={20} />
                              </button>
                            </div>
                          )}
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

      <ProjectModal
        isOpen={isModalOpen}
        editData={selectedProject}
        isViewOnly={isViewOnly}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}
