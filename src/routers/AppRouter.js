import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Login } from '../pages/Login';
import { Pumps } from '../pages/Pumps';
import { Tanks } from '../pages/Tanks';
import { Cards } from '../pages/Cards';
import { Home } from '../pages/Home';
import { ChotSo } from '../pages/ChotSo';
import { BaoCao } from '../pages/BaoCao';
import { DoiMatKhau } from '../pages/DoiMatKhau';
import { KhungThoiGian } from '../pages/KhungThoiGian';
import { BaoCaoBon } from '../pages/BaoCaoBon';
import { NhapBon } from '../pages/NhapBon';
import { TankDetail } from '../pages/TankDetail';

function DashboardRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/chot-so" element={<ChotSo />} />
        <Route path="/bao-cao" element={<BaoCao />} />
        <Route path="/bao-cao-bon" element={<BaoCaoBon />} />
        <Route path="/nhap-bon" element={<NhapBon />} />
        <Route path="/doi-mat-khau" element={<DoiMatKhau />} />
        <Route path="/khung-thoi-gian" element={<KhungThoiGian />} />
        <Route path="/tanks/:tankId" element={<TankDetail />} />
        <Route path="/pumps" element={<Navigate to="/home" replace />} />
        <Route path="/tanks" element={<Navigate to="/home" replace />} />
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
