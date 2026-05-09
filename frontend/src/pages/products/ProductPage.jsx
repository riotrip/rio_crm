import { useState, useEffect } from "react";
import { useProductStore } from "../../features/products/store/productStore";
import { useAuthStore } from "../../features/auth/store/authStore";
import ProductModal from "./components/ProductModal";
import {
  BiPlus,
  BiEdit,
  BiTrash,
  BiSearch,
  BiChevronLeft,
  BiChevronRight,
  BiPackage,
} from "react-icons/bi";

export default function ProductsPage() {
  const {
    products,
    fetchProducts,
    pagination,
    isLoading,
    toggleStatus,
    deleteProduct,
  } = useProductStore();

  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts({ page: currentPage, search });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, currentPage, fetchProducts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus produk ${name}?`)) {
      deleteProduct(id);
    }
  };

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BiPackage className="text-blue-600" /> Manajemen Produk
          </h1>
          <p className="text-sm text-gray-500">
            Kelola daftar paket layanan dan struktur harga jual Anda.
          </p>
        </div>
        {user?.role === "manager" && (
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <BiPlus size={20} /> Tambah Produk Baru
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex-1 relative">
          <BiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nama produk atau kode..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Informasi Produk</th>
                <th className="px-6 py-4 text-right">HPP</th>
                <th className="px-6 py-4 text-right">Margin (%)</th>
                <th className="px-6 py-4 text-right">Harga Jual</th>
                <th className="px-6 py-4 text-center">Status</th>
                {user?.role === "manager" && (
                  <th className="px-6 py-4 text-center">Aksi</th>
                )}
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
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                        {product.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {formatIDR(product.hpp)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600 font-bold">
                        +{product.margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">
                      {formatIDR(product.selling_price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        {user?.role === "manager" ? (
                          <button
                            onClick={() => toggleStatus(product.id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors outline-none ${
                              product.is_active ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                product.is_active
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              product.is_active
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-gray-100 text-gray-400 border border-gray-200"
                            }`}
                          >
                            {product.is_active ? "AKTIF" : "NONAKTIF"}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold tracking-tighter ${product.is_active ? "text-green-600" : "text-gray-400"}`}
                        >
                          {product.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                    </td>
                    {user?.role === "manager" && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <BiEdit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <BiTrash size={18} />
                          </button>
                        </div>
                      </td>
                    )}
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

      <ProductModal
        isOpen={isModalOpen}
        editData={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
