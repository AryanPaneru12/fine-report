
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { exportProfitLossToPdf, exportBalanceSheetToPdf } from '@/utils/pdfExporter';
import { exportProfitLossToWord, exportBalanceSheetToWord } from '@/utils/wordExporter';
import { ProfitLossData, BalanceSheetData } from '@/utils/reportGenerator';

type ExportButtonsProps = {
  type: 'profitLoss' | 'balanceSheet';
  data: ProfitLossData | BalanceSheetData;
};

const ExportButtons = ({ type, data }: ExportButtonsProps) => {
  const handlePdfExport = () => {
    if (type === 'profitLoss') {
      exportProfitLossToPdf(data as ProfitLossData);
    } else {
      exportBalanceSheetToPdf(data as BalanceSheetData);
    }
  };

  const handleWordExport = () => {
    if (type === 'profitLoss') {
      exportProfitLossToWord(data as ProfitLossData);
    } else {
      exportBalanceSheetToWord(data as BalanceSheetData);
    }
  };

  return (
    <div className="flex space-x-2 mt-4">
      <Button variant="outline" size="sm" onClick={handlePdfExport}>
        <Download className="h-4 w-4 mr-2" />
        Export as PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleWordExport}>
        <FileText className="h-4 w-4 mr-2" />
        Export as Word
      </Button>
    </div>
  );
};

export default ExportButtons;
