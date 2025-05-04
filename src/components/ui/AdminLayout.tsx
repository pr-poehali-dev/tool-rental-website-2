
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigationItems = [
    {
      name: "Панель управления",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Товары",
      path: "/admin/products",
      icon: <Package className="h-5 w-5" />
    },
    {
      name: "Бронирования",
      path: "/admin/bookings",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Аналитика",
      path: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Пользователи",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Настройки",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильное меню */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-3 text-xl font-bold text-orange-600">ПрокатПро</span>
        </div>
        <div className="text-lg font-semibold">{title}</div>
      </div>

      {/* Мобильная боковая панель */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold text-orange-600">ПрокатПро</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col p-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Десктопная боковая панель */}
      <div className="hidden lg:flex">
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              {sidebarOpen ? (
                <span className="text-xl font-bold text-orange-600">ПрокатПро</span>
              ) : (
                <span className="text-xl font-bold text-orange-600 mx-auto">П</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronRight
                  className={`h-5 w-5 transition-transform duration-300 ${
                    !sidebarOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
            <div className="flex flex-col p-4 flex-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className={sidebarOpen ? "" : "mx-auto"}>
                    {item.icon}
                  </div>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 w-full ${
                  sidebarOpen ? "" : "justify-center"
                }`}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Выйти</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          } flex-1`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>

      {/* Мобильный контент */}
      <div className="lg:hidden p-4 pt-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
