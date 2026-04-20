import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface InvoiceHistoryProps {
  invoices: Array<{
    id: string;
    amount: number;
    status: string;
    date: string;
    pdf_url: string;
  }>;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ invoices }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-1">Date</th>
                <th className="text-left py-2 px-1">Amount</th>
                <th className="text-left py-2 px-1">Status</th>
                <th className="text-right py-2 px-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border last:border-b-0">
                  <td className="py-3 px-1">{invoice.date}</td>
                  <td className="py-3 px-1">${invoice.amount.toFixed(2)}</td>
                  <td className="py-3 px-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-success/10 text-success' :
                      invoice.status === 'open' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-1 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;
```

```typescript