import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Input, message, Form } from 'antd';
import { Settings, Lock, FileText, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const mockPumps = [
  { id: 1, fuelType: 'E10', money: 20000, volume: 0.973, price: 20550, serial: '113', connected: true, status: 'Đang chờ' },
  { id: 2, fuelType: 'E10', money: 0, volume: 0, price: 20550, serial: '114', connected: true, status: 'Đang chờ' },
  { id: 3, fuelType: 'E10', money: 50000, volume: 2.433, price: 20550, serial: '89', connected: true, status: 'Đang chờ' },
  { id: 4, fuelType: 'DO_II', money: 1600000, volume: 68.610, price: 23320, serial: '111', connected: true, status: 'Đang chờ' },
];

export const Pumps = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleChotSo = (values) => {
    if (values.pin === '1234') {
      toast.success('Chốt số thành công!');
      setIsModalOpen(false);
      form.resetFields();
    } else {
      toast.error('Sai mật khẩu!');
    }
  };

  const columns = [
    { title: 'Vòi', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
    { 
      title: 'Nhiên Liệu', 
      dataIndex: 'fuelType', 
      key: 'fuelType',
      render: (text) => (
        <span className={`font-bold ${text === 'E10' ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
          {text}
        </span>
      )
    },
    { title: 'Số Tiền', dataIndex: 'money', key: 'money', align: 'right', render: (val) => val.toLocaleString('vi-VN') },
    { title: 'Số Lít', dataIndex: 'volume', key: 'volume', align: 'right', render: (val) => val.toFixed(3) },
    { title: 'Đơn Giá', dataIndex: 'price', key: 'price', align: 'right', render: (val) => val.toLocaleString('vi-VN') },
    { title: 'Serial', dataIndex: 'serial', key: 'serial', align: 'center' },
    { 
      title: 'Kết Nối', 
      dataIndex: 'connected', 
      key: 'connected', 
      align: 'center',
      render: (val) => <div className={`w-3 h-3 rounded-full mx-auto ${val ? 'bg-green-500' : 'bg-red-500'}`} />
    },
    { 
      title: 'Trạng Thái', 
      dataIndex: 'status', 
      key: 'status',
      align: 'center',
      render: (text) => <Tag color="default">{text}</Tag>
    },
    {
      title: 'Chi Tiết',
      key: 'action',
      align: 'center',
      render: () => (
        <Button type="link" size="small" className="text-blue-600 flex items-center justify-center m-auto">
          Xem <ChevronRight size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trụ Bơm</h2>
          <p className="text-gray-500 dark:text-gray-400">Quản lý và giám sát trạng thái các vòi bơm nhiên liệu.</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<FileText size={16} />}>Báo Cáo</Button>
          <Button type="primary" className="bg-blue-600" icon={<Lock size={16} />} onClick={() => setIsModalOpen(true)}>
            Chốt Số
          </Button>
        </div>
      </div>

      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <Table 
          columns={columns} 
          dataSource={mockPumps} 
          rowKey="id" 
          pagination={false}
          scroll={{ x: 'max-content' }}
          className="dark-theme-table"
        />
      </Card>

      <Modal 
        title="Nhập Mật Khẩu Chốt Số" 
        open={isModalOpen} 
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        className="dark:bg-gray-800"
      >
        <Form form={form} layout="vertical" onFinish={handleChotSo}>
          <Form.Item 
            name="pin" 
            rules={[{ required: true, message: 'Vui lòng nhập mã PIN!' }]}
          >
            <Input.Password placeholder="Mã PIN (Mặc định: 1234)" size="large" />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">Xác Nhận</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
