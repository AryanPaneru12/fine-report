
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateReports } from '@/utils/reportGenerator';
import ProfitLossStatement from './reports/ProfitLossStatement';
import BalanceSheet from './reports/BalanceSheet';

interface FinancialEntry {
  Particulars: string;
  Debit: number | string;
  Credit: number | string;
}

const Reports = () => {
  const [trialBalanceData, setTrialBalanceData] = useState<FinancialEntry[]>([]);
  const [profitLoss, setProfitLoss] = useState<{ 
    incomes: any[], 
    expenses: any[], 
    netProfit: number,
    totalIncome: number,
    totalExpenses: number
  }>({ 
    incomes: [], 
    expenses: [], 
    netProfit: 0,
    totalIncome: 0,
    totalExpenses: 0
  });
  const [balanceSheet, setBalanceSheet] = useState<{ 
    assets: any[], 
    liabilities: any[], 
    totalAssets: number, 
    totalLiabilities: number 
  }>({ 
    assets: [], 
    liabilities: [], 
    totalAssets: 0, 
    totalLiabilities: 0 
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('financialData');
    
    if (!data) {
      toast({
        title: "No Data Found",
        description: "Please upload a trial balance file first.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      console.log('Retrieved data from localStorage:', parsedData);
      setTrialBalanceData(parsedData);
      
      // Use the utility function to generate reports
      const { profitLoss: plData, balanceSheet: bsData } = generateReports(parsedData);
      setProfitLoss(plData);
      setBalanceSheet(bsData);
    } catch (error) {
      console.error('Error parsing data:', error);
      toast({
        title: "Error",
        description: "Error processing the data. Please upload a valid file.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Financial Reports</h1>
      
      <Tabs defaultValue="profit-loss">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profit-loss">Profit & Loss Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profit-loss">
          <ProfitLossStatement data={profitLoss} />
        </TabsContent>
        
        <TabsContent value="balance-sheet">
          <BalanceSheet data={balanceSheet} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
