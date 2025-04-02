import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUploader from './dashboard/FileUploader';
import FormatExample from './dashboard/FormatExample';
import { parseFinancialFile, FileAuditResult, FileParsingIssue } from '@/utils/fileParser';

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<FileAuditResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setValidationError(null);
    setAuditResult(null);
  };

  const handleError = (error: any) => {
    console.error('Error processing file:', error);
    setIsUploading(false);
    setValidationError(error.message || 'There was an issue processing your file. Please check the format and try again.');
    toast({
      title: "Error Processing File",
      description: error.message || "There was an issue processing your file. Please check the format and try again.",
      variant: "destructive",
    });
  };

  const parseFile = () => {
    if (!file) return;
    
    setIsUploading(true);
    setValidationError(null);
    setAuditResult(null);
    
    parseFinancialFile(
      file,
      (data, audit) => {
        try {
          if (audit) {
            setAuditResult(audit);
            
            if (audit.issues.length > 0 && audit.validRows > 0) {
              toast({
                title: "File Processed with Warnings",
                description: `Processed ${audit.validRows} valid rows out of ${audit.totalRows} total rows.`,
                variant: "default",
              });
            }
          }
          
          if (data.length === 0) {
            const errorMessage = 'The file does not contain any valid financial data. Please check the format.';
            setValidationError(errorMessage);
            toast({
              title: "No Valid Data",
              description: errorMessage,
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
          
          localStorage.setItem('financialData', JSON.stringify(data));
          
          setIsUploading(false);
          toast({
            title: "Upload Successful",
            description: `Successfully processed ${data.length} entries. You can now generate reports.`,
          });
          
          navigate('/reports');
        } catch (error) {
          console.error('Data processing error:', error);
          handleError(error);
        }
      },
      handleError
    );
  };

  const renderIssueIcon = (issue: FileParsingIssue) => {
    if (issue.issue.includes('error') || issue.issue.includes('failed') || issue.issue.includes('missing required')) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Financial Data Upload</h1>
      
      {validationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {auditResult && auditResult.issues.length > 0 && (
        <Alert variant={auditResult.validRows > 0 ? "default" : "destructive"} className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>File Audit Results</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="font-medium">Summary:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Total rows: {auditResult.totalRows}</li>
                <li>Valid rows: {auditResult.validRows}</li>
                <li>Invalid rows: {auditResult.invalidRows}</li>
                <li>Issues found: {auditResult.issues.length}</li>
              </ul>
              
              {auditResult.issues.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Issues:</p>
                  <ul className="pl-5 mt-1 space-y-2">
                    {auditResult.issues.slice(0, 5).map((issue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {renderIssueIcon(issue)}
                        <div>
                          <p className="text-sm font-medium">{issue.row ? `Row ${issue.row}: ` : ''}{issue.issue}</p>
                          {issue.suggestion && <p className="text-xs text-muted-foreground">Suggestion: {issue.suggestion}</p>}
                        </div>
                      </li>
                    ))}
                    {auditResult.issues.length > 5 && (
                      <li className="text-sm text-muted-foreground">
                        ... and {auditResult.issues.length - 5} more issues
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {auditResult.warnings.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Warnings:</p>
                  <ul className="pl-5 mt-1 space-y-1">
                    {auditResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload Trial Balance</CardTitle>
          <CardDescription>
            Upload your trial balance in CSV or Excel format to generate financial reports and analyze key ratios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader onFileSelect={handleFileSelect} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Accepted formats: .csv, .xlsx, .xls, .ods
          </p>
          <Button 
            onClick={parseFile} 
            disabled={!file || isUploading}
          >
            {isUploading ? "Processing..." : "Process File"}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <FormatExample />
      </div>
    </div>
  );
};

export default Dashboard;
