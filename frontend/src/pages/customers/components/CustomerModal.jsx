import {
  BiX,
  BiUser,
  BiPhone,
  BiMap,
  BiCalendar,
  BiPackage,
} from "react-icons/bi";

export default function CustomerModal({ isOpen, customer, onClose }) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-3 md:mx-0">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <BiUser className="text-blue-600 md:w-5 md:h-5" size={18} />
            Detail Customer
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <BiX size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Nama</p>
              <p className="font-bold text-gray-800 flex items-center gap-1 text-sm md:text-base">
                <BiUser size={14} className="text-gray-400" /> {customer.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Kontak</p>
              <p className="font-bold text-gray-800 flex items-center gap-1 text-sm md:text-base">
                <BiPhone size={14} className="text-gray-400" />{" "}
                {customer.contact || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Alamat</p>
              <p className="font-bold text-gray-800 flex items-center gap-1 text-sm md:text-base">
                <BiMap size={14} className="text-gray-400" />{" "}
                {customer.address || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Bergabung</p>
              <p className="font-bold text-gray-800 flex items-center gap-1 text-sm md:text-base">
                <BiCalendar size={14} className="text-gray-400" />
                {new Date(customer.joined_at).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Sales</p>
              <p className="font-bold text-gray-800 text-sm md:text-base">
                {customer.sales?.name || "-"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-widest">
              Layanan Aktif
            </p>
            <div className="space-y-2">
              {customer.project?.items?.length > 0 ? (
                customer.project.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-xl px-3 md:px-4 py-2 md:py-3 border border-gray-100 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <BiPackage
                        className="text-blue-500 md:w-4 md:h-4"
                        size={14}
                      />
                      <span className="font-bold text-sm text-gray-800">
                        {item.product?.name}
                      </span>
                      <span className="text-xs text-gray-400">x{item.qty}</span>
                    </div>
                    <span className="text-sm font-black text-blue-700">
                      Rp {Number(item.nego_price).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Tidak ada layanan
                </p>
              )}
            </div>
          </div>

          {customer.project?.items?.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 md:px-4 py-2 md:py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-xs md:text-sm text-blue-600 font-bold uppercase tracking-wider">
                Total Nilai
              </span>
              <span className="text-lg md:text-xl font-black text-blue-700">
                Rp{" "}
                {customer.project.items
                  .reduce((sum, i) => sum + Number(i.nego_price) * i.qty, 0)
                  .toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
