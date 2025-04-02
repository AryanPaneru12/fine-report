
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, FileX, Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // List of supported Excel and CSV MIME types and extensions
  const supportedTypes = [
    'text/csv', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream', // Sometimes Excel files are reported as this
    'application/vnd.oasis.opendocument.spreadsheet', // .ods
    'application/csv',
    'application/excel',
    'application/x-excel',
    'application/x-msexcel'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type or extension
    const isValidType = isValidFileType(file);
    
    if (isValidType) {
      setFile(file);
      setFileName(file.name);
      onFileSelect(file);
    } else {
      console.log('Invalid file type:', file.type);
      setFile(null);
      setFileName('');
      // Error handling is done by the parent component
    }
  };

  const isValidFileType = (file: File): boolean => {
    // Check by MIME type
    if (supportedTypes.includes(file.type)) {
      return true;
    }
    
    // Check by file extension as a fallback
    const fileName = file.name.toLowerCase();
    return fileName.endsWith('.csv') || 
           fileName.endsWith('.xlsx') || 
           fileName.endsWith('.xls') || 
           fileName.endsWith('.ods');
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {fileName ? (
        <div className="flex flex-col items-center gap-2">
          <FileUp className="h-10 w-10 text-primary" />
          <p className="text-sm font-medium">{fileName}</p>
          <Button variant="outline" size="sm" onClick={removeFile}>
            <FileX className="mr-2 h-4 w-4" />
            Remove File
          </Button>
        </div>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Drag & drop your file here</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            or click to browse your files
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xlsx,.xls,.ods"
            onChange={handleFileChange}
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">Select File</label>
          </Button>
        </>
      )}
    </div>
  );
};

export default FileUploader;
