import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from './components/ui/toaster';
import { usePageTracking } from './lib/analytics-hooks';

// Component to wrap the app with analytics
const AppWithAnalytics = () => {
  usePageTracking();
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAnalytics />
    <Toaster />
  </React.StrictMode>
);