
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Printer, Share2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

interface ReportTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({
  title,
  description,
  children,
  generatedAt,
  periodStart,
  periodEnd,
  onPrint = () => window.print(),
  onDownload,
  onShare,
}) => {
  // Форматирование даты для отображения
  const formatDateStr = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  // Форматирование даты и времени создания отчета
  const formatDateTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy, HH:mm", { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card className="report-container mb-6">
      <CardHeader className="flex flex-col space-y-2 pb-4 pt-6 print:pt-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold print:text-xl">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="hidden print:block print:text-right">
            <h3 className="text-sm font-semibold">ПрокатПро</h3>
            <p className="text-xs text-gray-500">Сервис проката инструментов</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3 print:text-xs">
          <span>Период: {formatDateStr(periodStart)} — {formatDateStr(periodEnd)}</span>
          <span>Создан: {formatDateTime(generatedAt)}</span>
        </div>
      </CardHeader>

      <CardContent className="print:pt-0">
        {children}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 print:hidden">
        <Button variant="outline" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Печать
        </Button>
        <div className="flex gap-2">
          {onDownload && (
            <Button variant="outline" onClick={onDownload}>
              <FileDown className="h-4 w-4 mr-2" />
              Скачать PDF
            </Button>
          )}
          {onShare && (
            <Button variant="outline" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Стили для печати */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .report-container, .report-container * {
            visibility: visible;
          }
          .report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border: none;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default ReportTemplate;
