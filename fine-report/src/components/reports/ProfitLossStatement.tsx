
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { ProfitLossData } from '@/utils/reportGenerator';
import { exportProfitLossToPdf } from '@/utils/pdfExporter';

interface ProfitLossStatementProps {
  data: ProfitLossData;
}

const ProfitLossStatement = ({ data }: ProfitLossStatementProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          Profit & Loss Statement
        </CardTitle>
        <CardDescription>
          Financial performance for the period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Income</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Particulars</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.incomes.map((income, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{income.name}</td>
                      <td className="text-right p-2">{income.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="p-2">Total Income</td>
                    <td className="text-right p-2">
                      {data.totalIncome.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Particulars</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.map((expense, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{expense.name}</td>
                      <td className="text-right p-2">{expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="p-2">Total Expenses</td>
                    <td className="text-right p-2">
                      {data.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Net {data.netProfit >= 0 ? 'Profit' : 'Loss'}</span>
              <span>{Math.abs(data.netProfit).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => exportProfitLossToPdf(data)}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfitLossStatement;
