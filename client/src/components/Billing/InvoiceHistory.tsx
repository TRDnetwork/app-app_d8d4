import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth';

const InvoiceHistory: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadInvoices = async () => {
      try {
        const response = await fetch('/api/billing/invoice-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')