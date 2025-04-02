
// Common types and interfaces for file parsing

export type FileParseCallback = (data: any[], audit?: FileAuditResult) => void;
export type ErrorCallback = (error: any) => void;

// Expected column structure for valid financial data
// Format expected:
// Particulars (string): Account name such as "Sales", "Purchases", "Capital", etc.
// Debit (number): Debit amounts (e.g., 5000, 2500)
// Credit (number): Credit amounts (e.g., 3000, 1200)
export const REQUIRED_COLUMNS = ['Particulars', 'Debit', 'Credit'];

// Detailed audit information for file parsing
export interface FileAuditResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  issues: FileParsingIssue[];
  warnings: string[];
}

export interface FileParsingIssue {
  row?: number;
  issue: string;
  suggestion?: string;
}
