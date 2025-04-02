
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart } from '@/components/charts';
import SampleDataGenerator from './SampleDataGenerator';

interface ProfitLossData {
  incomes: { name: string; amount: number }[];
  expenses: { name: string; amount: number }[];
  netProfit: number;
  totalIncome: number;
  totalExpenses: number;
}

interface BalanceSheetData {
  assets: { name: string; amount: number }[];
  liabilities: { name: string; amount: number }[];
  totalAssets: number;
  totalLiabilities: number;
}

const ViewReports = () => {
  const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const profitLoss = localStorage.getItem('profitLossReport');
    const balanceSheet = localStorage.getItem('balanceSheetReport');
    
    if (!profitLoss || !balanceSheet) {
      toast({
        title: "No Reports Found",
        description: "Please generate reports first.",
        variant: "destructive",
      });
      navigate('/reports');
      return;
    }
    
    try {
      setProfitLossData(JSON.parse(profitLoss));
      setBalanceSheetData(JSON.parse(balanceSheet));
    } catch (error) {
      console.error('Error parsing report data:', error);
      toast({
        title: "Error",
        description: "Error loading the reports. Please generate reports again.",
        variant: "destructive",
      });
      navigate('/reports');
    }
  }, [navigate, toast]);

  const formatChartData = (data: any[], label: string) => {
    return {
      labels: data.map(item => item.name),
      datasets: [
        {
          label: label,
          data: data.map(item => item.amount),
          backgroundColor: [
            'rgba(53, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
          ],
          borderColor: [
            'rgb(53, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (!profitLossData || !balanceSheetData) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Financial Report Visualizations</h1>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow mb-8">
            <CardHeader>
              <CardTitle>No Reports Found</CardTitle>
              <CardDescription>
                You need to upload and process financial data before viewing reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">Would you like to generate sample data to test the application?</p>
              <SampleDataGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Financial Report Visualizations</h1>
      
      <Tabs defaultValue="profit-loss">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profit-loss">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
                <CardDescription>Distribution of income sources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={formatChartData(profitLossData.incomes, 'Income')} />
              </CardContent>
            </Card>
            
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={formatChartData(profitLossData.expenses, 'Expenses')} />
              </CardContent>
            </Card>
            
            <Card className="shadow md:col-span-2">
              <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
                <CardDescription>Five highest expenses by amount</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={formatChartData(
                    [...profitLossData.expenses]
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 5),
                    'Amount'
                  )} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="balance-sheet">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Assets Breakdown</CardTitle>
                <CardDescription>Distribution of assets</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={formatChartData(balanceSheetData.assets, 'Assets')} />
              </CardContent>
            </Card>
            
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Liabilities & Equity</CardTitle>
                <CardDescription>Distribution of liabilities and equity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={formatChartData(balanceSheetData.liabilities, 'Liabilities')} />
              </CardContent>
            </Card>
            
            <Card className="shadow md:col-span-2">
              <CardHeader>
                <CardTitle>Asset Composition</CardTitle>
                <CardDescription>Major assets by value</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={formatChartData(
                    [...balanceSheetData.assets]
                      .sort((a, b) => b.amount - a.amount),
                    'Amount'
                  )} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8 shadow">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Key financial numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold">{profitLossData.totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">{profitLossData.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
              <p className={`text-2xl font-bold ${profitLossData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLossData.netProfit >= 0 ? '+' : ''}{profitLossData.netProfit.toFixed(2)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className={`text-2xl font-bold ${profitLossData.netProfit / profitLossData.totalIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLossData.totalIncome ? ((profitLossData.netProfit / profitLossData.totalIncome) * 100).toFixed(2) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewReports;
