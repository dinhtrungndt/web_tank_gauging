import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { User, Lock, Fuel } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect to from or home if already logged in
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onFinish = (values) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin') {
        toast.success('Đăng nhập thành công!');
        login('fake-jwt-token-12345');
        navigate(from, { replace: true });
      } else {
        toast.error('Sai tên đăng nhập hoặc mật khẩu!');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md p-8 m-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <Fuel size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            DVN MONTECH
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản Lý Cửa Hàng Xăng Dầu
          </p>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="w-full"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input 
              prefix={<User size={18} className="text-gray-400" />} 
              placeholder="Tên người dùng (admin)" 
              className="rounded-lg bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<Lock size={18} className="text-gray-400" />}
              placeholder="Mật khẩu (admin)"
              className="rounded-lg bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg text-base font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
