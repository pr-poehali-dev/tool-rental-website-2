
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'pdf' | 'xlsx' | 'csv';
  fileName?: string;
  branding?: {
    logo?: string;
    companyName?: string;
    contactInfo?: string;
    colorScheme?: 'default' | 'dark' | 'light';
  };
  includeTimestamp?: boolean;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'a4' | 'letter' | 'legal';
  metadata?: {
    title?: string;
    subject?: string;
    author?: string;
    keywords?: string;
  };
}

class ExportServiceClass {
  /**
   * Экспортирует данные в выбранный формат
   */
  async exportData(data: any[], options: ExportOptions): Promise<void> {
    switch (options.format) {
      case 'pdf':
        return this.exportToPdf(data, options);
      case 'xlsx':
        return this.exportToExcel(data, options);
      case 'csv':
        return this.exportToCsv(data, options);
      default:
        throw new Error(`Неподдерживаемый формат экспорта: ${options.format}`);
    }
  }

  /**
   * Экспортирует HTML-элемент в PDF
   */
  async exportElementToPdf(elementId: string, options: ExportOptions): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Элемент с ID "${elementId}" не найден`);
    }

    // Преобразуем HTML-элемент в canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Лучшее качество
      useCORS: true, // Для загрузки изображений с других доменов
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Создаем PDF с нужной ориентацией и размером
    const orientation = options.orientation || 'portrait';
    const format = options.paperSize || 'a4';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Устанавливаем метаданные
    if (options.metadata) {
      if (options.metadata.title) pdf.setProperties({ title: options.metadata.title });
      if (options.metadata.subject) pdf.setProperties({ subject: options.metadata.subject });
      if (options.metadata.author) pdf.setProperties({ author: options.metadata.author });
      if (options.metadata.keywords) pdf.setProperties({ keywords: options.metadata.keywords });
    }

    // Определяем размеры страницы
    const pageWidth = orientation === 'portrait' ? 210 : 297;
    const pageHeight = orientation === 'portrait' ? 297 : 210;
    
    // Добавляем брендирование
    this.addBrandingToPdf(pdf, options.branding, pageWidth);

    // Добавляем изображение из canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Рассчитываем размеры для сохранения пропорций
    const imgWidth = pageWidth - 20; // отступы по 10 мм с каждой стороны
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Если изображение не помещается на одной странице, разбиваем на несколько
    let heightLeft = imgHeight;
    let position = 40; // начальная позиция (с учетом брендирования в шапке)
    
    // Добавляем первую часть изображения
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - position);
    
    // Добавляем остальные части на новых страницах, если нужно
    while (heightLeft > 0) {
      position = 10; // верхний отступ для продолжения на новой странице
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position - imgHeight + heightLeft, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
    }

    // Добавляем временную метку, если включено
    if (options.includeTimestamp) {
      const timestamp = new Date().toLocaleString('ru-RU');
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`Создан: ${timestamp}`, pageWidth - 60, pageHeight - 10);
    }

    // Сохраняем PDF
    const fileName = options.fileName || `export_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Добавляет брендирование в PDF-документ
   */
  private addBrandingToPdf(pdf: any, branding?: ExportOptions['branding'], pageWidth: number = 210): void {
    if (!branding) return;

    // Устанавливаем цветовую схему
    let primaryColor = '#ff6600'; // оранжевый по умолчанию
    let textColor = '#333333';
    
    if (branding.colorScheme === 'dark') {
      primaryColor = '#333333';
      textColor = '#ffffff';
    } else if (branding.colorScheme === 'light') {
      primaryColor = '#f0f0f0';
      textColor = '#333333';
    }

    // Добавляем цветную полосу в шапке
    pdf.setFillColor(primaryColor);
    pdf.rect(0, 0, pageWidth, 20, 'F');

    // Добавляем логотип, если есть
    if (branding.logo) {
      try {
        pdf.addImage(branding.logo, 'PNG', 10, 5, 10, 10);
      } catch (e) {
        console.error('Ошибка при добавлении логотипа:', e);
      }
    }

    // Добавляем название компании
    if (branding.companyName) {
      pdf.setTextColor(branding.colorScheme === 'dark' ? 255 : textColor);
      pdf.setFontSize(14);
      pdf.text(branding.companyName, branding.logo ? 25 : 10, 12);
    }

    // Добавляем контактную информацию
    if (branding.contactInfo) {
      pdf.setFontSize(8);
      pdf.setTextColor(branding.colorScheme === 'dark' ? 200 : textColor);
      pdf.text(branding.contactInfo, pageWidth - 60, 10);
    }

    // Сбрасываем текстовый цвет обратно для основного содержимого
    pdf.setTextColor(0);
  }

