
interface FinancialEntry {
  Particulars: string;
  Debit: number | string;
  Credit: number | string;
}

interface TrialBalance {
  [key: string]: {
    debit: number;
    credit: number;
  };
}

export interface ProfitLossData {
  incomes: { name: string; amount: number }[];
  expenses: { name: string; amount: number }[];
  netProfit: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface BalanceSheetData {
  assets: { name: string; amount: number }[];
  liabilities: { name: string; amount: number }[];
  totalAssets: number;
  totalLiabilities: number;
}

// Define categorization rules based on account names
const incomeAccounts = ['Sales', 'Commission Received', 'Discount', 'Dividend Received', 'Accrued Income'];
const expenseAccounts = [
  'Trade Expenses', 'Salaries', 'Carriage Outwards', 'Rent', 'Purchases', 
  'Insurance', 'Carriage Inwards', 'Office Expenses', 'Electricity Charges',
  'Telephone Expenses', 'Printing & Stationery', 'Advertising', 'Interest Paid',
  'Depreciation', 'Bad Debts', 'Repairs & Maintenance', 'Miscellaneous Expenses',
  'Legal Fees', 'Audit Fees', 'Travelling Expenses', 'Wages'
];
const assetAccounts = [
  'Sundry Debtors', 'Stock (01.01.2008)', 'Cash in Hand', 'Plant & Machinery',
  'Business Premises', 'Cash at Bank', 'Prepaid Insurance'
];
const liabilityAccounts = [
  'Bank Overdraft', 'Sundry Creditors', 'Bills Payable', 'Capital',
  'Loan from Bank'
];

export const generateReports = (data: FinancialEntry[]): { profitLoss: ProfitLossData, balanceSheet: BalanceSheetData } => {
  console.log('Generating reports with data:', data);
  
  // Categorize data for profit and loss and balance sheet
  const incomes: any[] = [];
  const expenses: any[] = [];
  const assets: any[] = [];
  const liabilities: any[] = [];
  
  // Process each entry and categorize
  data.forEach(entry => {
    console.log('Processing entry:', entry);
    
    // Ensure values are numbers
    const debit = parseFloat(entry.Debit as string) || 0;
    const credit = parseFloat(entry.Credit as string) || 0;
    
    if (typeof entry.Particulars !== 'string') {
      console.warn('Skipping entry with non-string Particulars:', entry);
      return;
    }
    
    const particulars = entry.Particulars.trim();
    
    if (incomeAccounts.some(account => particulars.includes(account))) {
      incomes.push({
        name: particulars,
        amount: credit || 0
      });
    } else if (expenseAccounts.some(account => particulars.includes(account))) {
      expenses.push({
        name: particulars,
        amount: debit || 0
      });
    } else if (assetAccounts.some(account => particulars.includes(account))) {
      assets.push({
        name: particulars,
        amount: debit || 0
      });
    } else if (liabilityAccounts.some(account => particulars.includes(account))) {
      liabilities.push({
        name: particulars,
        amount: credit || 0
      });
    } else {
      console.log('Uncategorized account:', particulars);
      // Try to intelligently categorize based on debit/credit values
      if (debit > 0 && credit === 0) {
        assets.push({
          name: particulars,
          amount: debit
        });
      } else if (credit > 0 && debit === 0) {
        liabilities.push({
          name: particulars,
          amount: credit
        });
      }
    }
  });

  console.log('Categorized data:');
  console.log('Incomes:', incomes);
  console.log('Expenses:', expenses);
  console.log('Assets:', assets);
  console.log('Liabilities:', liabilities);

  // Calculate totals
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  
  if (netProfit > 0) {
    liabilities.push({
      name: 'Net Profit',
      amount: netProfit
    });
  } else if (netProfit < 0) {
    assets.push({
      name: 'Net Loss',
      amount: Math.abs(netProfit)
    });
  }
  
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);

  // Store reports in localStorage for use in the View Reports page
  localStorage.setItem('profitLossReport', JSON.stringify({
    incomes,
    expenses,
    netProfit,
    totalIncome,
    totalExpenses
  }));
  
  localStorage.setItem('balanceSheetReport', JSON.stringify({
    assets,
    liabilities,
    totalAssets,
    totalLiabilities
  }));

  // Store data for ratios
  localStorage.setItem('ratiosData', JSON.stringify({
    sales: totalIncome,
    netProfit: netProfit,
    totalAssets: totalAssets,
    currentAssets: assets.filter(a => ['Sundry Debtors', 'Cash in Hand', 'Cash at Bank', 'Stock (01.01.2008)'].includes(a.name)).reduce((sum, a) => sum + a.amount, 0),
    currentLiabilities: liabilities.filter(l => ['Sundry Creditors', 'Bills Payable', 'Bank Overdraft'].includes(l.name)).reduce((sum, l) => sum + l.amount, 0),
    totalLiabilities: totalLiabilities - (liabilities.find(l => l.name === 'Capital')?.amount || 0) - (liabilities.find(l => l.name === 'Net Profit')?.amount || 0),
    equity: (liabilities.find(l => l.name === 'Capital')?.amount || 0) + (liabilities.find(l => l.name === 'Net Profit')?.amount || 0)
  }));

  return {
    profitLoss: {
      incomes,
      expenses,
      netProfit,
      totalIncome,
      totalExpenses
    },
    balanceSheet: {
      assets,
      liabilities,
      totalAssets,
      totalLiabilities
    }
  };
};
