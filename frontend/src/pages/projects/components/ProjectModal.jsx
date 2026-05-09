import { useState, useEffect } from "react";
import {
  BiX,
  BiSave,
  BiPlus,
  BiTrash,
  BiCheckShield,
  BiChevronDown,
} from "react-icons/bi";
import { useProjectStore } from "../../../features/projects/store/projectStore";
import { useLeadsStore } from "../../../features/leads/store/leadsStore";
import { useProductStore } from "../../../features/products/store/productStore";

export default function ProjectModal({
  isOpen,
  onClose,
  editData,
  isViewOnly,
}) {
  const { createProject, updateProject } = useProjectStore();
  const { leads, fetchLeads } = useLeadsStore();
  const { products, fetchProducts } = useProductStore();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    id_lead: "",
    notes: "",
    items: [{ id_product: "", qty: 1, nego_price: 0 }],
  });

  const isLocked =
    isViewOnly ||
    user.role === "manager" ||
    (editData && editData.status !== "process");

  useEffect(() => {
    if (isOpen) {
      fetchLeads({ all: true });
      fetchProducts({ all: true });
      if (editData) {
        setFormData({
          id_lead: editData.id_lead,
          notes: editData.notes || "",
          items: editData.items.map((i) => ({
            id_product: i.id_product,
            qty: i.qty,
            nego_price: i.nego_price,
          })),
        });
      } else {
        setFormData({
          id_lead: "",
          notes: "",
          items: [{ id_product: "", qty: 1, nego_price: 0 }],
        });
      }
    }
  }, [isOpen, editData]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === "id_product") {
      const prod = products.find((p) => p.id === parseInt(value));
      if (prod) newItems[index].nego_price = prod.selling_price;
    }
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (acc, item) => acc + item.qty * item.nego_price,
      0,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = editData
      ? await updateProject(editData.id, formData)
      : await createProject(formData);
    if (res.success) onClose();
    else alert(res.message);
  };

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editData
              ? isLocked
                ? "Detail Data Project"
                : "Edit Data Project"
              : "Tambah Project Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <BiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {editData?.status === "approved" && (
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <BiCheckShield size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
                    Project Approved
                  </p>
                  <p className="text-sm font-bold text-green-800">
                    Disetujui oleh: {editData.approver?.name || "-"}
                  </p>
                </div>
              </div>
              <div className="border-t border-green-100 pt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-green-600 font-bold uppercase">Sales</p>
                  <p className="font-bold text-gray-800">
                    {editData.sales?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-green-600 font-bold uppercase">
                    Tanggal Approve
                  </p>
                  <p className="font-bold text-gray-800">
                    {editData.approved_at
                      ? new Date(editData.approved_at).toLocaleDateString(
                          "id-ID",
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Pilih Lead (Prospek)
            </label>
            <div className="relative">
              <select
                required
                disabled={isLocked}
                value={formData.id_lead}
                className="w-full px-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-70 appearance-none cursor-pointer text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, id_lead: e.target.value })
                }
              >
                <option value="" disabled>
                  -- Pilih Nama Lead --
                </option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BiChevronDown size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Item Project / Paket
              </label>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      items: [
                        ...formData.items,
                        { id_product: "", qty: 1, nego_price: 0 },
                      ],
                    })
                  }
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <BiPlus /> Tambah Item
                </button>
              )}
            </div>

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 items-center"
                >
                  <div className="col-span-6 relative">
                    <select
                      required
                      disabled={isLocked}
                      className="w-full px-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none appearance-none cursor-pointer disabled:opacity-60"
                      value={item.id_product}
                      onChange={(e) =>
                        handleItemChange(index, "id_product", e.target.value)
                      }
                    >
                      <option value="">Pilih Paket</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <BiChevronDown size={16} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <input
                      required
                      disabled={isLocked}
                      type="number"
                      placeholder="Qty"
                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-xl text-xs text-center outline-none disabled:opacity-60"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-3 text-right">
                    <input
                      required
                      disabled={isLocked}
                      type="number"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-blue-600 outline-none text-right disabled:opacity-60"
                      value={item.nego_price}
                      onChange={(e) =>
                        handleItemChange(index, "nego_price", e.target.value)
                      }
                    />
                  </div>

                  {!isLocked && formData.items.length > 1 && (
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            items: formData.items.filter((_, i) => i !== index),
                          })
                        }
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <BiTrash size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1 tracking-widest">
              Total Nilai Project
            </p>
            <p className="text-2xl font-black text-blue-800">
              {formatIDR(calculateTotal())}
            </p>
          </div>

          {!isLocked && (
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <BiSave size={18} />{" "}
              {editData ? "SIMPAN PERUBAHAN" : "SIMPAN & AJUKAN"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
