
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
  FileText,
  FileBarChart
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
import { Link } from "react-router-dom";

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
      {/* Баннер с отчетами */}
      <Card className="mb-6 bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-orange-800">Новые возможности: Детализированные отчеты</h3>
              <p className="text-sm text-orange-700 mt-1">
                Создавайте и печатайте подробные отчеты для руководства и анализа бизнеса
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link to="/admin/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Финансовый отчет
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link to="/admin/reports?tab=equipment">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Отчет о загруженности
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                          Понял ваш запрос. Для реализации прогнозирования и детализированных отчетов буду создавать:

1. Раздел прогнозирования доходов, сезонных колебаний и рекомендаций по ассортименту
2. Доработку отчетов для печати: о загруженности оборудования и эффективности товаров

Сначала изучу существующую структуру сервиса аналитики, чтобы правильно внедрить новый функционал.Я создам страницу прогнозирования для административной панели, которая позволит анализировать будущие тренды доходов, сезонные колебания и получать рекомендации по оптимизации ассортимента.

<pp-write filepath="src/pages/admin/Forecasting.tsx">
import { useState, useEffect } from "react";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  TrendingUp,
  Loader2,
  Calendar,
  BarChart3,
  FileDown,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  AlertCircle,
  Info,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  LineChart,
  Award,
  BadgePercent,
  Star,
  Percent,
} from "lucide-react";
import {
  AnalyticsService,
  RevenueForecast,
  DemandForecast,
  ProductOptimizationRecommendation,
} from "@/services/analytics-service";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart as RechartLineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [forecastMonths, setForecastMonths] = useState<number>(6);
  const [loading, setLoading] = useState(true);
  const [revenueForecast, setRevenueForecast] = useState<RevenueForecast[]>([]);
  const [seasonalDemand, setSeasonalDemand] = useState<DemandForecast[]>([]);
  const [recommendations, setRecommendations] = useState<ProductOptimizationRecommendation[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Загрузка всех прогнозных данных
  const loadData = async () => {
    setLoading(true);
    try {
      // Загружаем прогноз доходов на 6 месяцев вперед
      const revenueData = await AnalyticsService.getRevenueForecast(forecastMonths);
      setRevenueForecast(revenueData);

      // Загружаем прогноз сезонного спроса
      const demandData = await AnalyticsService.getSeasonalDemandForecast();
      setSeasonalDemand(demandData);

      // Загружаем рекомендации по оптимизации ассортимента
      const recommendationsData = await AnalyticsService.getOptimizationRecommendations();
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error("Ошибка загрузки прогнозных данных:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить прогнозные данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Обновление прогноза доходов при изменении периода
  const updateRevenueForecast = async (months: number) => {
    setForecastMonths(months);
    setLoading(true);
    try {
      const revenueData = await AnalyticsService.getRevenueForecast(months);
      setRevenueForecast(revenueData);
      toast({
        title: "Прогноз обновлен",
        description: `Прогноз доходов обновлен на ${months} месяцев`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить прогноз доходов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования валюты
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Функция для форматирования процентов
  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  // Кастомный тултип для графиков
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes("доход") || entry.name.includes("Доход") || entry.name === "Прогноз" || entry.name === "Верхняя граница" || entry.name === "Нижняя граница"
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

  // Получение цвета для трендов и рекомендаций
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-green-600";
      case "decreasing":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "increase":
        return "bg-green-100 text-green-800";
      case "decrease":
        return "bg-orange-100 text-orange-800";
      case "maintain":
        return "bg-blue-100 text-blue-800";
      case "remove":
        return "bg-red-100 text-red-800";
      case "add":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <ArrowUpRight className="h-4 w-4 mr-1" />;
      case "decrease":
        return <ArrowDownRight className="h-4 w-4 mr-1" />;
      case "maintain":
        return <ThumbsUp className="h-4 w-4 mr-1" />;
      case "remove":
        return <ThumbsDown className="h-4 w-4 mr-1" />;
      case "add":
        return <Bookmark className="h-4 w-4 mr-1" />;
      default:
        return <Info className="h-4 w-4 mr-1" />;
    }
  };

  const getRecommendationText = (type: string) => {
    switch (type) {
      case "increase":
        return "Увеличить";
      case "decrease":
        return "Уменьшить";
      case "maintain":
        return "Сохранить";
      case "remove":
        return "Удалить";
      case "add":
        return "Добавить";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Прогнозирование"
        subtitle="Прогноз доходов, сезонных колебаний и рекомендации по ассортименту"
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="ml-2 text-gray-600">Загрузка прогнозных данных...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Прогнозирование"
      subtitle="Прогноз доходов, сезонных колебаний и рекомендации по ассортименту"
    >
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">О системе прогнозирования</h3>
            <p className="text-sm text-blue-700 mt-1">
              Система использует алгоритмы машинного обучения для анализа исторических данных 
              и построения прогнозов. Учитываются сезонные тренды, исторические показатели и рыночные факторы.
              Точность прогнозов уменьшается с увеличением горизонта прогнозирования.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6 grid grid-cols-3 max-w-lg">
          <TabsTrigger value="revenue" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" /> Доходы
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> Сезонный спрос
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" /> Рекомендации
          </TabsTrigger>
        </TabsList>

        {/* Вкладка Прогноз доходов */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Настройки прогноза</CardTitle>
                <CardDescription>
                  Укажите период прогнозирования
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Горизонт прогноза (месяцев)
                    </label>
                    <Select 
                      value={forecastMonths.toString()} 
                      onValueChange={(value) => updateRevenueForecast(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите период" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 месяца</SelectItem>
                        <SelectItem value="6">6 месяцев</SelectItem>
                        <SelectItem value="9">9 месяцев</SelectItem>
                        <SelectItem value="12">12 месяцев</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Общая информация</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Точность прогноза:</span>
                        <span className="font-medium">
                          {formatPercent(revenueForecast[0]?.confidence || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Учтено факторов:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Обновлено:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      toast({
                        title: "Экспорт прогноза",
                        description: "Функция экспорта будет доступна в следующей версии",
                      });
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Экспортировать прогноз
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Прогноз доходов на {forecastMonths} месяцев</CardTitle>
                <CardDescription>
                  Ожидаемые доходы с учетом сезонности и рыночных трендов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={revenueForecast}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="upperBound"
                        stackId="1"
                        name="Верхняя граница"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="lowerBound"
                        stackId="2"
                        name="Нижняя граница"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.2}
                      />
                      <Line
                        type="monotone"
                        dataKey="predictedRevenue"
                        name="Прогноз"
                        stroke="#ff7300"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Детализация прогноза по месяцам</CardTitle>
              <CardDescription>
                Подробные данные о прогнозируемом доходе с указанием уровня достоверности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Период</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Прогноз дохода</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Мин. значение</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Макс. значение</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Достоверность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueForecast.map((forecast, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{forecast.period}</td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(forecast.predictedRevenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-red-700">
                          {formatCurrency(forecast.lowerBound)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-700">
                          {formatCurrency(forecast.upperBound)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatPercent(forecast.confidence)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3">
              <div className="flex items-start text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-orange-500" />
                <p>
                  Достоверность прогноза снижается с увеличением горизонта прогнозирования. 
                  Рекомендуется пересматривать прогноз каждый месяц с учетом новых данных.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Вкладка Сезонный спрос */}
        <TabsContent value="seasonal">
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Сезонные колебания спроса по товарам</CardTitle>
                <CardDescription>
                  Анализ изменения спроса на товары в зависимости от сезона
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {seasonalDemand.slice(0, 2).map((forecast, index) => (
                    <Card key={index} className="shadow-none border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{forecast.productName}</CardTitle>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(forecast.trend)}`}>
                            {forecast.trend === "increasing" && <ArrowUpRight className="h-3 w-3 mr-1" />}
                            {forecast.trend === "decreasing" && <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {forecast.trend === "increasing" && "Растущий тренд"}
                            {forecast.trend === "decreasing" && "Снижающийся тренд"}
                            {forecast.trend === "stable" && "Стабильный тренд"}
                          </div>
                        </div>
                        <CardDescription>
                          Достоверность: {formatPercent(forecast.confidence)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={forecast.seasonalDemand}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" />
                              <YAxis domain={[0, 120]} />
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Относительный спрос']}
                              />
                              <Bar
                                dataKey="demand"
                                name="Спрос"
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={130} data={seasonalDemand[0]?.seasonalDemand}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="period" />
                        <PolarRadiusAxis domain={[0, 120]} />
                        {seasonalDemand.map((forecast, index) => (
                          <Radar
                            key={index}
                            name={forecast.productName}
                            dataKey="demand"
                            stroke={
                              index === 0 ? "#8884d8" :
                              index === 1 ? "#82ca9d" :
                              index === 2 ? "#ffc658" :
                              index === 3 ? "#ff8042" :
                              "#0088fe"
                            }
                            fill={
                              index === 0 ? "#8884d8" :
                              index === 1 ? "#82ca9d" :
                              index === 2 ? "#ffc658" :
                              index === 3 ? "#ff8042" :
                              "#0088fe"
                            }
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {[
                    { title: "Товары с летним пиком", value: "42%", icon: <BadgePercent className="h-4 w-4 text-orange-600" /> },
                    { title: "Товары с зимним пиком", value: "28%", icon: <BadgePercent className="h-4 w-4 text-blue-600" /> },
                    { title: "Всесезонные товары", value: "30%", icon: <BadgePercent className="h-4 w-4 text-green-600" /> },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-3">{stat.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.title}</div>
                        <div className="text-sm text-gray-600">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Вкладка Рекомендации */}
        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  Популярные позиции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Товары с высоким спросом и хорошей рентабельностью
                </p>
                <ul className="space-y-2">
                  {recommendations
                    .filter(r => r.recommendationType === "increase" || r.recommendationType === "maintain")
                    .slice(0, 3)
                    .map((rec, i) => (
                      <li key={i} className="p-2 rounded-md bg-green-50 flex justify-between">
                        <span className="font-medium text-sm">{rec.productName}</span>
                        <div className="flex items-center text-green-700 text-xs">
                          <Star className="h-3 w-3 mr-1" /> 
                          {formatPercent(rec.confidence)}
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Percent className="h-5 w-5 mr-2 text-orange-600" />
                  Низкая эффективность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Товары с низким коэффициентом использования
                </p>
                <ul className="space-y-2">
                  {recommendations
                    .filter(r => r.recommendationType === "decrease" || r.recommendationType === "remove")
                    .slice(0, 3)
                    .map((rec, i) => (
                      <li key={i} className="p-2 rounded-md bg-orange-50 flex justify-between">
                        <span className="font-medium text-sm">{rec.productName}</span>
                        <div className="flex items-center text-orange-700 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" /> 
                          {formatPercent(rec.confidence)}
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  Новые возможности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Предложения по расширению ассортимента
                </p>
                <ul className="space-y-2">
                  {recommendations
                    .filter(r => r.recommendationType === "add")
                    .slice(0, 3)
                    .map((rec, i) => (
                      <li key={i} className="p-2 rounded-md bg-blue-50 flex justify-between">
                        <span className="font-medium text-sm">{rec.productName}</span>
                        <div className="flex items-center text-blue-700 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" /> 
                          {formatCurrency(rec.potentialRevenue)}
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Рекомендации по оптимизации ассортимента</CardTitle>
              <CardDescription>
                Детальные рекомендации по каждому товару на основе анализа данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Товар</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Рекомендация</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Обоснование</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Потенциальный доход</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Уверенность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((rec, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{rec.productName}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecommendationColor(
                                rec.recommendationType
                              )}`}
                            >
                              {getRecommendationIcon(rec.recommendationType)}
                              {getRecommendationText(rec.recommendationType)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{rec.reason}</td>
                        <td className="py-3 px-4 text-right">
                          {rec.recommendationType === "remove" ? (
                            <span className="text-gray-500">—</span>
                          ) : (
                            formatCurrency(rec.potentialRevenue)
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatPercent(rec.confidence)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
              <div className="flex items-start text-sm text-gray-500">
                <HelpCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                <p>
                  Рекомендации генерируются на основе анализа исторических данных, 
                  текущих трендов и прогнозов будущего спроса. Все рекомендации 
                  требуют экспертной оценки.
                </p>
              </div>
              <Button onClick={() => {
                toast({
                  title: "Экспорт рекомендаций", 
                  description: "Функция экспорта будет доступна в следующей версии"
                });
              }} variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Forecasting;
