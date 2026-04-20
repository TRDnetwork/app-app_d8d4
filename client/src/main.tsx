import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from './components/ui/toaster';

// ANALYTICS: Initialize PostHog for e-commerce
if (typeof window !== 'undefined') {
  // Create script element
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://app.posthog.com/js/posthog.js';
  script.onload = () => {
    window.posthog?.init(/* ANALYTICS_KEY */, {
      api_host: 'https://app.posthog.com',
      capture_pageview: false,
      autocapture: false,
      respect_dnt: true
    });
    
    // Track initial page view
    window.posthog?.capture('$pageview');
  };
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);