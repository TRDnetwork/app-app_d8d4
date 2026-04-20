'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function ProductExport() {
  const [filters, setFilters] = useState({
    category_id: '',
    brand: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const url = `/api/import/products/csv?${params.toString()}`;
      
      // Trigger file download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Products export started. File will download automatically.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export products",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Export Products</h3>
        <p className="text-sm text-text_dim mt-1">
          Export products to CSV file. Apply filters to export specific products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">Category ID</Label>
          <Input
            id="category_id"
            name="category_id"
            value={filters.category_id}
            onChange={handleFilterChange}
            placeholder="e.g., 60d214a1e9b9b92d8c4b1234"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            placeholder="e.g., Apple"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-text_dim focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="e.g., 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="e.g., 1000"
          />
        </div>
      </div>

      <Button 
        onClick={handleExport} 
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Products'}
      </Button>
    </div>
  );
}