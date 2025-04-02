
import { FileParseCallback, ErrorCallback, FileAuditResult } from './types';
import { validateFinancialData } from './validator';
import { normalizeColumnNames } from './normalize';
import { processFinancialData } from './processor';
import { parseCSVFile } from './csvParser';
import { parseExcelFile } from './excelParser';

// Re-export types and functions for external use
export type { FileAuditResult } from './types';
export type { FileParsingIssue } from './types';
export { validateFinancialData } from './validator';
export { processFinancialData } from './processor';

/**
 * Main function to parse financial files of different formats
 */
export const parseFinancialFile = (
  file: File, 
  onSuccess: FileParseCallback, 
  onError: ErrorCallback
) => {
  console.log('Parsing file:', file.name, 'Type:', file.type);
  
  // Initialize audit object
  const audit: FileAuditResult = {
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    issues: [],
    warnings: []
  };
  
  try {
    // Handle successful parsing and validation for both CSV and Excel
    const handleParsedData = (parsedData: any[], audit: FileAuditResult) => {
      // Clean header names by trimming whitespace
      const cleanedData = normalizeColumnNames(parsedData);
      
      // Validate the parsed data structure
      const validationResult = validateFinancialData(cleanedData, audit);
      
      if (!validationResult.valid && audit.validRows === 0) {
        onError(new Error(validationResult.message));
        return;
      }
      
      const processedData = processFinancialData(validationResult.data);
      audit.validRows = processedData.length;
      audit.invalidRows = audit.totalRows - audit.validRows;
      
      onSuccess(processedData, audit);
    };

    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      parseCSVFile(file, handleParsedData, onError, audit);
    } else {
      // Handle any Excel file format
      parseExcelFile(file, handleParsedData, onError, audit);
    }
  } catch (error: any) {
    console.error('File parsing error:', error);
    audit.issues.push({
      issue: `File parsing error: ${error.message || 'Unknown error'}`,
      suggestion: 'The file format might be unsupported or corrupted. Try saving as CSV.'
    });
    onError(error);
  }
};
