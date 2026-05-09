import { useState, useEffect } from "react";
import { BiX, BiSave } from "react-icons/bi";
import { useLeadsStore } from "../../../features/leads/store/leadsStore";

export default function LeadModal({ isOpen, onClose, editData }) {
  const { addLead, editLead } = useLeadsStore();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    requirement: "",
    status: "new",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: "",
        contact: "",
        address: "",
        requirement: "",
        status: "new",
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = editData
      ? await editLead(editData.id, formData)
      : await addLead(formData);

    if (res.success) {
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editData ? "Edit Data Prospek" : "Tambah Prospek Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <BiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nama Pelanggan
            </label>
            <input
              required
              type="text"
              value={formData.name}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Kontak (WA/Email)
            </label>
            <input
              required
              type="text"
              value={formData.contact}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Kebutuhan
            </label>
            <textarea
              value={formData.requirement || ""}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
              onChange={(e) =>
                setFormData({ ...formData, requirement: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <BiSave size={18} /> {editData ? "SIMPAN PERUBAHAN" : "SIMPAN DATA"}
          </button>
        </form>
      </div>
    </div>
  );
}
