import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Router from './router';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Router />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;