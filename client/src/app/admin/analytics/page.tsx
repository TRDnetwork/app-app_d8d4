import AnalyticsDashboardWidget from '@/components/Analytics/DashboardWidget';

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>
      <AnalyticsDashboardWidget />
    </div>
  );
}