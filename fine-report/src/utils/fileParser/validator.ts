
import { FileAuditResult, REQUIRED_COLUMNS } from './types';
import { findPossibleHeaderMatches } from './normalize';

/**
 * Validates that the data has the expected structure for financial data
 */
export const validateFinancialData = (data: any[], audit?: FileAuditResult): { valid: boolean; message: string; data: any[] } => {
  if (!Array.isArray(data) || data.length === 0) {
    if (audit) {
      audit.issues.push({
        issue: 'File contains no data or is not in the expected format',
        suggestion: 'Ensure the file contains data rows with proper headers'
      });
    }
    return { 
      valid: false, 
      message: 'File contains no data or is not in the expected format',
      data: []
    };
  }
  
  // Check if the required columns exist in the first row
  const firstRow = data[0];
  const headers = Object.keys(firstRow);
  
  console.log('Column headers found:', headers);
  
  // Check for required columns (case-insensitive)
  const normalizedHeaders = headers.map(h => h.toLowerCase());
  const missingColumns = REQUIRED_COLUMNS.filter(col => 
    !normalizedHeaders.includes(col.toLowerCase())
  );
  
  if (missingColumns.length > 0) {
    if (audit) {
      audit.issues.push({
        issue: `Missing required columns: ${missingColumns.join(', ')}`,
        suggestion: 'Make sure your file has headers for Particulars, Debit, and Credit (case-insensitive)'
      });
    }
    
    // Try to see if we can recover with similar column names
    const possibleMatches = findPossibleHeaderMatches(headers, missingColumns);
    if (possibleMatches.length > 0 && audit) {
      audit.warnings.push(`Found possible alternative headers: ${possibleMatches.join(', ')}`);
    }
    
    return { 
      valid: false, 
      message: `Missing required columns: ${missingColumns.join(', ')}. Required format is: Particulars, Debit, Credit`,
      data: []
    };
  }

  // Check each row and audit invalid rows if audit is provided
  if (audit) {
    data.forEach((row, index) => {
      // Find the actual column names (might be case variations)
      const rowKeys = Object.keys(row);
      const particularsKey = rowKeys.find(k => k.toLowerCase() === 'particulars');
      const debitKey = rowKeys.find(k => k.toLowerCase() === 'debit');
      const creditKey = rowKeys.find(k => k.toLowerCase() === 'credit');
      
      // Check if the row has the necessary properties
      const hasParticulars = particularsKey && row[particularsKey];
      const hasDebit = debitKey && (row[debitKey] !== undefined && row[debitKey] !== null && row[debitKey] !== '');
      const hasCredit = creditKey && (row[creditKey] !== undefined && row[creditKey] !== null && row[creditKey] !== '');
      
      if (!hasParticulars) {
        audit.issues.push({
          row: index + 1, // +1 for human-readable row number (accounting for header)
          issue: 'Missing Particulars value',
          suggestion: 'Each row must have an account name in the Particulars column'
        });
      }
      
      if (!hasDebit && !hasCredit) {
        audit.issues.push({
          row: index + 1,
          issue: 'Missing both Debit and Credit values',
          suggestion: 'Each row must have either a Debit or Credit value (or both)'
        });
      }
      
      // Check for non-numeric values in Debit/Credit columns
      if (hasDebit && isNaN(parseFloat(String(row[debitKey]))) && row[debitKey] !== '') {
        audit.issues.push({
          row: index + 1,
          issue: `Non-numeric Debit value: "${row[debitKey]}"`,
          suggestion: 'Debit values must be numeric'
        });
      }
      
      if (hasCredit && isNaN(parseFloat(String(row[creditKey]))) && row[creditKey] !== '') {
        audit.issues.push({
          row: index + 1,
          issue: `Non-numeric Credit value: "${row[creditKey]}"`,
          suggestion: 'Credit values must be numeric'
        });
      }
    });
  }
  
  return { valid: true, message: 'Data is valid', data };
};
