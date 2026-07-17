import React from 'react';
import { AppProvider } from './providers/AppProvider';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <AppProvider>
      <AppLayout>
        <div>
          <h2 className="text-2xl font-bold mb-4">Tổng quan Trạm xăng</h2>
          <p className="text-gray-600 dark:text-gray-400">Chọn chức năng từ menu bên trái.</p>
        </div>
      </AppLayout>
    </AppProvider>
  );
}

export default App;
