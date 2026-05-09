import { useState, useEffect } from "react";
import { BiX, BiSave, BiUser, BiPhone, BiMap, BiTask } from "react-icons/bi";
import { useLeadsStore } from "../../../features/leads/store/leadsStore";

export default function LeadModal({ isOpen, onClose, editData }) {
  const { createLead, updateLead } = useLeadsStore();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    requirement: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        contact: editData.contact || "",
        address: editData.address || "",
        requirement: editData.requirement || "",
      });
    } else {
      setFormData({ name: "", contact: "", address: "", requirement: "" });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = editData
      ? await updateLead(editData.id, formData)
      : await createLead(formData);

    if (res.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {editData ? "Edit Prospek" : "Tambah Prospek Baru"}
            </h3>
            <p className="text-xs text-gray-500">
              Kelola informasi kontak dan kebutuhan calon pelanggan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                Nama / Perusahaan
              </label>
              <div className="relative">
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Masukkan nama"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                No. Kontak / Email
              </label>
              <div className="relative">
                <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="0812... / email@mail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Alamat Lengkap
            </label>
            <div className="relative">
              <BiMap className="absolute left-3 top-3 text-gray-400" />
              <textarea
                placeholder="Jl. Nama Jalan No. XX..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 text-sm transition-all"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Kebutuhan / Requirement
            </label>
            <div className="relative">
              <BiTask className="absolute left-3 top-3 text-gray-400" />
              <textarea
                placeholder="Apa yang mereka cari? (Contoh: Butuh internet 100mbps untuk kantor)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 text-sm transition-all"
                value={formData.requirement}
                onChange={(e) =>
                  setFormData({ ...formData, requirement: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <BiSave size={18} />{" "}
              {editData ? "SIMPAN PERUBAHAN" : "TAMBAH PROSPEK"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
