import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Fuel, 
  Container, 
  CreditCard, 
  Sun, 
  Moon, 
  Monitor,
  User,
  LogOut,
  Menu as MenuIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const { Header, Sider, Content } = Layout;

export const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  const themeMenuItems = [
    { key: 'light', icon: <Sun size={16} />, label: 'Sáng', onClick: () => setTheme('light') },
    { key: 'dark', icon: <Moon size={16} />, label: 'Tối', onClick: () => setTheme('dark') },
    { key: 'system', icon: <Monitor size={16} />, label: 'Hệ thống', onClick: () => setTheme('system') },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <User size={16} />, label: 'Tài khoản' },
    { type: 'divider' },
    { key: 'logout', icon: <LogOut size={16} />, label: 'Đăng xuất', onClick: handleLogout },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme={theme === 'dark' ? 'dark' : 'light'}
        className="shadow-md z-10"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-2 overflow-hidden whitespace-nowrap">
          <div className={`font-bold text-blue-600 dark:text-blue-400 transition-all ${collapsed ? 'text-xl' : 'text-xl'}`}>
            {collapsed ? 'D' : 'DVN MONTECH'}
          </div>
        </div>
        <Menu
          theme={theme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname.replace('/', '') || 'pumps']}
          onClick={handleMenuClick}
          className="mt-4 border-r-0"
          items={[
            {
              key: 'pumps',
              icon: <Fuel size={20} />,
              label: 'Trụ Bơm',
            },
            {
              key: 'tanks',
              icon: <Container size={20} />,
              label: 'Bồn Nhiên Liệu',
            },
            {
              key: 'cards',
              icon: <CreditCard size={20} />,
              label: 'Bán Hàng Dùng Thẻ',
            },
          ]}
        />
      </Sider>
      
      <Layout className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header className="bg-white dark:bg-gray-800 p-0 flex items-center justify-between shadow-sm z-10 px-4 transition-colors duration-200">
          <Button
            type="text"
            icon={<MenuIcon size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 w-10 h-10 flex items-center justify-center rounded-full"
          />
          
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: themeMenuItems }} trigger={['click']} placement="bottomRight">
              <Button type="text" className="w-10 h-10 flex items-center justify-center rounded-full text-gray-800 dark:text-gray-200">
                {theme === 'dark' ? <Moon size={20} /> : theme === 'light' ? <Sun size={20} /> : <Monitor size={20} />}
              </Button>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 pr-3 rounded-full transition-colors">
                <Avatar icon={<User size={18} />} className="bg-blue-600" />
                <span className="text-sm font-medium hidden sm:block dark:text-gray-200">Admin</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-4 md:m-6 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-auto transition-colors duration-200">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
