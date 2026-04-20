'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ImportResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

export default function ProductImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/products/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        setResult(data);
        toast({
          title: "Import Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import products",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Import Products</h3>
        <p className="text-sm text-text_dim mt-1">
          Upload a CSV file to import products. The file should have the following columns: 
          title, description, price, stock, category_id, brand, images (semicolon-separated), tags (semicolon-separated), status.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-file">CSV File</Label>
          <Input
            id="product-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {file && (
            <p className="text-sm text-text_dim">
              Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <Button 
          onClick={handleImport} 
          disabled={!file || isUploading}
        >
          {isUploading ? 'Importing...' : 'Import Products'}
        </Button>
      </div>

      {result && (
        <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-medium">{result.message}</p>
          {result.count && (
            <p className="mt-1">Successfully imported {result.count} products.</p>
          )}
          {result.errors && result.errors.length > 0 && (
            <div className="mt-3">
              <p className="font-medium">Validation Errors:</p>
              <ul className="mt-1 space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    Row {error.row}: {error.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}