import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Router from './router';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Router />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;