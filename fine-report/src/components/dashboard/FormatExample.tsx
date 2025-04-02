
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FormatExample = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expected Format</CardTitle>
        <CardDescription>
          Your file should contain the following columns: Particulars, Debit, Credit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="example">
          <TabsList className="mb-4">
            <TabsTrigger value="example">Example Data</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="example">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Particulars</th>
                    <th className="text-right p-2">Debit</th>
                    <th className="text-right p-2">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Sundry Debtors</td>
                    <td className="text-right p-2">43000</td>
                    <td className="text-right p-2"></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Stock (01.01.2008)</td>
                    <td className="text-right p-2">23000</td>
                    <td className="text-right p-2"></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Sales</td>
                    <td className="text-right p-2"></td>
                    <td className="text-right p-2">135000</td>
                  </tr>
                  <tr>
                    <td className="p-2">Capital</td>
                    <td className="text-right p-2"></td>
                    <td className="text-right p-2">72795</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="requirements">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">File Format Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CSV, XLSX, XLS, or ODS file formats are supported</li>
                  <li>The file must contain a header row with the column names</li>
                  <li>Required columns are: <code>Particulars</code>, <code>Debit</code>, and <code>Credit</code> (case insensitive)</li>
                  <li>Column names with trailing spaces (e.g., "Debit " instead of "Debit") will be automatically handled</li>
                  <li>Each row must contain the account name in the Particulars column</li>
                  <li>Each row must have either a Debit or Credit value (or both)</li>
                  <li>Empty rows will be ignored</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Account Types:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Income accounts:</strong> Sales, Commission Received, Discount, Dividend Received, etc.</li>
                  <li><strong>Expense accounts:</strong> Purchases, Salaries, Rent, Insurance, etc.</li>
                  <li><strong>Asset accounts:</strong> Cash, Bank, Stock, Debtors, etc.</li>
                  <li><strong>Liability accounts:</strong> Capital, Loans, Creditors, etc.</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Common Issues:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Missing required columns:</strong> 
                    <p className="text-sm text-muted-foreground mt-1">
                      Ensure your file has headers named Particulars, Debit, and Credit (case insensitive).
                      Alternative column names like "Account", "Dr", "Cr" are not automatically recognized.
                    </p>
                  </li>
                  <li>
                    <strong>Column names with trailing spaces:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system will automatically trim column names like "Debit " to "Debit", but ensure your data is properly aligned.
                    </p>
                  </li>
                  <li>
                    <strong>Non-numeric values in Debit/Credit columns:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ensure all Debit and Credit values are numbers. Remove any currency symbols, commas, or text.
                    </p>
                  </li>
                  <li>
                    <strong>Merged cells in Excel:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Merged cells can cause data misalignment. Unmerge all cells before uploading.
                    </p>
                  </li>
                  <li>
                    <strong>CSV delimiter issues:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      If using CSV, ensure it uses standard comma delimiter. Some regions use semicolons.
                    </p>
                  </li>
                  <li>
                    <strong>Hidden data or formulas:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Convert all formulas to values before uploading. Remove any hidden rows or columns.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">If You Continue to Have Issues:</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Try exporting your file as a simple CSV format</li>
                  <li>Ensure the first row contains only the header names</li>
                  <li>Remove any formatting, colors, or special characters</li>
                  <li>Check that numeric values don't contain currency symbols or thousand separators</li>
                  <li>Use our sample data generator to download a correctly formatted template</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormatExample;
