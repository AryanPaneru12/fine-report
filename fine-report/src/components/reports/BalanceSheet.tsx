
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { BalanceSheetData } from '@/utils/reportGenerator';
import { exportBalanceSheetToPdf } from '@/utils/pdfExporter';

interface BalanceSheetProps {
  data: BalanceSheetData;
}

const BalanceSheet = ({ data }: BalanceSheetProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          Balance Sheet
        </CardTitle>
        <CardDescription>
          Financial position as of the end of period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Assets</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Particulars</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assets.map((asset, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{asset.name}</td>
                      <td className="text-right p-2">{asset.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="p-2">Total Assets</td>
                    <td className="text-right p-2">
                      {data.totalAssets.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Liabilities & Equity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Particulars</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.liabilities.map((liability, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{liability.name}</td>
                      <td className="text-right p-2">{liability.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="p-2">Total Liabilities & Equity</td>
                    <td className="text-right p-2">
                      {data.totalLiabilities.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => exportBalanceSheetToPdf(data)}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceSheet;
