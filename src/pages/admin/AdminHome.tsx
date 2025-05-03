
import React from "react";
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
} from "lucide-react";

const AdminHome = () => {
  // Моковые данные для статистики
  const stats = [
    {
      title: "Всего товаров",
      value: "128",
      change: "+12% за месяц",
      icon: <Package className="h-5 w-5 text-orange-600" />,
    },
    {
      title: "Активные бронирования",
      value: "42",
      change: "+8% за месяц",
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Пользователей",
      value: "364",
      change: "+24% за месяц",
      icon: <Users className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Доход",
      value: "₽358,420",
      change: "+18% за месяц",
      icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Последние бронирования</CardTitle>
              <CardDescription>
                Обзор последних бронирований в системе
              </CardDescription>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
