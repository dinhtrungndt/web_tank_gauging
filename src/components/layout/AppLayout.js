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
      {/* Top Header slim */}
      <Header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 h-14 shrink-0">
        <div className="flex items-center gap-4">
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xs font-bold">
            {theme === 'dark' ? 'Sáng' : 'Tối'}
          </Button>
          <div className="text-sm font-bold text-blue-800 dark:text-blue-400">
            <span>{time.toLocaleDateString('en-GB')} {time.toLocaleTimeString('en-GB')}</span>
          </div>
          <div className="text-sm font-bold text-green-600">
            {location.pathname === '/bao-cao' ? 'Đang Kết Nối 2' : 'Đang Kết Nối 1'}
          </div>
        </div>

        <div className="flex justify-end items-center gap-2">
          {location.pathname !== '/' && location.pathname !== '/home' && (
            <Button type="link" onClick={() => navigate('/')} className="mr-2 p-0 font-bold">Về Trang Chủ</Button>
          )}
          <Button type="link" onClick={() => navigate('/cau-hinh-tai-khoan')} className="mr-2 p-0 font-bold">
            Cấu hình tài khoản
          </Button>
          <Button 
            type="text" 
            icon={<LogOut size={16} />} 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 font-bold"
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
