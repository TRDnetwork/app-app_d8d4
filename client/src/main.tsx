import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './lib/sentry';
import App from './App';
import './index.css';
import { reportWebVitals } from './lib/performance';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>An error has occurred</div>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Report web vitals
reportWebVitals();
```