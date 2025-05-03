
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth-service';
import { AuthCredentials, RegistrationData, User, UserRole } from '@/lib/api/types';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Инициализация - проверяем, есть ли пользователь в localStorage
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Вход в систему
  const login = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await AuthService.login(credentials);
      setUser(loggedInUser);
      
      toast({
        title: 'Успешный вход',
        description: `Добро пожаловать, ${loggedInUser.firstName}!`,
      });
      
      return loggedInUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при входе';
      setError(errorMessage);
      
      toast({
        title: 'Ошибка входа',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Регистрация
  const register = useCallback(async (data: RegistrationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const registeredUser = await AuthService.register(data);
      setUser(registeredUser);
      
      toast({
        title: 'Успешная регистрация',
        description: `Добро пожаловать, ${registeredUser.firstName}!`,
      });
      
      return registeredUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при регистрации';
      setError(errorMessage);
      
      toast({
        title: 'Ошибка регистрации',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Выход из системы
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await AuthService.logout();
      setUser(null);
      
      toast({
        title: 'Выход выполнен',
        description: 'Вы успешно вышли из системы',
      });
      
      navigate('/');
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при выходе из системы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  // Проверка роли пользователя
  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isManager: user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN,
    loading,
    error,
    login,
    register,
    logout,
    hasRole
  };
};

export default useAuth;
