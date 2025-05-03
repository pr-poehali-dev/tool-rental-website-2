
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/api/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * 
 * @param children - содержимое защищенного маршрута
 * @param requiredRole - необходимая роль для доступа (опционально)
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Если проверка авторизации еще не завершена, показываем загрузку
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль и у пользователя ее нет
  if (requiredRole && user?.role !== requiredRole) {
    // Для администраторов разрешаем доступ к маршрутам для менеджеров
    if (requiredRole === UserRole.MANAGER && user?.role === UserRole.ADMIN) {
      return <>{children}</>;
    }
    
    // В остальных случаях перенаправляем на главную страницу
    return <Navigate to="/" replace />;
  }

  // Если все проверки пройдены, показываем содержимое защищенного маршрута
  return <>{children}</>;
};

export default ProtectedRoute;
