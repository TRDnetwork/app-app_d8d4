import React from 'react';
import { Container } from '../components/layout/Container';
import StatsWidget from '../components/analytics/StatsWidget';

const AdminAnalytics = () => {
  return (
    <Container>
      <h1 className="text-display text-4xl font-bold mb-8">Analytics Dashboard</h1>
      <StatsWidget />
    </Container>
  );
};

export default AdminAnalytics;