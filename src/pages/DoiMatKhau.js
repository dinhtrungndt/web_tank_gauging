import { Button, Form, Input } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const DoiMatKhau = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    if (values.oldPassword !== '1234') {
      toast.error('Mật khẩu cũ không chính xác!');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    toast.success('Đổi mật khẩu thành công!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0b1120] min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-[#0f3460] text-center mb-6">Đổi Mật Khẩu Đăng Nhập</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="flex items-center justify-between mb-4 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Mật khẩu cũ</span>
            <Form.Item name="oldPassword" noStyle rules={[{ required: true, message: 'Nhập mật khẩu cũ' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-4 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Mật khẩu mới</span>
            <Form.Item name="newPassword" noStyle rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-6 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Nhập lại mật khẩu mới</span>
            <Form.Item name="confirmPassword" noStyle rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" className="w-full bg-[#1677ff] h-12 text-lg font-bold rounded-md">
            Lưu
          </Button>
        </Form>
      </div>
      <div className="text-center text-gray-500 text-xs mt-6">
        Copyright © 2026 - Công ty DVN Technology
      </div>
    </div>
  );
};
