import { Button, Form, Input } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const KhungThoiGian = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    toast.success('Lưu cài đặt thành công!');
    navigate('/bao-cao');
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-[#0b1120] min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center p-2 border-b-2 border-[#0f3460] bg-white dark:bg-gray-800 shadow-sm mb-6">
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2" onClick={() => navigate('/')}>Trang Chủ</div>
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2" onClick={() => navigate('/bao-cao')}>Báo Cáo Vòi</div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded shadow-sm w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Form form={form} layout="horizontal" onFinish={onFinish} initialValues={{
            ca1_start: '210000', ca1_end: '050000',
            ca2_start: '050000', ca2_end: '130000',
            ca3_start: '130000', ca3_end: '210000'
          }}>

            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[#0f3460] font-bold text-lg mb-4">CA BÁN 1</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">Bắt đầu (hhmmss)</span>
                <Form.Item name="ca1_start" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Kết thúc (hhmmss)</span>
                <Form.Item name="ca1_end" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[#0f3460] font-bold text-lg mb-4">CA BÁN 2</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">Bắt đầu (hhmmss)</span>
                <Form.Item name="ca2_start" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Kết thúc (hhmmss)</span>
                <Form.Item name="ca2_end" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-[#0f3460] font-bold text-lg mb-4">CA BÁN 3</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">Bắt đầu (hhmmss)</span>
                <Form.Item name="ca3_start" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Kết thúc (hhmmss)</span>
                <Form.Item name="ca3_end" noStyle><Input className="w-40 text-center font-bold" /></Form.Item>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-4">Nhập thời gian theo định dạng <strong>hhmmss</strong>, ví dụ <strong>060000</strong> là 06:00:00.</p>
              <Button type="primary" htmlType="submit" className="w-full bg-[#1677ff] h-10 text-base font-bold rounded">
                Lưu Cài Đặt
              </Button>
            </div>
          </Form>
        </div>
        <div className="text-center text-gray-500 text-xs mt-6">
          Copyright © 2026 - Công ty DVN Technology
        </div>
      </div>
    </div>
  );
};
