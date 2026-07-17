import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Login } from '../pages/Login';
import { Pumps } from '../pages/Pumps';
import { Tanks } from '../pages/Tanks';
import { Cards } from '../pages/Cards';

function DashboardRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/pumps" replace />} />
        <Route path="/pumps" element={<Pumps />} />
        <Route path="/tanks" element={<Tanks />} />
        <Route path="/cards" element={<Cards />} />
      </Routes>
    </AppLayout>
  );
}

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};
