import { Button, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

export const CauHinhTaiKhoan = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authService.getProfile()
      .then(({ data }) => form.setFieldsValue(data))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await authService.updateProfile(values);
      toast.success('Đã lưu thông tin tài khoản và doanh nghiệp');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Spin /></div>;

  return (
    <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h1 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-300">Cấu hình tài khoản</h1>
      <p className="mb-6 text-sm text-gray-500">
        Thông tin này được dùng cho hồ sơ doanh nghiệp và địa chỉ nhận báo cáo email.
      </p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Tên người dùng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email nhận báo cáo" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" initialValue={user?.username}>
            <Input disabled value={user?.username} />
          </Form.Item>
          <Form.Item label="Tên doanh nghiệp" name="companyName">
            <Input />
          </Form.Item>
          <Form.Item label="Mã số thuế" name="taxCode">
            <Input />
          </Form.Item>
          <Form.Item label="Người đại diện" name="representativeName">
            <Input />
          </Form.Item>
          <Form.Item label="Website" name="website">
            <Input placeholder="https://example.com" />
          </Form.Item>
        </div>
        <Form.Item label="Địa chỉ doanh nghiệp" name="address">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>Lưu thông tin</Button>
      </Form>
    </div>
  );
};
