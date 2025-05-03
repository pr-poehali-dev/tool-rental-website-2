
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { ProductService } from "@/services/product-service";
import { Package, Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const ProductManagement = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    deposit: "",
    category: "",
    brand: "",
    imageUrl: "",
    isAvailable: true,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Загрузка продуктов при монтировании компонента
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик изменения поля формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else if (name === "price" || name === "deposit") {
      // Разрешаем только цифры и точку для числовых полей
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Открытие диалога добавления продукта
  const openAddDialog = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      deposit: "",
      category: "",
      brand: "",
      imageUrl: "",
      isAvailable: true,
    });
    setIsAddDialogOpen(true);
  };

  // Открытие диалога редактирования продукта
  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      deposit: product.deposit?.toString() || "",
      category: product.category || "",
      brand: product.brand || "",
      imageUrl: product.imageUrl || "",
      isAvailable: product.isAvailable !== false,
    });
    setIsEditDialogOpen(true);
  };

  // Открытие диалога удаления продукта
  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Добавление нового продукта
  const handleAddProduct = async () => {
    // Валидация формы
    if (!formData.name || !formData.price) {
      toast({
        title: "Ошибка",
        description: "Название и цена обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await ProductService.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        deposit: parseFloat(formData.deposit),
        category: formData.category,
        brand: formData.brand,
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable,
      });

      toast({
        title: "Успех",
        description: "Товар успешно добавлен",
      });
      
      setIsAddDialogOpen(false);
      fetchProducts(); // Обновляем список товаров
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Редактирование продукта
  const handleEditProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.price) {
      toast({
        title: "Ошибка",
        description: "Название и цена обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await ProductService.updateProduct(selectedProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        deposit: parseFloat(formData.deposit),
        category: formData.category,
        brand: formData.brand,
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable,
      });

      toast({
        title: "Успех",
        description: "Товар успешно обновлен",
      });
      
      setIsEditDialogOpen(false);
      fetchProducts(); // Обновляем список товаров
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить товар",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Удаление продукта
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setActionLoading(true);
    try {
      await ProductService.deleteProduct(selectedProduct.id);

      toast({
        title: "Успех",
        description: "Товар успешно удален",
      });
      
      setIsDeleteDialogOpen(false);
      fetchProducts(); // Обновляем список товаров
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="Управление товарами" subtitle="Добавление, редактирование и удаление товаров">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Package className="h-5 w-5 mr-2" /> Список товаров
            </CardTitle>
            <CardDescription>
              Всего товаров: {products.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Поиск товаров..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <p className="ml-2 text-gray-600">Загрузка товаров...</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Бренд</TableHead>
                    <TableHead className="text-right">Цена (₽/день)</TableHead>
                    <TableHead className="text-right">Залог (₽)</TableHead>
                    <TableHead className="text-center">Доступность</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? "Ничего не найдено по вашему запросу" : "Список товаров пуст"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category || "—"}</TableCell>
                        <TableCell>{product.brand || "—"}</TableCell>
                        <TableCell className="text-right">{product.price}</TableCell>
                        <TableCell className="text-right">{product.deposit || "—"}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.isAvailable !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isAvailable !== false ? "Доступен" : "Недоступен"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                              title="Редактировать"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(product)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              title="Удалить"
                            >
                              <Trash2 className="h-4 w-4" />
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

      {/* Диалог добавления товара */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить новый товар</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового товара в каталог
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Перфоратор Bosch GBH 2-26"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Подробное описание товара..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Цена (₽/день)*</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1000"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Залог (₽)</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="5000"
                  type="text"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Электроинструмент"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Бренд</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Bosch"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL изображения</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => 
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="isAvailable">Доступен для аренды</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={actionLoading}
            >
              Отмена
            </Button>
            <Button onClick={handleAddProduct} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : "Добавить товар"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования товара */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
            <DialogDescription>
              Измените информацию о товаре
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название товара*</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Цена (₽/день)*</Label>
                <Input
                  id="edit-price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deposit">Залог (₽)</Label>
                <Input
                  id="edit-deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  type="text"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Категория</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brand">Бренд</Label>
                <Input
                  id="edit-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">URL изображения</Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => 
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="edit-isAvailable">Доступен для аренды</Label>
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
            <Button onClick={handleEditProduct} disabled={actionLoading}>
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
            <DialogTitle>Удалить товар</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить товар "{selectedProduct?.name}"? Это действие невозможно отменить.
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
              onClick={handleDeleteProduct}
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

export default ProductManagement;
