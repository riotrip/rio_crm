import { useEffect } from 'react';
import { useLeadsStore } from '../../features/leads/store/leadsStore';

export default function LeadsPage() {
  const { leads, fetchLeads, isLoading } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-purple-100 text-purple-700',
      deal: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Leads</h1>
          <p className="text-sm text-gray-500">Kelola dan pantau prospek pelanggan Anda di sini.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
          <span>+</span> Tambah Lead Baru
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Sales Penanggung Jawab</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4">Tanggal Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Mengambil data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📁</span>
                      <p className="italic font-medium">Belum ada data leads tersedia.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {lead.sales?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-gray-700 font-medium">{lead.sales?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate max-w-[200px] text-gray-500 italic" title={lead.requirement}>
                        {lead.requirement || 'Tidak ada catatan'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}