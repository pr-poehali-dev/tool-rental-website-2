
import { toast } from "@/components/ui/use-toast";

// Типы данных для шаблонов брендирования
export interface BrandingTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  type: 'financial' | 'equipment' | 'efficiency' | 'forecast' | 'general';
  branding: BrandingOptions;
}

export interface BrandingOptions {
  logo: string;
  companyName: string;
  contactInfo: string;
  colorScheme: 'default' | 'dark' | 'light' | 'custom';
  customColors?: {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    accentColor: string;
  };
  fonts?: {
    titleFont: string;
    bodyFont: string;
  };
  footer?: string;
  header?: string;
  watermark?: string;
}

class BrandingServiceClass {
  private templates: BrandingTemplate[] = [];
  private storageKey = 'branding_templates';

  constructor() {
    this.loadTemplates();
    
    // Если нет шаблонов, создаем стандартные
    if (this.templates.length === 0) {
      this.initDefaultTemplates();
    }
  }

  // Инициализация стандартных шаблонов
  private initDefaultTemplates() {
    const defaultTemplates: BrandingTemplate[] = [
      {
        id: 'default-general',
        name: 'Стандартный',
        description: 'Стандартный шаблон для всех типов отчетов',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
        type: 'general',
        branding: {
          logo: '/logo-b.svg',
          companyName: 'ПрокатПро',
          contactInfo: 'тел: +7 (123) 456-78-90, email: info@prokatpro.ru',
          colorScheme: 'default'
        }
      },
      {
        id: 'financial-template',
        name: 'Финансовый',
        description: 'Шаблон для финансовых отчетов',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
        type: 'financial',
        branding: {
          logo: '/logo-b.svg',
          companyName: 'ПрокатПро - Финансовый отдел',
          contactInfo: 'тел: +7 (123) 456-78-90, email: finance@prokatpro.ru',
          colorScheme: 'default',
          footer: 'Конфиденциальная финансовая информация'
        }
      },
      {
        id: 'forecast-template',
        name: 'Прогнозирование',
        description: 'Шаблон для отчетов прогнозирования',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
        type: 'forecast',
        branding: {
          logo: '/logo-b.svg',
          companyName: 'ПрокатПро - Аналитический отдел',
          contactInfo: 'тел: +7 (123) 456-78-90, email: analytics@prokatpro.ru',
          colorScheme: 'light',
          footer: 'Данные прогноза носят рекомендательный характер'
        }
      }
    ];

    this.templates = defaultTemplates;
    this.saveTemplates();
  }

