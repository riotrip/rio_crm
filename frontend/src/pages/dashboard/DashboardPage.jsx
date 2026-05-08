import { useAuthStore } from '../../features/auth/store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <nav className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h1 className="text-xl font-bold text-blue-600">CRM PT. Smart</h1>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-gray-800">{user?.name}</p>
            <p className="text-xs capitalize text-gray-500">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
          >
            Keluar
          </button>
        </div>
      </nav>

      <main className="mt-8">
        <div className="p-10 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-3xl text-blue-600 bg-blue-100 rounded-full">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang di Dashboard</h2>
        </div>
      </main>
    </div>
  );
}