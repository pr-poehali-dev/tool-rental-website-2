
import { useState, useEffect } from "react";
import AdminLayout from "@/components/ui/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BrandingService, BrandingTemplate, BrandingOptions } from "@/services/branding-service";
import {
  Loader2,
  Paintbrush,
  Copy,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  StarIcon,
  Star,
  Image,
  FileText,
  FileImage,
  LayoutTemplate,
  BadgePercent,
  BarChart3,
  TrendingUp,
  CreditCard,
  RotateCcw,
  Eye,
} from "lucide-react";

// Схема валидации для формы создания/редактирования шаблона
const brandingTemplateSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно содержать не менее 2 символов",
  }),
  description: z.string().optional(),
  type: z.enum(['financial', 'equipment', 'efficiency', 'forecast', 'general']),
  isDefault: z.boolean().default(false),
  branding: z.object({
    logo: z.string().url({
      message: "Введите корректный URL логотипа",
    }).or(z.string().length(0)),
    companyName: z.string().min(1, {
      message: "Название компании обязательно",
    }),
    contactInfo: z.string().optional(),
    colorScheme: z.enum(['default', 'dark', 'light', 'custom']),
    customColors: z.object({
      primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
        message: "Введите цвет в формате HEX, например #ff0000",
      }).optional(),
      secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).optional(),
      textColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).optional(),
      accentColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).optional(),
    }).optional(),
    footer: z.string().optional(),
    header: z.string().optional(),
    watermark: z.string().optional(),
  }),
});

type BrandingTemplateFormValues = z.infer<typeof brandingTemplateSchema>;

