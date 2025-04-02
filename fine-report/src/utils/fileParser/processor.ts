
/**
 * Processes and normalizes financial data after parsing
 */
export const processFinancialData = (data: any[]) => {
  console.log('Processing data, raw length:', data.length);
  
  // Filter out rows without required fields and normalize column names
  const processedData = data.filter((row: any) => {
    // Find the actual column names (might be case variations)
    const rowKeys = Object.keys(row);
    const particularsKey = rowKeys.find(k => k.toLowerCase() === 'particulars');
    const debitKey = rowKeys.find(k => k.toLowerCase() === 'debit');
    const creditKey = rowKeys.find(k => k.toLowerCase() === 'credit');
    
    // Check if the row has the necessary properties
    const hasParticulars = particularsKey && row[particularsKey];
    const hasDebit = debitKey && (row[debitKey] !== undefined && row[debitKey] !== null && row[debitKey] !== '');
    const hasCredit = creditKey && (row[creditKey] !== undefined && row[creditKey] !== null && row[creditKey] !== '');
    
    // Normalize the data if needed
    if (hasParticulars && (hasDebit || hasCredit)) {
      // Standardize the property names
      row.Particulars = row[particularsKey];
      row.Debit = hasDebit ? parseFloat(row[debitKey]) || row[debitKey] : '';
      row.Credit = hasCredit ? parseFloat(row[creditKey]) || row[creditKey] : '';
      
      // Remove potential duplicate properties with different casing
      if (particularsKey !== 'Particulars') delete row[particularsKey];
      if (debitKey !== 'Debit') delete row[debitKey];
      if (creditKey !== 'Credit') delete row[creditKey];
      
      return true;
    }
    return false;
  });
  
  console.log('Processed data length:', processedData.length);
  return processedData;
};
