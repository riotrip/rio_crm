import { useState, useEffect } from "react";
import { useProjectStore } from "../../features/projects/store/projectStore";
import ProjectModal from "./components/ProjectModal";
import { 
  BiSearch, BiBriefcase, BiCheckShield, BiTimeFive, 
  BiChevronLeft, BiChevronRight, BiShowAlt, BiPlus, BiEdit, BiXCircle, BiTask, BiUser
} from "react-icons/bi";

export default function ProjectsPage() {
  const { projects, fetchProjects, pagination, isLoading, updateStatus, fetchProjectDetail } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects({ page: currentPage, search });
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, currentPage, fetchProjects]);

  const handleAction = async (id, status) => {
    const confirmMsg = status === 'approved' ? "Setujui project ini?" : "Tolak project ini?";
    if (window.confirm(confirmMsg)) {
      const res = await updateStatus(id, status);
      if (res.success) alert(`Project berhasil di-${status}`);
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
        {user.role === "sales" && (
          <button
            onClick={() => handleOpenModal(null, false)}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <BiPlus size={20} /> Buat Project
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative">
          <BiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari project..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Project & Lead</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tgl</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-400 font-medium"
                  >
                    Belum ada project.
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(p.status)}`}
                      >
                        {p.status}
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

                        {(p.status === "process" ||
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
              produk
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