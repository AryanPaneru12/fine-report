
import * as XLSX from 'xlsx';
import { FileAuditResult, FileParseCallback, ErrorCallback } from './types';

/**
 * Helper function to parse workbook from any format
 */
export const parseWorkbook = (data: string | ArrayBuffer): XLSX.WorkBook | null => {
  try {
    // For ArrayBuffer (most Excel files)
    if (data instanceof ArrayBuffer) {
      // Try with all available options to maximize compatibility
      try {
        return XLSX.read(data, { type: 'array' });
      } catch (e) {
        // If default reading fails, try with more lenient options
        return XLSX.read(data, { 
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false
        });
      }
    }
    // For string data (some older formats)
    else if (typeof data === 'string') {
      try {
        return XLSX.read(data, { type: 'binary' });
      } catch (e) {
        // Try alternative parsing options
        return XLSX.read(data, { 
          type: 'binary',
          cellDates: true,
          cellNF: false,
          cellText: false 
        });
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing workbook:', error);
    return null;
  }
};

/**
 * Parses an Excel file
 */
export const parseExcelFile = (
  file: File,
  onSuccess: FileParseCallback,
  onError: ErrorCallback,
  audit: FileAuditResult
) => {
  console.log('Parsing Excel file');
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = e.target?.result;
      if (!data) {
        audit.issues.push({
          issue: 'Failed to read file data',
          suggestion: 'The file might be corrupted or empty. Try re-exporting the file.'
        });
        throw new Error('Failed to read file data');
      }

      // Parse the workbook using appropriate method based on data type
      const workbook = parseWorkbook(data);
      if (!workbook) {
        audit.issues.push({
          issue: 'Failed to parse Excel file',
          suggestion: 'The file may be corrupted or in an unsupported format. Try saving as .xlsx or .csv.'
        });
        throw new Error('Failed to parse Excel file');
      }
      
      console.log('Excel workbook loaded:', workbook.SheetNames);
      
      if (workbook.SheetNames.length === 0) {
        audit.issues.push({
          issue: 'Excel file contains no sheets',
          suggestion: 'The file appears to be empty. Please ensure it contains at least one sheet with data.'
        });
        throw new Error('Excel file contains no sheets');
      }
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Check for merged cells which can cause parsing issues
      if (worksheet['!merges'] && worksheet['!merges'].length > 0) {
        audit.warnings.push(`Found ${worksheet['!merges'].length} merged cells which may cause data misalignment`);
      }
      
      // Convert to JSON with headers
      const options = { 
        defval: '',  // Default value for empty cells
        raw: false   // Convert values to strings
      };
      const jsonData = XLSX.utils.sheet_to_json(worksheet, options);
      console.log('Excel JSON data:', jsonData);
      
      audit.totalRows = jsonData.length;
      
      if (jsonData.length === 0) {
        audit.issues.push({
          issue: 'Excel sheet contains no data rows',
          suggestion: 'Ensure your Excel file has data rows with headers matching Particulars, Debit, and Credit'
        });
        throw new Error('Excel sheet contains no data rows');
      }
      
      onSuccess(jsonData, audit);
    } catch (error: any) {
      console.error('Excel processing error:', error);
      audit.issues.push({
        issue: `Excel processing error: ${error.message || 'Unknown error'}`,
        suggestion: 'Check file format and structure. Try exporting as CSV or XLSX.'
      });
      onError(error);
    }
  };
  
  reader.onerror = (error) => {
    console.error('FileReader error:', error);
    audit.issues.push({
      issue: 'File reading error',
      suggestion: 'The file might be corrupted or too large. Try with a smaller file or different format.'
    });
    onError(error);
  };
  
  // Read the file as an array buffer for all Excel formats
  reader.readAsArrayBuffer(file);
};
