
import { useEffect } from "react";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Check,
  Clock,
  Ban,
  XCircle,
} from "lucide-react";
import { useStatistics } from "@/hooks/useStatistics";
import { BookingService } from "@/services/booking-service";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AdminHome = () => {
  const { statistics, loading, error } = useStatistics();

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Моковые данные для последних бронирований
  const recentBookings = [
    {
      id: "B-2304",
      customer: "Иванов Алексей",
      date: "03.05.2025",
      status: "Активно",
      amount: "₽12,800",
    },
    {
      id: "B-2303",
      customer: "Смирнова Ольга",
      date: "02.05.2025",
      status: "Ожидает",
      amount: "₽8,600",
    },
    {
      id: "B-2302",
      customer: "Петров Сергей",
      date: "01.05.2025",
      status: "Завершено",
      amount: "₽15,200",
    },
    {
      id: "B-2301",
      customer: "Козлова Анна",
      date: "30.04.2025",
      status: "Отменено",
      amount: "₽7,400",
    },
  ];

  // Моковые данные для оповещений
  const alerts = [
    "Требуется обновление наличия для 3 товаров",
    "5 бронирований ожидают подтверждения",
    "Инструмент «Перфоратор Bosch» требует технического обслуживания",
  ];

  return (
    <AdminLayout
      title="Панель управления"
      subtitle="Обзор ключевых показателей и последних событий"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="ml-2 text-gray-600">Загрузка статистики...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Статистика товаров */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Товары
                </CardTitle>
                <Package className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.products.total}</div>
                <p className="text-xs text-green-600 mt-1">{statistics.products.growth}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-green-50 p-2 rounded-md flex flex-col items-center">
                    <span className="text-xs text-gray-600">Доступно</span>
                    <span className="font-medium text-green-700 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {statistics.products.available}
                    </span>
                  </div>
                  <div className="bg-red-50 p-2 rounded-md flex flex-col items-center">
                    <span className="text-xs text-gray-600">Недоступно</span>
                    <span className="font-medium text-red-700 flex items-center">
                      <Ban className="h-3 w-3 mr-1" />
                      {statistics.products.unavailable}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Статистика бронирований */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Бронирования
                </CardTitle>
                <Calendar className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.bookings.total}</div>
                <p className="text-xs text-green-600 mt-1">{statistics.bookings.growth}</p>
                
                <div className="grid grid-cols-4 gap-1 mt-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">Активные</span>
                    <span className="font-medium text-green-700">{statistics.bookings.active}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">Ожидают</span>
                    <span className="font-medium text-yellow-600">{statistics.bookings.pending}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">Завершены</span>
                    <span className="font-medium text-blue-700">{statistics.bookings.completed}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">Отменены</span>
                    <span className="font-medium text-red-700">{statistics.bookings.cancelled}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Статистика пользователей */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Пользователи
                </CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.users.total}</div>
                <p className="text-xs text-green-600 mt-1">{statistics.users.growth}</p>
                
                <div className="bg-green-50 p-2 rounded-md flex items-center justify-center mt-4">
                  <span className="text-xs text-gray-600 mr-2">Новых за месяц:</span>
                  <span className="font-medium text-green-700">{statistics.users.new}</span>
                </div>
              </CardContent>
            </Card>

            {/* Статистика дохода */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Доход
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAmount(statistics.revenue.thisMonth)}</div>
                <p className="text-xs text-green-600 mt-1">{statistics.revenue.growth}</p>
                
                <div className="bg-indigo-50 p-2 rounded-md flex items-center justify-center mt-4">
                  <span className="text-xs text-gray-600 mr-2">Всего за год:</span>
                  <span className="font-medium text-indigo-700">{formatAmount(statistics.revenue.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Последние бронирования</CardTitle>
                    <CardDescription>
                      Обзор последних бронирований в системе
                    </CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin/bookings" className="text-blue-600 flex items-center">
                      Все бронирования <Calendar className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Клиент</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Дата</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-blue-600">{booking.id}</td>
                            <td className="py-3 px-4">{booking.customer}</td>
                            <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  booking.status === "Активно"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "Ожидает"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.status === "Завершено"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{booking.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    Оповещения
                  </CardTitle>
                  <CardDescription>
                    Важные уведомления требующие внимания
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Активность системы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Последнее обновление</p>
                        <p className="text-xs text-gray-500">{format(new Date(), "dd.MM.yyyy HH:mm")}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Система работает нормально</p>
                        <p className="text-xs text-gray-500">Все сервисы активны</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminHome;
