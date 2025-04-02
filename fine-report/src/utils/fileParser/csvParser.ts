
import Papa from 'papaparse';
import { FileAuditResult, FileParseCallback, ErrorCallback } from './types';

/**
 * Helper function to get suggestions for CSV parsing errors
 */
export const getSuggestionForCSVError = (errorCode?: string): string => {
  switch (errorCode) {
    case 'QuoteNotClosed':
      return 'There is an unclosed quote in your CSV. Check for missing closing quotes.';
    case 'MissingQuotes':
      return 'Some fields are missing quotes. Ensure text fields with commas are properly quoted.';
    case 'UndetectableDelimiter':
      return 'The delimiter could not be detected. Ensure the file uses a standard delimiter like comma (,) or semicolon (;).';
    case 'TooFewFields':
    case 'TooManyFields':
      return 'Inconsistent number of columns. Check for missing commas or extra commas in some rows.';
    default:
      return 'Check the CSV format and ensure it follows standard CSV formatting rules.';
  }
};

/**
 * Parses a CSV file
 */
export const parseCSVFile = (
  file: File,
  onSuccess: FileParseCallback,
  onError: ErrorCallback,
  audit: FileAuditResult
) => {
  console.log('Parsing CSV file');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log('CSV Parse results:', results);
      audit.totalRows = results.data.length;
      
      if (results.errors && results.errors.length > 0) {
        console.error('CSV parsing errors:', results.errors);
        results.errors.forEach(error => {
          audit.issues.push({
            row: error.row,
            issue: `CSV parsing error: ${error.message || 'Unknown error'}`,
            suggestion: getSuggestionForCSVError(error.code)
          });
        });
        
        // Still try to process valid rows
        if (results.data.length > 0) {
          audit.warnings.push(`Encountered ${results.errors.length} CSV parsing errors but continuing with ${results.data.length} valid rows`);
        } else {
          onError(new Error(`CSV parsing failed: ${results.errors[0].message}`));
          return;
        }
      }
      
      onSuccess(results.data, audit);
    },
    error: (error) => {
      console.error('CSV parse error:', error);
      audit.issues.push({
        issue: `Failed to parse CSV file: ${error.message || 'Unknown error'}`,
        suggestion: 'Check that the file is properly formatted CSV and not corrupted'
      });
      onError(error);
    }
  });
};
