import AnalyticsDashboardWidget from '@/components/Analytics/DashboardWidget';

export default function SellerAnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sales Analytics</h1>
      <AnalyticsDashboardWidget />
    </div>
  );
}