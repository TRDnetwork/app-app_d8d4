'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function UserExport() {
  const [filters, setFilters] = useState({
    role: '',
    email_verified: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const url = `/api/import/users/csv?${params.toString()}`;
      
      // Trigger file download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'users.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Users export started. File will download automatically.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export users",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Export Users</h3>
        <p className="text-sm text-text_dim mt-1">
          Export users to CSV file. Apply filters to export specific users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-text_dim focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <option value="">All</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email_verified">Email Verified</Label>
          <select
            id="email_verified"
            name="email_verified"
            value={filters.email_verified}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-text_dim focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={handleExport} 
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Users'}
      </Button>
    </div>
  );
}