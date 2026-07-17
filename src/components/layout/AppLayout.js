import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from 'next-themes';

const { Header, Content } = Layout;

export const AppLayout = ({ children }) => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout className="min-h-screen flex flex-col">
      {/* Top Header like in Hình 1 */}
      <Header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 h-auto py-3 leading-tight shrink-0">
        <div className="w-1/4 flex items-center">
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xs">
            {theme === 'dark' ? 'Sáng' : 'Tối'}
          </Button>
        </div>
        
        <div className="flex-1 text-center flex flex-col items-center justify-center">
          <h1 className="text-red-600 dark:text-red-500 font-bold text-xl uppercase mb-0 leading-tight">
            Cửa Hàng Xăng Dầu MONTECH
          </h1>
          <div className="text-xs text-gray-800 dark:text-gray-300 font-medium">
            51 Trần Thị Trọng - Phường Tân Sơn - Tp. Hồ Chí Minh
          </div>
          <div className="text-xs font-bold text-blue-800 dark:text-blue-400 mt-1 flex items-center justify-center gap-4">
            <span>{time.toLocaleDateString('en-GB')} {time.toLocaleTimeString('en-GB')}</span>
          </div>
          <div className="text-xs font-bold text-green-600 mt-0.5">
            {location.pathname === '/bao-cao' ? 'Đang Kết Nối 2' : 'Đang Kết Nối 1'}
          </div>
        </div>

        <div className="w-1/4 flex justify-end items-center gap-2">
          {location.pathname !== '/' && location.pathname !== '/home' && (
            <Button type="link" onClick={() => navigate('/')} className="mr-2 p-0">Về Trang Chủ</Button>
          )}
          <Button 
            type="text" 
            icon={<LogOut size={16} />} 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500"
          >
            Thoát
          </Button>
        </div>
      </Header>

      <Content className="bg-white dark:bg-gray-900 overflow-auto flex-1">
        <div className="p-4 mx-auto w-full max-w-[1920px]">
          {children}
        </div>
      </Content>
    </Layout>
  );
};