  /**
   * Экспортирует данные в PDF с использованием таблицы
   */
  private async exportToPdf(data: any[], options: ExportOptions): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error('Нет данных для экспорта');
    }

    // Получаем заголовки из первого объекта
    const firstItem = data[0];
    const headers = Object.keys(firstItem).filter(key => typeof firstItem[key] !== 'function');
    
    // Форматируем данные для таблицы
    const tableData = data.map(item => 
      headers.map(header => {
        const value = item[header];
        // Форматируем значения для отображения
        if (value instanceof Date) {
          return value.toLocaleDateString('ru-RU');
        }
        return value !== null && value !== undefined ? String(value) : '';
      })
    );

    // Форматируем заголовки для отображения (делаем первую букву заглавной)
    const formattedHeaders = headers.map(header => 
      header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')
    );

    // Создаем PDF с нужной ориентацией и размером
    const orientation = options.orientation || 'portrait';
    const format = options.paperSize || 'a4';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Устанавливаем метаданные
    if (options.metadata) {
      if (options.metadata.title) pdf.setProperties({ title: options.metadata.title });
      if (options.metadata.subject) pdf.setProperties({ subject: options.metadata.subject });
      if (options.metadata.author) pdf.setProperties({ author: options.metadata.author });
      if (options.metadata.keywords) pdf.setProperties({ keywords: options.metadata.keywords });
    }

    // Определяем размеры страницы
    const pageWidth = orientation === 'portrait' ? 210 : 297;
    
    // Добавляем брендирование
    this.addBrandingToPdf(pdf, options.branding, pageWidth);

    // Добавляем таблицу
    (pdf as any).autoTable({
      head: [formattedHeaders],
      body: tableData,
      startY: 30, // После брендирования
      theme: 'grid',
      headStyles: {
        fillColor: [255, 102, 0], // Оранжевый цвет
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 }
    });

    // Добавляем временную метку, если включено
    if (options.includeTimestamp) {
      const timestamp = new Date().toLocaleString('ru-RU');
      const pageHeight = orientation === 'portrait' ? 297 : 210;
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`Создан: ${timestamp}`, pageWidth - 60, pageHeight - 10);
    }

    // Сохраняем PDF
    const fileName = options.fileName || `export_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Экспортирует данные в Excel (XLSX)
   */
  private async exportToExcel(data: any[], options: ExportOptions): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error('Нет данных для экспорта');
    }

    // Создаем рабочую книгу Excel
    const wb = XLSX.utils.book_new();
    
    // Добавляем информацию о компании, если есть
    if (options.branding?.companyName) {
      wb.Props = {
        ...wb.Props,
        Title: options.metadata?.title || 'Экспорт данных',
        Subject: options.metadata?.subject || 'Отчет',
        Author: options.branding.companyName,
        CreatedDate: new Date()
      };
    }

    // Преобразуем данные в формат Excel
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Применяем стили к заголовкам (XLSX не поддерживает полное форматирование)
    
    // Добавляем лист к книге
    XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
    
    // Сохраняем файл
    const fileName = options.fileName || `export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  /**
   * Экспортирует данные в CSV
   */
  private async exportToCsv(data: any[], options: ExportOptions): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error('Нет данных для экспорта');
    }

    // Получаем заголовки
    const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'function');
    
    // Преобразуем данные в формат CSV
    let csvContent = headers.join(',') + '\r\n';
    
    for (const item of data) {
      const row = headers.map(header => {
        const value = item[header];
        
        // Обрабатываем специальные символы и экранируем кавычки
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string') {
          // Экранируем кавычки и добавляем кавычки, если есть запятые или переносы строк
          const escaped = value.replace(/"/g, '""');
          return /[,\r\n"]/.test(escaped) ? `"${escaped}"` : escaped;
        } else if (value instanceof Date) {
          return value.toLocaleDateString('ru-RU');
        } else {
          return String(value);
        }
      }).join(',');
      
      csvContent += row + '\r\n';
    }
    
    // Создаем Blob и сохраняем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = options.fileName || `export_${new Date().toISOString().slice(0, 10)}.csv`;
    saveAs(blob, fileName);
  }
}

export const ExportService = new ExportServiceClass();
