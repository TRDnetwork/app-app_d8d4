```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Document uploaded and processed successfully",
        });
        // Reset form
        setFile(null);
        setTitle('');
      } else {
        throw new Error(data.error || 'Failed to upload document');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Document Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file">Upload Document</Label>
        <div className="flex items-center gap-4">
          <Input
            id="file"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="flex-1"
          />
          {file && (
            <span className="text-sm text-text_dim">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </div>
      </div>
      
      <Button type="submit" disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
}
```