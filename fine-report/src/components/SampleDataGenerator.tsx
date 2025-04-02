
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SampleDataGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const { toast } = useToast();

  const generateSampleData = () => {
    setGenerating(true);
    try {
      // Create sample financial data entries with approximately 100 entries
      const sampleData = [
        // Headers row
        ['Particulars', 'Debit', 'Credit'],
        // Assets
        ['Cash in Hand', '15000', ''],
        ['Cash at Bank', '85000', ''],
        ['Sundry Debtors', '124000', ''],
        ['Inventory', '230000', ''],
        ['Equipment', '175000', ''],
        ['Furniture and Fixtures', '52000', ''],
        ['Computer and IT Equipment', '38500', ''],
        ['Prepaid Rent', '24000', ''],
        ['Prepaid Insurance', '12000', ''],
        ['Investments', '150000', ''],
        ['Land', '350000', ''],
        ['Buildings', '650000', ''],
        ['Vehicles', '95000', ''],
        ['Office Supplies', '8500', ''],
        // Liabilities
        ['Accounts Payable', '', '95000'],
        ['Bank Loan', '', '250000'],
        ['Bank Overdraft', '', '15000'],
        ['Credit Card Payable', '', '7500'],
        ['Sundry Creditors', '', '82000'],
        ['Notes Payable', '', '45000'],
        ['Interest Payable', '', '12000'],
        ['Salary Payable', '', '32000'],
        ['Taxes Payable', '', '28500'],
        ['Unearned Revenue', '', '18000'],
        ['Mortgage Payable', '', '350000'],
        // Equity
        ['Capital', '', '500000'],
        ['Retained Earnings', '', '247000'],
        ["Owner's Drawing", '35000', ''],
        // Income
        ['Sales Revenue', '', '785000'],
        ['Service Revenue', '', '245000'],
        ['Interest Income', '', '12500'],
        ['Rental Income', '', '36000'],
        ['Commission Income', '', '28000'],
        ['Discount Received', '', '7500'],
        ['Miscellaneous Income', '', '15000'],
        ['Royalty Income', '', '22000'],
        // Expenses
        ['Purchases', '450000', ''],
        ['Salaries Expense', '245000', ''],
        ['Rent Expense', '60000', ''],
        ['Utilities Expense', '35000', ''],
        ['Insurance Expense', '28000', ''],
        ['Depreciation Expense', '45000', ''],
        ['Advertising Expense', '32000', ''],
        ['Office Supplies Expense', '18500', ''],
        ['Telephone Expense', '12000', ''],
        ['Internet Expense', '9600', ''],
        ['Repair and Maintenance', '24000', ''],
        ['Fuel Expense', '18000', ''],
        ['Legal Fees', '15000', ''],
        ['Accounting Fees', '12000', ''],
        ['Bank Charges', '7500', ''],
        ['Interest Expense', '22000', ''],
        ['Bad Debts', '14000', ''],
        ['Staff Training', '9500', ''],
        ['Travel Expense', '21000', ''],
        ['Entertainment Expense', '13500', ''],
        ['Printing and Stationery', '8500', ''],
        ['Postage and Courier', '4500', ''],
        ['Cleaning Expense', '12000', ''],
        ['Security Expense', '18000', ''],
        ['Website Maintenance', '7200', ''],
        ['Software Subscriptions', '15000', ''],
        ['Professional Development', '13000', ''],
        ['Donations', '8000', ''],
        ['Membership Fees', '5500', ''],
        ['Licenses and Permits', '9000', ''],
        ['Property Taxes', '24000', ''],
        ['Income Taxes', '45000', ''],
        ['Medical Insurance', '32000', ''],
        ['Retirement Contributions', '25000', ''],
        ['Employee Benefits', '28000', ''],
        ['Commission Expense', '35000', ''],
        ['Freight Expense', '22000', ''],
        ['Miscellaneous Expense', '11500', ''],
        ['Consulting Fees', '28000', ''],
        ['Equipment Rental', '16500', ''],
        ['Marketing Expense', '29000', ''],
        ['Research and Development', '45000', ''],
        ['Uniforms', '7500', ''],
        ['Waste Disposal', '6800', ''],
        ['Water Expense', '5200', ''],
        ['Contract Labor', '32000', ''],
        ['Warranty Expense', '12000', ''],
        ['Stock (01.01.2023)', '185000', ''],
        ['Carriage Inwards', '25000', ''],
        ['Carriage Outwards', '18000', ''],
        ['Trade Expenses', '24000', ''],
        ['Wages', '195000', ''],
        ['Heating and Lighting', '22000', '']
      ];

      // Create a workbook
      const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Trial Balance');

      let fileName = '';

      if (format === 'xlsx') {
        // Generate Excel file
        fileName = 'sample_trial_balance.xlsx';
        XLSX.writeFile(workbook, fileName);
      } else {
        // Generate CSV file
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        fileName = 'sample_trial_balance.csv';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Sample Data Generated",
        description: `A sample trial balance ${format.toUpperCase()} file has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          Sample Data Generator
        </CardTitle>
        <CardDescription>
          Generate a sample file with approximately 100 financial data entries that match the expected format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will create a sample trial balance with assets, liabilities, equity, income, and expense accounts.
          The generated file will be immediately downloaded to your device.
        </p>
        
        <Tabs defaultValue="xlsx" onValueChange={(value) => setFormat(value as 'xlsx' | 'csv')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="xlsx">Excel (.xlsx)</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>
          <TabsContent value="xlsx">
            <p className="text-sm text-muted-foreground">
              Generate an Excel file that can be imported into the application. This format preserves all data types.
            </p>
          </TabsContent>
          <TabsContent value="csv">
            <p className="text-sm text-muted-foreground">
              Generate a CSV file that can be imported into the application. This is a plain text format compatible with most spreadsheet applications.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateSampleData} 
          disabled={generating}
          className="ml-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          {generating ? "Generating..." : "Generate Sample Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SampleDataGenerator;