  // Загрузка шаблонов из localStorage
  private loadTemplates() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.templates = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Ошибка при загрузке шаблонов:', error);
      this.templates = [];
    }
  }

  // Сохранение шаблонов в localStorage
  private saveTemplates() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
    } catch (error) {
      console.error('Ошибка при сохранении шаблонов:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить шаблоны брендирования",
        variant: "destructive",
      });
    }
  }

  // Получение всех шаблонов
  getAllTemplates(): BrandingTemplate[] {
    return [...this.templates];
  }

  // Получение шаблонов по типу
  getTemplatesByType(type: BrandingTemplate['type'] | 'all'): BrandingTemplate[] {
    if (type === 'all') {
      return this.getAllTemplates();
    }
    return this.templates.filter(template => template.type === type || template.type === 'general');
  }

  // Получение шаблона по ID
  getTemplateById(id: string): BrandingTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  // Получение шаблона по умолчанию
  getDefaultTemplate(type: BrandingTemplate['type'] = 'general'): BrandingTemplate {
    // Ищем сначала шаблон по умолчанию для конкретного типа
    const typeDefault = this.templates.find(t => t.isDefault && t.type === type);
    if (typeDefault) {
      return typeDefault;
    }
    
    // Если не нашли, возвращаем общий шаблон по умолчанию
    const generalDefault = this.templates.find(t => t.isDefault && t.type === 'general');
    if (generalDefault) {
      return generalDefault;
    }
    
    // Если вообще нет шаблонов по умолчанию, возвращаем первый шаблон или создаем новый
    return this.templates[0] || {
      id: 'default-fallback',
      name: 'Стандартный',
      description: 'Автоматически созданный стандартный шаблон',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true,
      type: 'general',
      branding: {
        logo: '/logo-b.svg',
        companyName: 'ПрокатПро',
        contactInfo: 'тел: +7 (123) 456-78-90',
        colorScheme: 'default'
      }
    };
  }

  // Добавление нового шаблона
  addTemplate(template: Omit<BrandingTemplate, 'id' | 'createdAt' | 'updatedAt'>): BrandingTemplate {
    const newTemplate: BrandingTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Если добавляется шаблон по умолчанию, сбрасываем флаг у других шаблонов того же типа
    if (newTemplate.isDefault) {
      this.templates = this.templates.map(t => 
        (t.type === newTemplate.type && t.isDefault) 
          ? { ...t, isDefault: false } 
          : t
      );
    }

    this.templates.push(newTemplate);
    this.saveTemplates();
    
    toast({
      title: "Успешно",
      description: `Шаблон "${newTemplate.name}" создан`,
    });
    
    return newTemplate;
  }

  // Обновление существующего шаблона
  updateTemplate(id: string, updates: Partial<Omit<BrandingTemplate, 'id' | 'createdAt' | 'updatedAt'>>): BrandingTemplate | null {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      toast({
        title: "Ошибка",
        description: "Шаблон не найден",
        variant: "destructive",
      });
      return null;
    }

    const updatedTemplate = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Если обновленный шаблон становится шаблоном по умолчанию, сбрасываем флаг у других шаблонов того же типа
    if (updates.isDefault) {
      this.templates = this.templates.map(t => 
        (t.id !== id && t.type === updatedTemplate.type && t.isDefault) 
          ? { ...t, isDefault: false } 
          : t
      );
    }

    this.templates[index] = updatedTemplate;
    this.saveTemplates();
    
    toast({
      title: "Успешно",
      description: `Шаблон "${updatedTemplate.name}" обновлен`,
    });
    
    return updatedTemplate;
  }

  // Удаление шаблона
  deleteTemplate(id: string): boolean {
    const template = this.getTemplateById(id);
    if (!template) {
      toast({
        title: "Ошибка",
        description: "Шаблон не найден",
        variant: "destructive",
      });
      return false;
    }

    // Запрещаем удаление шаблона по умолчанию, если он единственный такого типа
    if (template.isDefault) {
      const sameTypeTemplates = this.templates.filter(t => t.type === template.type);
      if (sameTypeTemplates.length <= 1) {
        toast({
          title: "Ошибка",
          description: "Невозможно удалить единственный шаблон по умолчанию для данного типа отчетов",
          variant: "destructive",
        });
        return false;
      }
    }

    this.templates = this.templates.filter(t => t.id !== id);
    this.saveTemplates();
    
    toast({
      title: "Успешно",
      description: `Шаблон "${template.name}" удален`,
    });
    
    return true;
  }

  // Установка шаблона по умолчанию
  setDefaultTemplate(id: string): BrandingTemplate | null {
    const template = this.getTemplateById(id);
    if (!template) {
      toast({
        title: "Ошибка",
        description: "Шаблон не найден",
        variant: "destructive",
      });
      return null;
    }

    // Сбрасываем флаг по умолчанию у всех шаблонов того же типа
    this.templates = this.templates.map(t => 
      (t.type === template.type) 
        ? { ...t, isDefault: t.id === id } 
        : t
    );
    
    this.saveTemplates();
    
    toast({
      title: "Успешно",
      description: `Шаблон "${template.name}" установлен по умолчанию`,
    });
    
    return template;
  }

  // Дублирование шаблона
  duplicateTemplate(id: string): BrandingTemplate | null {
    const template = this.getTemplateById(id);
    if (!template) {
      toast({
        title: "Ошибка",
        description: "Шаблон не найден",
        variant: "destructive",
      });
      return null;
    }

    const duplicate: BrandingTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (копия)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.templates.push(duplicate);
    this.saveTemplates();
    
    toast({
      title: "Успешно",
      description: `Создана копия шаблона "${template.name}"`,
    });
    
    return duplicate;
  }
}

export const BrandingService = new BrandingServiceClass();
