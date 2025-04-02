
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { BarChart } from '@/components/charts';

interface RatioData {
  sales: number;
  netProfit: number;
  totalAssets: number;
  currentAssets: number;
  currentLiabilities: number;
  totalLiabilities: number;
  equity: number;
}

const Ratios = () => {
  const [ratioData, setRatioData] = useState<RatioData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define the ratios we want to calculate
  const [ratios, setRatios] = useState({
    profitMargin: 0,
    returnOnAssets: 0,
    currentRatio: 0,
    debtToEquity: 0,
    assetTurnover: 0,
    returnOnEquity: 0,
  });

  useEffect(() => {
    const data = localStorage.getItem('ratiosData');
    
    if (!data) {
      toast({
        title: "No Data Found",
        description: "Please generate reports first.",
        variant: "destructive",
      });
      navigate('/reports');
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      setRatioData(parsedData);
      calculateRatios(parsedData);
    } catch (error) {
      console.error('Error parsing ratio data:', error);
      toast({
        title: "Error",
        description: "Error calculating financial ratios. Please generate reports again.",
        variant: "destructive",
      });
      navigate('/reports');
    }
  }, [navigate, toast]);

  const calculateRatios = (data: RatioData) => {
    // Calculate the ratios
    const profitMargin = data.sales ? (data.netProfit / data.sales) * 100 : 0;
    const returnOnAssets = data.totalAssets ? (data.netProfit / data.totalAssets) * 100 : 0;
    const currentRatio = data.currentLiabilities ? data.currentAssets / data.currentLiabilities : 0;
    const debtToEquity = data.equity ? data.totalLiabilities / data.equity : 0;
    const assetTurnover = data.totalAssets ? data.sales / data.totalAssets : 0;
    const returnOnEquity = data.equity ? (data.netProfit / data.equity) * 100 : 0;

    setRatios({
      profitMargin,
      returnOnAssets,
      currentRatio,
      debtToEquity,
      assetTurnover,
      returnOnEquity,
    });
  };

  // Function to get color based on ratio value compared to benchmarks
  const getRatioColor = (ratio: string, value: number) => {
    switch (ratio) {
      case 'profitMargin':
        return value > 15 ? 'bg-green-500' : value > 5 ? 'bg-yellow-500' : 'bg-red-500';
      case 'returnOnAssets':
        return value > 10 ? 'bg-green-500' : value > 5 ? 'bg-yellow-500' : 'bg-red-500';
      case 'currentRatio':
        return value > 2 ? 'bg-green-500' : value > 1 ? 'bg-yellow-500' : 'bg-red-500';
      case 'debtToEquity':
        return value < 1 ? 'bg-green-500' : value < 2 ? 'bg-yellow-500' : 'bg-red-500';
      case 'assetTurnover':
        return value > 1 ? 'bg-green-500' : value > 0.5 ? 'bg-yellow-500' : 'bg-red-500';
      case 'returnOnEquity':
        return value > 15 ? 'bg-green-500' : value > 8 ? 'bg-yellow-500' : 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Function to get the progress value based on ratio
  const getProgressValue = (ratio: string, value: number) => {
    switch (ratio) {
      case 'profitMargin':
        return Math.min(value * 4, 100); // Scale up to make it more visible (25% = 100%)
      case 'returnOnAssets':
        return Math.min(value * 5, 100); // Scale up (20% = 100%)
      case 'currentRatio':
        return Math.min(value * 33, 100); // Scale (3 = 100%)
      case 'debtToEquity':
        return Math.min(value * 33, 100); // Scale (3 = 100%)
      case 'assetTurnover':
        return Math.min(value * 50, 100); // Scale (2 = 100%)
      case 'returnOnEquity':
        return Math.min(value * 4, 100); // Scale (25% = 100%)
      default:
        return 0;
    }
  };
  
  // For chart visualization
  const ratioChartData = {
    labels: [
      'Profit Margin',
      'Return on Assets',
      'Current Ratio',
      'Debt to Equity',
      'Asset Turnover',
      'Return on Equity',
    ],
    datasets: [
      {
        label: 'Value',
        data: [
          ratios.profitMargin,
          ratios.returnOnAssets,
          ratios.currentRatio,
          ratios.debtToEquity,
          ratios.assetTurnover,
          ratios.returnOnEquity,
        ],
        backgroundColor: [
          'rgba(53, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgb(53, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(255, 99, 132)',
          'rgb(153, 102, 255)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!ratioData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p>Loading financial ratios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Key Financial Ratios</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Profitability Ratios</CardTitle>
            <CardDescription>Measures of business performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Profit Margin</span>
                <span className={ratios.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {ratios.profitMargin.toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={getProgressValue('profitMargin', Math.abs(ratios.profitMargin))} 
                className={getRatioColor('profitMargin', ratios.profitMargin)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Net profit as a percentage of revenue. Higher is better.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Return on Assets (ROA)</span>
                <span className={ratios.returnOnAssets >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {ratios.returnOnAssets.toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={getProgressValue('returnOnAssets', Math.abs(ratios.returnOnAssets))} 
                className={getRatioColor('returnOnAssets', ratios.returnOnAssets)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                How efficiently assets are being used to generate profits.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Return on Equity (ROE)</span>
                <span className={ratios.returnOnEquity >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {ratios.returnOnEquity.toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={getProgressValue('returnOnEquity', Math.abs(ratios.returnOnEquity))} 
                className={getRatioColor('returnOnEquity', ratios.returnOnEquity)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Measures how efficiently equity is being used to generate profits.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Liquidity & Efficiency Ratios</CardTitle>
            <CardDescription>Measures of operational efficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Current Ratio</span>
                <span>{ratios.currentRatio.toFixed(2)}</span>
              </div>
              <Progress 
                value={getProgressValue('currentRatio', ratios.currentRatio)} 
                className={getRatioColor('currentRatio', ratios.currentRatio)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ability to pay short-term obligations. Above 1 is good, above 2 is very good.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Debt to Equity Ratio</span>
                <span>{ratios.debtToEquity.toFixed(2)}</span>
              </div>
              <Progress 
                value={getProgressValue('debtToEquity', ratios.debtToEquity)} 
                className={getRatioColor('debtToEquity', ratios.debtToEquity)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Financial leverage. Lower values indicate less risk.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Asset Turnover Ratio</span>
                <span>{ratios.assetTurnover.toFixed(2)}</span>
              </div>
              <Progress 
                value={getProgressValue('assetTurnover', ratios.assetTurnover)} 
                className={getRatioColor('assetTurnover', ratios.assetTurnover)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Efficiency of using assets to generate revenue. Higher is better.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Ratio Comparison</CardTitle>
          <CardDescription>Visual comparison of all financial ratios</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <BarChart data={ratioChartData} />
        </CardContent>
      </Card>
      
      <Card className="shadow mt-6">
        <CardHeader>
          <CardTitle>Ratio Analysis</CardTitle>
          <CardDescription>Interpretation of financial ratios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Profitability Assessment</h3>
              <p className="text-muted-foreground">
                {ratios.profitMargin > 15 ? 
                  "The company shows excellent profit margins, indicating strong pricing power and cost control." :
                  ratios.profitMargin > 5 ? 
                  "The company has acceptable profit margins, but there may be room for improvement in pricing strategy or cost reduction." :
                  "The company's profit margins are concerning and suggest potential issues with pricing, cost structure, or competitiveness."}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Liquidity Position</h3>
              <p className="text-muted-foreground">
                {ratios.currentRatio > 2 ? 
                  "The company maintains a strong liquidity position and should be able to meet short-term obligations with ease." :
                  ratios.currentRatio > 1 ? 
                  "The company has adequate liquidity but should monitor cash flow closely." :
                  "The company may face challenges meeting short-term obligations and should focus on improving liquidity."}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Financial Leverage</h3>
              <p className="text-muted-foreground">
                {ratios.debtToEquity < 0.5 ? 
                  "The company has low financial leverage, indicating a conservative financial strategy and lower risk." :
                  ratios.debtToEquity < 1.5 ? 
                  "The company has a moderate level of debt which appears manageable." :
                  "The high debt-to-equity ratio suggests significant financial leverage, which may increase financial risk."}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Overall Recommendation</h3>
              <p className="text-muted-foreground">
                {(ratios.profitMargin > 10 && ratios.currentRatio > 1.5 && ratios.debtToEquity < 1) ? 
                  "The company appears to be in a strong financial position with good profitability, adequate liquidity, and manageable debt levels." :
                  (ratios.profitMargin < 3 || ratios.currentRatio < 0.8 || ratios.debtToEquity > 2) ? 
                  "The company should focus on improving its financial health, particularly in areas of concern like profitability, liquidity, or debt management." :
                  "The company shows mixed financial performance. Management should consider strategic improvements in weaker areas while maintaining strengths."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ratios;
