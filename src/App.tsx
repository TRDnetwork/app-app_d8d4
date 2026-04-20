import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import Router from './router';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;