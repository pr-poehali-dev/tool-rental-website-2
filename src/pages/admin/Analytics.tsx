
import { useState, useEffect } from "react";
import { AnalyticsService, BookingAnalytics, ExportOptions, TopProductData } from "@/services/analytics-service";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  FileDown,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Package,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  LineChart as RechartLineChart,
  AreaChart,
  Area,
} from "recharts";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "xlsx">("csv");
  const [exportData, setExportData] = useState<"bookings" | "revenue" | "products" | "all">("all");
  const [exportLoading, setExportLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsService.getBookingAnalytics();
      setAnalytics(data);
      setTopProducts(data.topProducts);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные аналитики",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const options: ExportOptions = {
        format: exportFormat,
        dateRange: {
          from: new Date(startDate),
          to: new Date(endDate),
        },
        data: exportData,
      };
      
      await AnalyticsService.exportData(options);
      
      toast({
        title: "Экспорт завершен",
        description: `Данные успешно экспортированы в формате ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось экспортировать данные",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Функция форматирования денежных величин
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Кастомный компонент для тултипа графиков
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes("Доход") || entry.name.includes("Revenue")
                  ? formatCurrency(entry.value)
                  : entry.value
              }
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <AdminLayout
        title="Аналитика"
        subtitle="Анализ продаж, бронирований и популярных товаров"
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="ml-2 text-gray-600">Загрузка аналитики...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Аналитика"
      subtitle="Анализ продаж, бронирований и популярных товаров"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6 grid grid-cols-3 max-w-lg">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" /> Обзор
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" /> Доходы
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <Package className="h-4 w-4 mr-2" /> Товары
          </TabsTrigger>
        </TabsList>

        {/* Вкладка Обзор */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Всего бронирований
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{analytics?.totalBookings}</div>
                    <p className="text-xs text-green-600 mt-1">
                      +12% за последний месяц
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Доход за текущий месяц
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analytics?.revenueByMonth[4]?.revenue || 0)}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      +18% по сравнению с прошлым месяцем
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Топ-продукт
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold">{topProducts[0]?.name}</div>
                    <p className="text-xs text-gray-600 mt-1">
                      {topProducts[0]?.bookings} бронирований
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Доходы и бронирования по месяцам</CardTitle>
                <CardDescription>
                  Анализ доходов и количества бронирований за год
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={analytics?.revenueByMonth}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        name="Доход, ₽"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bookings"
                        name="Бронирования"
                        stroke="#82ca9d"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Бронирования по статусам</CardTitle>
                <CardDescription>
                  Распределение бронирований по текущему статусу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={analytics?.bookingsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {analytics?.bookingsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Тренд бронирований за последние 30 дней</CardTitle>
                <CardDescription>
                  Динамика ежедневных бронирований
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.bookingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Бронирования"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка Доходы */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Период</CardTitle>
                <CardDescription>
                  Выберите период для анализа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={timePeriod === "day" ? "default" : "outline"}
                      className={timePeriod === "day" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      onClick={() => setTimePeriod("day")}
                    >
                      День
                    </Button>
                    <Button
                      variant={timePeriod === "week" ? "default" : "outline"}
                      className={timePeriod === "week" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      onClick={() => setTimePeriod("week")}
                    >
                      Неделя
                    </Button>
                    <Button
                      variant={timePeriod === "month" ? "default" : "outline"}
                      className={timePeriod === "month" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      onClick={() => setTimePeriod("month")}
                    >
                      Месяц
                    </Button>
                    <Button
                      variant={timePeriod === "year" ? "default" : "outline"}
                      className={timePeriod === "year" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      onClick={() => setTimePeriod("year")}
                    >
                      Год
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Экспорт данных</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="format">Формат файла</Label>
                        <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                          <SelectTrigger id="format">
                            <SelectValue placeholder="Выберите формат" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xlsx">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="data">Данные для экспорта</Label>
                        <Select value={exportData} onValueChange={(value: any) => setExportData(value)}>
                          <SelectTrigger id="data">
                            <SelectValue placeholder="Выберите данные" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все данные</SelectItem>
                            <SelectItem value="bookings">Бронирования</SelectItem>
                            <SelectItem value="revenue">Доходы</SelectItem>
                            <SelectItem value="products">Товары</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Начальная дата</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Конечная дата</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={handleExport}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Экспорт...
                          </>
                        ) : (
                          <>
                            <FileDown className="mr-2 h-4 w-4" />
                            Экспортировать данные
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>
                  Доходы за {
                    timePeriod === "day" ? "день" :
                    timePeriod === "week" ? "неделю" :
                    timePeriod === "month" ? "месяц" : "год"
                  }
                </CardTitle>
                <CardDescription>
                  Анализ доходов по периодам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics?.revenueByMonth}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Доход, ₽"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Сравнение доходов по категориям</CardTitle>
              <CardDescription>
                Распределение доходов по категориям товаров
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: "Электроинструмент", revenue: 120000 },
                      { category: "Садовая техника", revenue: 85000 },
                      { category: "Строительное оборудование", revenue: 150000 },
                      { category: "Лестницы и подмости", revenue: 45000 },
                      { category: "Измерительное оборудование", revenue: 35000 },
                      { category: "Сварочное оборудование", revenue: 75000 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Доход, ₽"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка Товары */}
        <TabsContent value="products">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Топ-10 популярных товаров</CardTitle>
              <CardDescription>
                Самые востребованные товары по количеству бронирований и доходу
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Название</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Бронирований</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Доход</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Доступность</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Тренд</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.slice(0, 10).map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-center">{product.bookings}</td>
                        <td className="py-3 px-4 text-center">{formatCurrency(product.revenue)}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-24">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${product.availability}%` }}
                              ></div>
                            </div>
                            <span>{product.availability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {Math.random() > 0.5 ? (
                            <span className="text-green-600 flex items-center justify-center">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              {Math.floor(Math.random() * 20) + 5}%
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center justify-center">
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              {Math.floor(Math.random() * 10) + 1}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Топ-5 товаров по доходу</CardTitle>
                <CardDescription>
                  Товары, принесшие наибольший доход
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map(product => ({
                          name: product.name.length > 20 
                            ? product.name.substring(0, 20) + '...' 
                            : product.name,
                          revenue: product.revenue
                        }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        name="Доход, ₽"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Топ-5 товаров по бронированиям</CardTitle>
                <CardDescription>
                  Товары с наибольшим количеством бронирований
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts
                        .sort((a, b) => b.bookings - a.bookings)
                        .slice(0, 5)
                        .map(product => ({
                          name: product.name.length > 20 
                            ? product.name.substring(0, 20) + '...' 
                            : product.name,
                          bookings: product.bookings
                        }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="bookings"
                        name="Бронирования"
                        fill="#82ca9d"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Analytics;
