import { useState, useEffect } from "react";
import { useCustomerStore } from "../../features/customers/store/customerStore";
import {
  BiSearch,
  BiUser,
  BiChevronLeft,
  BiChevronRight,
  BiShowAlt,
  BiPhone,
  BiMap,
  BiCalendar,
} from "react-icons/bi";
import CustomerModal from "./components/CustomerModal";

export default function CustomersPage() {
  const { customers, fetchCustomers, pagination, isLoading } =
    useCustomerStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers({ page: currentPage, search });
    }, 500);
    return () => clearTimeout(delay);
  }, [search, currentPage, fetchCustomers]);

  const handleView = async (customer) => {
    const { fetchCustomerDetail } = useCustomerStore.getState();
    const res = await fetchCustomerDetail(customer.id);
    if (res.success) setSelectedCustomer(res.data);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-100">
              <BiUser size={20} />
            </div>
            Customer Aktif
          </h1>
          <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-tighter">
            Role: {user.role}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative">
          <BiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari customer..."
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Kontak</th>
                {user.role === "manager" && (
                  <th className="px-6 py-4">Sales</th>
                )}
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400 font-medium"
                  >
                    Belum ada customer aktif.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <BiUser className="text-gray-400" />
                        {c.name}
                      </div>
                      <div className="text-[11px] text-blue-600 font-bold uppercase mt-0.5 flex items-center gap-1">
                        <BiMap size={11} /> {c.address || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-1 mt-3">
                      <BiPhone size={13} /> {c.contact || "-"}
                    </td>
                    {user.role === "manager" && (
                      <td className="px-6 py-4 text-gray-500">
                        {c.sales?.name || "-"}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        {c.project?.items?.length || 0} layanan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <BiCalendar size={12} />
                        {new Date(c.joined_at).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleView(c)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Lihat Detail"
                        >
                          <BiShowAlt size={18} />
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
              customer
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 px-4">
                Halaman {pagination.currentPage} dari {pagination.lastPage}
              </span>
              <button
                disabled={pagination.currentPage === pagination.lastPage}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        customer={selectedCustomer}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}
