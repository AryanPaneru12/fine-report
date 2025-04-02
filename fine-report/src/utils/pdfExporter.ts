
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProfitLossData, BalanceSheetData } from './reportGenerator';

export const exportProfitLossToPdf = (profitLoss: ProfitLossData): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Profit and Loss Statement', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('For the period ending 31 December 2023', 105, 22, { align: 'center' });
  
  // Add incomes
  doc.setFontSize(14);
  doc.text('Income', 14, 35);
  
  const incomeRows = profitLoss.incomes.map(income => [income.name, '', income.amount.toFixed(2)]);
  const totalIncome = profitLoss.incomes.reduce((sum, income) => sum + income.amount, 0);
  incomeRows.push(['Total Income', '', totalIncome.toFixed(2)]);
  
  (doc as any).autoTable({
    startY: 38,
    head: [['Particulars', '', 'Amount']],
    body: incomeRows,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    foot: [['', '', '']],
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40, halign: 'right' }
    }
  });
  
  // Add expenses
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Expenses', 14, currentY);
  
  const expenseRows = profitLoss.expenses.map(expense => [expense.name, '', expense.amount.toFixed(2)]);
  const totalExpenses = profitLoss.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  expenseRows.push(['Total Expenses', '', totalExpenses.toFixed(2)]);
  
  (doc as any).autoTable({
    startY: currentY + 3,
    body: expenseRows,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40, halign: 'right' }
    }
  });
  
  // Add net profit/loss
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  if (profitLoss.netProfit >= 0) {
    doc.text(`Net Profit: ${profitLoss.netProfit.toFixed(2)}`, 14, finalY);
  } else {
    doc.text(`Net Loss: ${Math.abs(profitLoss.netProfit).toFixed(2)}`, 14, finalY);
  }
  
  doc.save('profit_loss_statement.pdf');
};

export const exportBalanceSheetToPdf = (balanceSheet: BalanceSheetData): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Balance Sheet', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('As at 31 December 2023', 105, 22, { align: 'center' });
  
  // Add assets
  doc.setFontSize(14);
  doc.text('Assets', 14, 35);
  
  const assetRows = balanceSheet.assets.map(asset => [asset.name, '', asset.amount.toFixed(2)]);
  assetRows.push(['Total Assets', '', balanceSheet.totalAssets.toFixed(2)]);
  
  (doc as any).autoTable({
    startY: 38,
    head: [['Particulars', '', 'Amount']],
    body: assetRows,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40, halign: 'right' }
    }
  });
  
  // Add liabilities
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Liabilities & Equity', 14, currentY);
  
  const liabilityRows = balanceSheet.liabilities.map(liability => [liability.name, '', liability.amount.toFixed(2)]);
  liabilityRows.push(['Total Liabilities & Equity', '', balanceSheet.totalLiabilities.toFixed(2)]);
  
  (doc as any).autoTable({
    startY: currentY + 3,
    body: liabilityRows,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40, halign: 'right' }
    }
  });
  
  doc.save('balance_sheet.pdf');
};
