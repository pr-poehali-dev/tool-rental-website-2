
import { useState, useEffect } from "react";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BookingService, Booking, BookingUpdateDto } from "@/services/booking-service";
import { Calendar, Search, EyeIcon, PencilIcon, Trash2Icon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<BookingUpdateDto>({
    status: "pending",
    startDate: "",
    endDate: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список бронирований",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация и поиск бронирований
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Форматирование даты
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd.MM.yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Открытие диалога с деталями бронирования
  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  // Открытие диалога редактирования бронирования
  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormData({
      status: booking.status,
      startDate: booking.startDate,
      endDate: booking.endDate,
    });
    setIsEditDialogOpen(true);
  };

  // Открытие диалога удаления бронирования
  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  // Обработка изменения статуса
  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as "pending" | "active" | "completed" | "cancelled",
    });
  };

  // Обработка изменения даты
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обновление бронирования
  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    setActionLoading(true);
    try {
      const updatedBooking = await BookingService.updateBooking(
        selectedBooking.id,
        formData
      );

      if (updatedBooking) {
        toast({
          title: "Успех",
          description: "Бронирование успешно обновлено",
        });
        fetchBookings(); // Обновляем список бронирований
      } else {
        // В демо-режиме просто закрываем диалог
        toast({
          title: "Демо-режим",
          description: "В демо-режиме бронирование не обновляется",
        });
      }
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить бронирование",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Удаление бронирования
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    setActionLoading(true);
    try {
      const success = await BookingService.deleteBooking(selectedBooking.id);

      if (success) {
        toast({
          title: "Успех",
          description: "Бронирование успешно удалено",
        });
        
        // В демо-режиме мы не делаем реального удаления
        // fetchBookings(); // Обновляем список бронирований
      }
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить бронирование",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Перевод статуса на русский
  const translateStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Активно";
      case "pending":
        return "Ожидает";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      default:
        return status;
    }
  };

  return (
    <AdminLayout
      title="Управление бронированиями"
      subtitle="Просмотр и управление бронированиями клиентов"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Calendar className="h-5 w-5 mr-2" /> Список бронирований
            </CardTitle>
            <CardDescription>
              Всего бронирований: {bookings.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Поиск бронирований..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активно</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <p className="ml-2 text-gray-600">Загрузка бронирований...</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID бронирования</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Товар</TableHead>
                    <TableHead>Дата начала</TableHead>
                    <TableHead>Дата окончания</TableHead>
                    <TableHead className="text-center">Статус</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {searchTerm || statusFilter !== "all"
                          ? "Ничего не найдено по вашему запросу"
                          : "Список бронирований пуст"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.customerName}</TableCell>
                        <TableCell>{booking.productName}</TableCell>
                        <TableCell>{formatDate(booking.startDate)}</TableCell>
                        <TableCell>{formatDate(booking.endDate)}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {translateStatus(booking.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatAmount(booking.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsDialog(booking)}
                              title="Просмотреть"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(booking)}
                              title="Редактировать"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(booking)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              title="Удалить"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог просмотра деталей бронирования */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Детали бронирования</DialogTitle>
            <DialogDescription>
              Подробная информация о бронировании #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID бронирования</h4>
                  <p>{selectedBooking.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Статус</h4>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {translateStatus(selectedBooking.status)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Клиент</h4>
                <p>{selectedBooking.customerName}</p>
                <p className="text-sm text-gray-500">ID: {selectedBooking.customerId}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Товар</h4>
                <p>{selectedBooking.productName}</p>
                <p className="text-sm text-gray-500">ID: {selectedBooking.productId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Дата начала</h4>
                  <p>{formatDate(selectedBooking.startDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Дата окончания</h4>
                  <p>{formatDate(selectedBooking.endDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Сумма аренды</h4>
                  <p className="font-medium">{formatAmount(selectedBooking.totalAmount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Залог</h4>
                  <p>{formatAmount(selectedBooking.depositAmount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Создано</h4>
                  <p className="text-sm">
                    {format(parseISO(selectedBooking.createdAt), "dd.MM.yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Обновлено</h4>
                  <p className="text-sm">
                    {format(parseISO(selectedBooking.updatedAt), "dd.MM.yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования бронирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать бронирование</DialogTitle>
            <DialogDescription>
              Изменение параметров бронирования #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус бронирования</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Дата окончания</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Отмена
            </Button>
            <Button onClick={handleUpdateBooking} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить бронирование</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить бронирование #{selectedBooking?.id}? Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBooking}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BookingManagement;
