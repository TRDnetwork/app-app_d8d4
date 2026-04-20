// Steering interpretation: Building a full e-commerce frontend for ShopSphere using Vite-React, Zustand, Tailwind, and shadcn/ui with multi-step checkout and role-based routing.

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