import React from 'react';
import { AppProvider } from './providers/AppProvider';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './routers/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
