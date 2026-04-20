'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Import/Export</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Import Products</CardTitle>
            <CardDescription>Upload a CSV file to import products</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImport />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Users</CardTitle>
            <CardDescription>Upload a CSV file to import users</CardDescription>
          </CardHeader>
          <CardContent>
            <UserImport />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Products</CardTitle>
            <CardDescription>Download products as CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductExport />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Users</CardTitle>
            <CardDescription>Download users as CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <UserExport />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}