const BrandingEditor = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"manage" | "create" | "preview">("manage");
  const [templates, setTemplates] = useState<BrandingTemplate[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<BrandingTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Форма для создания/редактирования шаблона
  const form = useForm<BrandingTemplateFormValues>({
    resolver: zodResolver(brandingTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "general",
      isDefault: false,
      branding: {
        logo: "",
        companyName: "ПрокатПро",
        contactInfo: "",
        colorScheme: "default",
      },
    },
  });

  // Загрузка шаблонов при монтировании компонента
  useEffect(() => {
    loadTemplates();
  }, []);

  // Загрузка шаблонов при изменении выбранного типа
  useEffect(() => {
    loadTemplates();
  }, [selectedType]);

  // Загрузка шаблонов из сервиса
  const loadTemplates = () => {
    setIsLoading(true);
    try {
      const loadedTemplates = BrandingService.getTemplatesByType(selectedType as any);
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error("Ошибка при загрузке шаблонов:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить шаблоны брендирования",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик отправки формы
  const onSubmit = (values: BrandingTemplateFormValues) => {
    setIsLoading(true);
    
    try {
      if (isEditing && selectedTemplate) {
        // Обновление существующего шаблона
        BrandingService.updateTemplate(selectedTemplate.id, values);
      } else {
        // Создание нового шаблона
        BrandingService.addTemplate(values);
      }
      
      // Перезагрузка списка шаблонов
      loadTemplates();
      
      // Сброс формы и переход к списку шаблонов
      form.reset();
      setIsEditing(false);
      setActiveTab("manage");
    } catch (error) {
      console.error("Ошибка при сохранении шаблона:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить шаблон брендирования",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик выбора шаблона для редактирования
  const handleEditTemplate = (template: BrandingTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    
    // Заполнение формы данными выбранного шаблона
    form.reset({
      name: template.name,
      description: template.description,
      type: template.type,
      isDefault: template.isDefault,
      branding: template.branding,
    });
    
    setActiveTab("create");
  };

  // Обработчик дублирования шаблона
  const handleDuplicateTemplate = (template: BrandingTemplate) => {
    setIsLoading(true);
    
    try {
      BrandingService.duplicateTemplate(template.id);
      loadTemplates();
    } catch (error) {
      console.error("Ошибка при дублировании шаблона:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось дублировать шаблон",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик удаления шаблона
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    setShowDeleteDialog(false);
    
    try {
      BrandingService.deleteTemplate(selectedTemplate.id);
      loadTemplates();
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Ошибка при удалении шаблона:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить шаблон",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик установки шаблона по умолчанию
  const handleSetDefault = (template: BrandingTemplate) => {
    setIsLoading(true);
    
    try {
      BrandingService.setDefaultTemplate(template.id);
      loadTemplates();
    } catch (error) {
      console.error("Ошибка при установке шаблона по умолчанию:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось установить шаблон по умолчанию",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для отображения иконки типа отчета
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <CreditCard className="h-4 w-4" />;
      case 'equipment':
        return <BarChart3 className="h-4 w-4" />;
      case 'efficiency':
        return <BadgePercent className="h-4 w-4" />;
      case 'forecast':
        return <TrendingUp className="h-4 w-4" />;
      case 'general':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Функция для получения названия типа отчета
  const getTypeName = (type: string) => {
    switch (type) {
      case 'financial':
        return 'Финансовый отчет';
      case 'equipment':
        return 'Отчет о загруженности';
      case 'efficiency':
        return 'Отчет об эффективности';
      case 'forecast':
        return 'Прогнозирование';
      case 'general':
        return 'Общий шаблон';
      default:
        return type;
    }
  };

  // Создание нового шаблона
  const handleCreateNew = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
    form.reset({
      name: "",
      description: "",
      type: "general",
      isDefault: false,
      branding: {
        logo: "",
        companyName: "ПрокатПро",
        contactInfo: "",
        colorScheme: "default",
      },
    });
    setActiveTab("create");
  };

  // Предпросмотр выбранного шаблона
  const handlePreviewTemplate = (template: BrandingTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("preview");
  };

  return (
    <AdminLayout
      title="Редактор брендирования"
      subtitle="Управление шаблонами брендирования для отчетов и экспорта"
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="manage" className="flex items-center">
            <LayoutTemplate className="h-4 w-4 mr-2" /> Шаблоны
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center">
            <Paintbrush className="h-4 w-4 mr-2" /> Редактор
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" /> Предпросмотр
          </TabsTrigger>
        </TabsList>

        {/* Таб управления шаблонами */}
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Шаблоны брендирования</CardTitle>
                  <CardDescription>
                    Управление шаблонами брендирования для разных типов отчетов
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Тип отчета" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      <SelectItem value="general">Общие шаблоны</SelectItem>
                      <SelectItem value="financial">Финансовые отчеты</SelectItem>
                      <SelectItem value="equipment">Отчеты о загруженности</SelectItem>
                      <SelectItem value="efficiency">Отчеты об эффективности</SelectItem>
                      <SelectItem value="forecast">Прогнозирование</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" /> Новый шаблон
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  <p className="ml-2 text-gray-600">Загрузка шаблонов...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Нет доступных шаблонов для выбранного типа отчетов
                  </p>
                  <Button onClick={handleCreateNew} variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Создать шаблон
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="relative overflow-hidden">
                      {template.isDefault && (
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium">
                          По умолчанию
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-base">
                          {getTypeIcon(template.type)}
                          <span className="ml-2">{template.name}</span>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description || getTypeName(template.type)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="rounded overflow-hidden bg-gray-50 p-2 mb-2 text-sm">
                          <div className="flex items-center mb-1">
                            <FileImage className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {template.branding.logo ? "Логотип настроен" : "Без логотипа"}
                            </span>
                          </div>
                          <div className="flex items-center mb-1">
                            <Paintbrush className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {template.branding.colorScheme === 'custom' 
                                ? "Пользовательские цвета" 
                                : template.branding.colorScheme === 'dark' 
                                  ? "Темная схема" 
                                  : template.branding.colorScheme === 'light' 
                                    ? "Светлая схема" 
                                    : "Стандартная схема"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Image className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {template.branding.watermark ? "С водяным знаком" : "Без водяного знака"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Paintbrush className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          {!template.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSetDefault(template)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Таб создания/редактирования шаблона */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? `Редактирование шаблона: ${selectedTemplate?.name}` : "Создание нового шаблона"}
              </CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Измените настройки шаблона брендирования" 
                  : "Настройте параметры нового шаблона брендирования"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      {/* Основные настройки шаблона */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Основные настройки</h3>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Название шаблона</FormLabel>
                              <FormControl>
                                <Input placeholder="Введите название шаблона" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Введите описание шаблона" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Тип отчета</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип отчета" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">Общий шаблон</SelectItem>
                                  <SelectItem value="financial">Финансовый отчет</SelectItem>
                                  <SelectItem value="equipment">Отчет о загруженности</SelectItem>
                                  <SelectItem value="efficiency">Отчет об эффективности</SelectItem>
                                  <SelectItem value="forecast">Прогнозирование</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isDefault"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Использовать по умолчанию</FormLabel>
                                <FormDescription>
                                  Установить как шаблон по умолчанию для выбранного типа отчетов
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Настройки брендирования */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Брендирование</h3>
                        
                        <FormField
                          control={form.control}
                          name="branding.logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL логотипа</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/logo.png" {...field} />
                              </FormControl>
                              <FormDescription>
                                Рекомендуемый размер логотипа: 300x100px
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="branding.companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Название компании</FormLabel>
                              <FormControl>
                                <Input placeholder="Название компании" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="branding.contactInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Контактная информация</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="тел: +7 (XXX) XXX-XX-XX, email: info@example.com" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="branding.colorScheme"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Цветовая схема</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите цветовую схему" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="default">Стандартная (оранжевая)</SelectItem>
                                  <SelectItem value="dark">Темная</SelectItem>
                                  <SelectItem value="light">Светлая</SelectItem>
                                  <SelectItem value="custom">Пользовательская</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("branding.colorScheme") === "custom" && (
                          <div className="space-y-4 bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium">Пользовательские цвета</h4>
                            
                            <FormField
                              control={form.control}
                              name="branding.customColors.primaryColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Основной цвет</FormLabel>
                                  <div className="flex space-x-2">
                                    <FormControl>
                                      <Input placeholder="#ff6600" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <div 
                                      className="w-10 h-10 rounded border" 
                                      style={{ backgroundColor: field.value || "#ff6600" }} 
                                    />
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="branding.customColors.textColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Цвет текста</FormLabel>
                                  <div className="flex space-x-2">
                                    <FormControl>
                                      <Input placeholder="#333333" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <div 
                                      className="w-10 h-10 rounded border" 
                                      style={{ backgroundColor: field.value || "#333333" }} 
                                    />
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        <FormField
                          control={form.control}
                          name="branding.footer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Текст в футере</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Конфиденциальная информация" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setActiveTab("manage");
                      }}
                    >
                      Отмена
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isEditing ? "Сохранить изменения" : "Создать шаблон"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Таб предпросмотра шаблона */}
        <TabsContent value="preview">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>Предпросмотр шаблона: {selectedTemplate.name}</CardTitle>
                <CardDescription>
                  Тип: {getTypeName(selectedTemplate.type)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4"
                    style={
                      selectedTemplate.branding.colorScheme === 'custom' && selectedTemplate.branding.customColors?.primaryColor
                        ? { backgroundColor: selectedTemplate.branding.customColors.primaryColor }
                        : selectedTemplate.branding.colorScheme === 'dark'
                          ? { backgroundColor: '#333333', color: 'white' }
                          : selectedTemplate.branding.colorScheme === 'light'
                            ? { backgroundColor: '#f0f0f0' }
                            : { backgroundColor: '#ff6600', color: 'white' }
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {selectedTemplate.branding.logo && (
                          <img 
                            src={selectedTemplate.branding.logo} 
                            alt="Логотип" 
                            className="h-10 mr-3" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h3 className="font-bold">{selectedTemplate.branding.companyName}</h3>
                          {selectedTemplate.branding.contactInfo && (
                            <p className="text-sm">{selectedTemplate.branding.contactInfo}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        {new Date().toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Пример отчета: {getTypeName(selectedTemplate.type)}</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <p className="text-sm">
                        Это предварительный просмотр отчета с применением данного шаблона брендирования.
                        Реальный отчет будет содержать фактические данные и графики.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Содержание отчета</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Раздел 1: Основные показатели</li>
                        <li>Раздел 2: Детализация по категориям</li>
                        <li>Раздел 3: Графики и диаграммы</li>
                        <li>Раздел 4: Выводы и рекомендации</li>
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium mb-1">Статистика 1</h4>
                        <p className="text-2xl font-bold">1,234,567 ₽</p>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium mb-1">Статистика 2</h4>
                        <p className="text-2xl font-bold">89%</p>
                      </div>
                    </div>
                    
                    <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <BarChart3 className="h-12 w-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">Графики и диаграммы</span>
                    </div>
                    
                    <table className="w-full border-collapse mb-4">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border p-2 text-left">Колонка 1</th>
                          <th className="border p-2 text-left">Колонка 2</th>
                          <th className="border p-2 text-right">Колонка 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">Значение 1</td>
                          <td className="border p-2">Значение 2</td>
                          <td className="border p-2 text-right">123,456 ₽</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Значение 4</td>
                          <td className="border p-2">Значение 5</td>
                          <td className="border p-2 text-right">78,901 ₽</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {selectedTemplate.branding.footer && (
                    <div className="border-t p-3 text-sm text-gray-500 text-center">
                      {selectedTemplate.branding.footer}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("manage")}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Вернуться к списку
                </Button>
                <Button onClick={() => handleEditTemplate(selectedTemplate)}>
                  <Paintbrush className="h-4 w-4 mr-2" /> Редактировать шаблон
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Выберите шаблон для предпросмотра на вкладке "Шаблоны"
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("manage")}
                >
                  Перейти к шаблонам
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Диалог подтверждения удаления */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление шаблона</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить шаблон "{selectedTemplate?.name}"?
              Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTemplate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BrandingEditor;
