
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileSpreadsheet, FileBarChart, FileText, ChevronDown, ChevronUp, Calendar, DollarSign, Percent, TrendingUp, Activity, Info, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { AnalyticsService, FinancialReportData, EquipmentUsageReportData, ProductEfficiencyReportData } from "@/services/analytics-service";
import ReportTemplate from "@/components/ReportTemplate";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("financial");
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [loading, setLoading] = useState(false);

  // Состояния для отчетов
  const [financialReport, setFinancialReport] = useState<FinancialReportData | null>(null);
  const [equipmentReport, setEquipmentReport] = useState<EquipmentUsageReportData | null>(null);
  const [efficiencyReport, setEfficiencyReport] = useState<ProductEfficiencyReportData | null>(null);

  // Загрузка финансового отчета
  const loadFinancialReport = async () => {
    setLoading(true);
    try {
      const report = await AnalyticsService.getFinancialReport(period);
      setFinancialReport(report);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить финансовый отчет",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка отчета о загруженности оборудования
  const loadEquipmentReport = async () => {
    setLoading(true);
    try {
      const report = await AnalyticsService.getEquipmentUsageReport(period);
      setEquipmentReport(report);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить отчет о загруженности оборудования",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка отчета об эффективности товаров
  const loadEfficiencyReport = async () => {
    setLoading(true);
    try {
      const report = await AnalyticsService.getProductEfficiencyReport(period);
      setEfficiencyReport(report);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить отчет об эффективности товаров",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для загрузки отчета при изменении вкладки или периода
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "financial" && !financialReport) {
      loadFinancialReport();
    } else if (value === "equipment" && !equipmentReport) {
      loadEquipmentReport();
    } else if (value === "efficiency" && !efficiencyReport) {
      loadEfficiencyReport();
    }
  };

  const handlePeriodChange = (value: "month" | "quarter" | "year") => {
    setPeriod(value);
    
    // Сбрасываем текущие отчеты
    setFinancialReport(null);
    setEquipmentReport(null);
    setEfficiencyReport(null);
    
    // Загружаем новый отчет в зависимости от активной вкладки
    if (activeTab === "financial") {
      loadFinancialReport();
    } else if (activeTab === "equipment") {
      loadEquipmentReport();
    } else if (activeTab === "efficiency") {
      loadEfficiencyReport();
    }
  };

  // Форматирование валюты
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Форматирование процентов
  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  // Обработчики действий с отчетами
  const handlePrintReport = () => {
    window.print();
  };

  const handleShareReport = () => {
    toast({
      title: "Шаринг отчета",
      description: "Функция шаринга отчета будет доступна в следующем обновлении",
    });
  };

  // Рендер таба с финансовым отчетом
  const renderFinancialReport = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="ml-2 text-gray-600">Загрузка финансового отчета...</p>
        </div>
      );
    }

    if (!financialReport) {
      return (
        <div className="text-center py-8">
          <Button
            onClick={loadFinancialReport}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Сформировать финансовый отчет
          </Button>
        </div>
      );
    }

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

    // Подготовка данных для экспорта - плоская структура
    const exportData = [
      ...financialReport.revenueByDay.map(item => ({
        Дата: format(new Date(item.date), 'dd.MM.yyyy'),
        Доход: item.revenue,
        Тип: 'Ежедневный доход'
      })),
      ...financialReport.revenueByCategory.map(item => ({
        Категория: item.category,
        Доход: item.revenue,
        Тип: 'Доход по категориям'
      })),
      ...financialReport.topClients.map(item => ({
        Клиент: item.name,
        Доход: item.revenue,
        Бронирований: item.bookings,
        Тип: 'Топ клиенты'
      }))
    ];

    return (
      <ReportTemplate
        title={financialReport.title}
        description={financialReport.description}
        generatedAt={financialReport.generatedAt}
        periodStart={financialReport.periodStart}
        periodEnd={financialReport.periodEnd}
        data={exportData}
        onPrint={handlePrintReport}
        onShare={handleShareReport}
      >
        <div className="space-y-6">
          {/* Ключевые показатели */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Общий доход за период
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialReport.totalRevenue)}
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Количество бронирований
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {financialReport.totalBookings}
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* График доходов по дням */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Динамика доходов за период</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={financialReport.revenueByDay.slice(-30)} // Показываем только последние 30 дней для читаемости
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      const parts = date.split('-');
                      return `${parts[2]}.${parts[1]}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Доход']}
                    labelFormatter={(date) => {
                      const parts = date.split('-');
                      return `${parts[2]}.${parts[1]}.${parts[0]}`;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Доходы по категориям */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Доходы по категориям товаров</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={financialReport.revenueByCategory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Доход']} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Доход"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialReport.revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="category"
                      label={({ category, percent }) =>
                        `${category}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {financialReport.revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Доход']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Топ клиенты */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Топ-5 клиентов по доходу</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Клиент</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Бронирований</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Доход</th>
                  </tr>
                </thead>
                <tbody>
                  {financialReport.topClients.map((client, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{client.name}</td>
                      <td className="py-3 px-4 text-center">{client.bookings}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(client.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ReportTemplate>
    );
  };

  // Рендер таба с отчетом о загруженности оборудования
  const renderEquipmentReport = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="ml-2 text-gray-600">Загрузка отчета о загруженности оборудования...</p>
        </div>
      );
    }

    if (!equipmentReport) {
      return (
        <div className="text-center py-8">
          <Button
            onClick={loadEquipmentReport}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Сформировать отчет о загруженности
          </Button>
        </div>
      );
    }

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

    // Подготовка данных для экспорта
    const exportData = [
      ...equipmentReport.equipmentByUsage.map(item => ({
        Оборудование: item.name,
        Часы_использования: item.hours,
        Загруженность_процент: item.utilization,
        Тип: 'Загруженность оборудования'
      })),
      ...equipmentReport.maintenanceAlerts.map(item => ({
        Оборудование: item.name,
        Последнее_ТО: format(new Date(item.lastMaintenance), 'dd.MM.yyyy'),
        Часы_после_ТО: item.usageHours,
        Тип: 'Оборудование требующее ТО'
      }))
    ];

    return (
      <ReportTemplate
        title={equipmentReport.title}
        description={equipmentReport.description}
        generatedAt={equipmentReport.generatedAt}
        periodStart={equipmentReport.periodStart}
        periodEnd={equipmentReport.periodEnd}
        data={exportData}
        onPrint={handlePrintReport}
        onShare={handleShareReport}
      >
        <div className="space-y-6">
          {/* Ключевые показатели */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Общее количество единиц
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {equipmentReport.totalEquipment}
                  </div>
                  <FileBarChart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Общие часы использования
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {equipmentReport.totalUsageHours}
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Среднее использование
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {equipmentReport.avgUsagePerItem} ч
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Топ-10 оборудования по использованию */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Топ-10 единиц оборудования по загруженности</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={equipmentReport.equipmentByUsage.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (name === 'hours') return [`${value} часов`, 'Часы использования'];
                      return [`${value}%`, 'Загруженность'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="hours" name="Часы использования" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Распределение загруженности */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Распределение оборудования по загруженности</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Низкая (0-30%)', value: equipmentReport.equipmentByUsage.filter(e => e.utilization <= 30).length },
                            { name: 'Средняя (31-60%)', value: equipmentReport.equipmentByUsage.filter(e => e.utilization > 30 && e.utilization <= 60).length },
                            { name: 'Высокая (61-90%)', value: equipmentReport.equipmentByUsage.filter(e => e.utilization > 60 && e.utilization <= 90).length },
                            { name: 'Критическая (91-100%)', value: equipmentReport.equipmentByUsage.filter(e => e.utilization > 90).length },
                          ]}
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
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h4 className="text-base font-medium mb-3">Требуется обслуживание</h4>
                <div className="space-y-3">
                  {equipmentReport.maintenanceAlerts.map((alert, i) => (
                    <Card key={i} className="bg-orange-50 border-orange-200">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{alert.name}</p>
                            <p className="text-sm text-gray-600">Последнее ТО: {format(new Date(alert.lastMaintenance), "dd.MM.yyyy")}</p>
                          </div>
                          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            {alert.usageHours} часов
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReportTemplate>
    );
  };

  return (
    <AdminLayout
      title="Отчеты"
      subtitle="Детализированные отчеты о работе сервиса"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Отчеты для печати</h2>
          <p className="text-sm text-muted-foreground">
            Формирование и печать детализированных отчетов по различным показателям
          </p>
        </div>
        <div>
          <Select value={period} onValueChange={(value: any) => handlePeriodChange(value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="financial" className="flex items-center">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Финансовый
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center">
            <FileBarChart className="h-4 w-4 mr-2" /> Загруженность
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Эффективность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          {renderFinancialReport()}
        </TabsContent>

        <TabsContent value="equipment">
          {renderEquipmentReport()}
        </TabsContent>

        <TabsContent value="efficiency">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Отчет об эффективности товаров будет реализован в следующем запросе
            </p>
            <Button disabled className="mr-2">
              <FileText className="h-4 w-4 mr-2" />
              Загрузить отчет
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Reports;
