
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, FileText, FileImage, FileBadge, Download, Loader2 } from "lucide-react";
import { ExportService, ExportOptions } from "@/services/export-service";

interface ExportDialogProps {
  data: any[];
  reportTitle: string;
  elementId?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  data,
  reportTitle,
  elementId,
  children,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("format");
  const [options, setOptions] = useState<ExportOptions>({
    format: "pdf",
    fileName: `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`,
    includeTimestamp: true,
    orientation: "portrait",
    paperSize: "a4",
    branding: {
      companyName: "ПрокатПро",
      contactInfo: "тел: +7 (123) 456-78-90, email: info@prokatpro.ru",
      colorScheme: "default"
    },
    metadata: {
      title: reportTitle,
      author: "ПрокатПро",
      subject: "Отчет",
      keywords: "прокат, инструменты, отчет"
    }
  });

  const handleOptionChange = (key: string, value: any) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      
      if (key.includes('.')) {
        // Обработка вложенных объектов (например, branding.companyName)
        const [parentKey, childKey] = key.split('.');
        newOptions[parentKey as keyof ExportOptions] = {
          ...newOptions[parentKey as keyof ExportOptions],
          [childKey]: value
        };
      } else {
        // Обработка простых полей
        newOptions[key as keyof ExportOptions] = value;
      }
      
      return newOptions;
    });
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Если указан ID элемента и формат PDF, используем экспорт HTML-элемента
      if (elementId && options.format === 'pdf') {
        await ExportService.exportElementToPdf(elementId, options);
      } else {
        // Иначе экспортируем данные
        await ExportService.exportData(data, options);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      if (onError) onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Экспорт отчета</DialogTitle>
          <DialogDescription>
            Настройте параметры экспорта отчета в различные форматы
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="format" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" /> Формат
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <FileImage className="h-4 w-4 mr-2" /> Внешний вид
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center">
              <FileBadge className="h-4 w-4 mr-2" /> Брендинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Формат файла</Label>
                <Select 
                  value={options.format} 
                  onValueChange={(value) => handleOptionChange('format', value)}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Выберите формат" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Ориентация</Label>
                <Select 
                  value={options.orientation} 
                  onValueChange={(value) => handleOptionChange('orientation', value)}
                  disabled={options.format !== 'pdf'}
                >
                  <SelectTrigger id="orientation">
                    <SelectValue placeholder="Выберите ориентацию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Портретная</SelectItem>
                    <SelectItem value="landscape">Альбомная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">Имя файла</Label>
              <Input 
                id="fileName" 
                placeholder="Имя файла (без расширения)" 
                value={options.fileName || ''} 
                onChange={(e) => handleOptionChange('fileName', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="timestamp" 
                checked={options.includeTimestamp} 
                onCheckedChange={(checked) => handleOptionChange('includeTimestamp', checked)}
              />
              <Label htmlFor="timestamp">Добавить временную метку</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paperSize">Размер бумаги</Label>
              <Select 
                value={options.paperSize} 
                onValueChange={(value) => handleOptionChange('paperSize', value)}
                disabled={options.format !== 'pdf'}
              >
                <SelectTrigger id="paperSize">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metadata.title">Заголовок документа</Label>
              <Input 
                id="metadata.title" 
                placeholder="Заголовок" 
                value={options.metadata?.title || ''} 
                onChange={(e) => handleOptionChange('metadata.title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata.subject">Тема документа</Label>
              <Input 
                id="metadata.subject" 
                placeholder="Тема" 
                value={options.metadata?.subject || ''} 
                onChange={(e) => handleOptionChange('metadata.subject', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata.author">Автор</Label>
              <Input 
                id="metadata.author" 
                placeholder="Автор" 
                value={options.metadata?.author || ''} 
                onChange={(e) => handleOptionChange('metadata.author', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata.keywords">Ключевые слова</Label>
              <Input 
                id="metadata.keywords" 
                placeholder="Ключевые слова" 
                value={options.metadata?.keywords || ''} 
                onChange={(e) => handleOptionChange('metadata.keywords', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branding.companyName">Название компании</Label>
              <Input 
                id="branding.companyName" 
                placeholder="Название компании" 
                value={options.branding?.companyName || ''} 
                onChange={(e) => handleOptionChange('branding.companyName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branding.contactInfo">Контактная информация</Label>
              <Input 
                id="branding.contactInfo" 
                placeholder="Контактная информация" 
                value={options.branding?.contactInfo || ''} 
                onChange={(e) => handleOptionChange('branding.contactInfo', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branding.colorScheme">Цветовая схема</Label>
              <Select 
                value={options.branding?.colorScheme || 'default'} 
                onValueChange={(value) => handleOptionChange('branding.colorScheme', value)}
              >
                <SelectTrigger id="branding.colorScheme">
                  <SelectValue placeholder="Выберите схему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Стандартная (оранжевая)</SelectItem>
                  <SelectItem value="dark">Тёмная</SelectItem>
                  <SelectItem value="light">Светлая</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Логотип (URL)</Label>
              <Input 
                id="logo" 
                placeholder="URL логотипа" 
                value={options.branding?.logo || ''} 
                onChange={(e) => handleOptionChange('branding.logo', e.target.value)}
                disabled={options.format !== 'pdf'}
              />
              <p className="text-xs text-gray-500">
                Работает только для формата PDF. Рекомендуемый размер: 300x100px.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Экспорт...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Экспортировать
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
