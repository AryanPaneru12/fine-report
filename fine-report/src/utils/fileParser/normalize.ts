
// Utilities for normalizing and cleaning up parsed data

/**
 * Normalizes column names by trimming whitespace from keys
 */
export const normalizeColumnNames = (data: any[]): any[] => {
  if (!data || data.length === 0) return data;
  
  return data.map(row => {
    const newRow: any = {};
    Object.keys(row).forEach(key => {
      // Trim whitespace from column names
      const trimmedKey = key.trim();
      newRow[trimmedKey] = row[key];
    });
    return newRow;
  });
};

/**
 * Finds possible header matches for missing columns
 */
export const findPossibleHeaderMatches = (headers: string[], missingColumns: string[]): string[] => {
  const possibleMatches: string[] = [];
  
  missingColumns.forEach(missingCol => {
    const lowerMissingCol = missingCol.toLowerCase();
    
    // Check for partial matches or common variations
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      
      if (lowerMissingCol === 'particulars') {
        if (lowerHeader.includes('account') || 
            lowerHeader.includes('item') || 
            lowerHeader.includes('description') || 
            lowerHeader.includes('particular')) {
          possibleMatches.push(`${header} (possible match for Particulars)`);
        }
      } else if (lowerMissingCol === 'debit') {
        if (lowerHeader.includes('dr') || 
            lowerHeader.includes('debt') || 
            lowerHeader.includes('payment') ||
            lowerHeader.includes('expense')) {
          possibleMatches.push(`${header} (possible match for Debit)`);
        }
      } else if (lowerMissingCol === 'credit') {
        if (lowerHeader.includes('cr') || 
            lowerHeader.includes('cred') || 
            lowerHeader.includes('receipt') ||
            lowerHeader.includes('income')) {
          possibleMatches.push(`${header} (possible match for Credit)`);
        }
      }
    });
  });
  
  return possibleMatches;
};
