import { useState, useEffect } from "react";
import { BiX, BiSave } from "react-icons/bi";
import { useProductStore } from "../../../features/products/store/productStore";

export default function ProductModal({ isOpen, onClose, editData }) {
  const { addProduct, updateProduct } = useProductStore();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    hpp: 0,
    margin: 0,
    selling_price: 0,
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        hpp: 0,
        margin: 0,
        selling_price: 0,
      });
    }
  }, [editData, isOpen]);

  useEffect(() => {
    const hpp = parseFloat(formData.hpp || 0);
    const margin = parseFloat(formData.margin || 0);
    const total = hpp + hpp * (margin / 100);
    setFormData((prev) => ({ ...prev, selling_price: total }));
  }, [formData.hpp, formData.margin]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = editData
      ? await updateProduct(editData.id, formData)
      : await addProduct(formData);

    if (res.success) {
      onClose();
    } else {
      alert(res.message);
    }
  };

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden mx-3 md:mx-0">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            {editData ? "Edit Data Produk" : "Tambah Produk Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <BiX size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Kode
              </label>
              <input
                required
                type="text"
                placeholder="NET-50"
                value={formData.code}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase text-sm"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Nama Produk
              </label>
              <input
                required
                type="text"
                placeholder="Internet 50 Mbps"
                value={formData.name}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                HPP (Modal)
              </label>
              <input
                required
                type="number"
                value={formData.hpp}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, hpp: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Margin (%)
              </label>
              <div className="relative">
                <input
                  required
                  type="number"
                  step="0.01"
                  max="999.99"
                  value={formData.margin}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-8 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, margin: e.target.value })
                  }
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 md:p-4 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1 tracking-widest">
              Harga Jual Akhir
            </p>
            <p className="text-xl md:text-2xl font-black text-blue-800">
              {formatIDR(formData.selling_price)}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all text-sm md:text-base"
          >
            <BiSave size={16} className="md:w-[18px] md:h-[18px]" />{" "}
            {editData ? "SIMPAN PERUBAHAN" : "SIMPAN PRODUK"}
          </button>
        </form>
      </div>
    </div>
  );
}
