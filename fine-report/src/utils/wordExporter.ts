
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { ProfitLossData, BalanceSheetData } from './reportGenerator';

// Helper function to save docx document
const saveDocumentToFile = (doc: Document, fileName: string) => {
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
};

// Format currency values
const formatCurrency = (value: number): string => {
  return value.toFixed(2);
};

export const exportProfitLossToWord = (profitLoss: ProfitLossData): void => {
  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Profit and Loss Statement',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'For the period ending 31 December 2023',
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        }),
        
        // Income section heading
        new Paragraph({
          text: 'Income',
          heading: HeadingLevel.HEADING_2,
        }),
        
        // Income table
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
          },
          rows: [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 70,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    text: 'Particulars',
                    children: [new TextRun({ text: 'Particulars', bold: true })]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    text: 'Amount', 
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: 'Amount', bold: true })]
                  })],
                }),
              ],
            }),
            // Income rows
            ...profitLoss.incomes.map(income => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(income.name)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: formatCurrency(income.amount),
                      alignment: AlignmentType.RIGHT,
                    })],
                  }),
                ],
              })
            ),
            // Total income row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Total Income', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ 
                        text: formatCurrency(profitLoss.incomes.reduce((sum, income) => sum + income.amount, 0)),
                        bold: true 
                      })
                    ],
                  })],
                }),
              ],
            }),
          ],
        }),
        
        // Expense section heading
        new Paragraph({
          text: 'Expenses',
          heading: HeadingLevel.HEADING_2,
        }),
        
        // Expense table
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
          },
          rows: [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 70,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Particulars', bold: true })]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: 'Amount', bold: true })]
                  })],
                }),
              ],
            }),
            // Expense rows
            ...profitLoss.expenses.map(expense => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(expense.name)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: formatCurrency(expense.amount),
                      alignment: AlignmentType.RIGHT,
                    })],
                  }),
                ],
              })
            ),
            // Total expenses row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Total Expenses', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ 
                        text: formatCurrency(profitLoss.expenses.reduce((sum, expense) => sum + expense.amount, 0)),
                        bold: true 
                      })
                    ],
                  })],
                }),
              ],
            }),
          ],
        }),
        
        // Net profit/loss
        new Paragraph({
          spacing: {
            before: 400,
          },
          children: [
            new TextRun({ 
              text: `Net ${profitLoss.netProfit >= 0 ? 'Profit' : 'Loss'}: ${formatCurrency(Math.abs(profitLoss.netProfit))}`,
              bold: true
            })
          ],
        }),
      ],
    }],
  });

  // Save the document
  saveDocumentToFile(doc, 'profit_loss_statement.docx');
};

export const exportBalanceSheetToWord = (balanceSheet: BalanceSheetData): void => {
  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Balance Sheet',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'As at 31 December 2023',
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        }),
        
        // Assets section heading
        new Paragraph({
          text: 'Assets',
          heading: HeadingLevel.HEADING_2,
        }),
        
        // Assets table
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
          },
          rows: [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 70,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Particulars', bold: true })]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: 'Amount', bold: true })]
                  })],
                }),
              ],
            }),
            // Assets rows
            ...balanceSheet.assets.map(asset => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(asset.name)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: formatCurrency(asset.amount),
                      alignment: AlignmentType.RIGHT,
                    })],
                  }),
                ],
              })
            ),
            // Total assets row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Total Assets', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ 
                        text: formatCurrency(balanceSheet.totalAssets),
                        bold: true 
                      })
                    ],
                  })],
                }),
              ],
            }),
          ],
        }),
        
        // Liabilities section heading
        new Paragraph({
          text: 'Liabilities & Equity',
          heading: HeadingLevel.HEADING_2,
        }),
        
        // Liabilities table
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'auto' },
          },
          rows: [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 70,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Particulars', bold: true })]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: 'Amount', bold: true })]
                  })],
                }),
              ],
            }),
            // Liabilities rows
            ...balanceSheet.liabilities.map(liability => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(liability.name)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: formatCurrency(liability.amount),
                      alignment: AlignmentType.RIGHT,
                    })],
                  }),
                ],
              })
            ),
            // Total liabilities row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Total Liabilities & Equity', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ 
                        text: formatCurrency(balanceSheet.totalLiabilities),
                        bold: true 
                      })
                    ],
                  })],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });

  // Save the document
  saveDocumentToFile(doc, 'balance_sheet.docx');
};
