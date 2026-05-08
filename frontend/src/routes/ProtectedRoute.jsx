import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isChecking = useAuthStore((state) => state.isChecking);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-blue-600 animate-pulse">Memuat Sesi...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}