import React from 'react';
import { Table, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Pumps } from './Pumps';
import { Tanks } from './Tanks';

const mockTransactions = Array.from({ length: 5 }).map((_, i) => ({
  id: `GD${(i + 1).toString().padStart(4, '0')}`,
  time: `17/07/2026 1${Math.floor(i/6)}:${(i%6)*10}`,
  uid: i % 2 === 0 ? 'A1B2C3D4' : 'E5F6G7H8',
  owner: i % 2 === 0 ? 'Nguyễn Văn A' : 'Công ty TNHH Vận Tải XYZ',
  pump: `MT000${(i % 5) + 1}`,
  fuel: i % 2 === 0 ? 'Xăng E10' : 'Dầu Điêzen',
  volume: (Math.random() * 50 + 2).toFixed(2),
  total: Math.floor(Math.random() * 1000000 + 50000),
}));

export const Home = () => {
  const navigate = useNavigate();

  const transactionColumns = [
    { title: 'STT', key: 'stt', align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Ngày', dataIndex: 'date', key: 'date', render: () => '16/07/2026' },
    { title: 'Giờ', dataIndex: 'time', key: 'time', render: (val) => val.split(' ')[1] || '20:11:51' },
    { title: 'Biển Số Xe', dataIndex: 'licensePlate', key: 'licensePlate', render: (_, __, i) => i % 2 === 0 ? '51K-50687' : '51D-11644' },
    { title: 'Số Tiền', dataIndex: 'total', key: 'total', align: 'right', render: (val) => val.toLocaleString() },
    { title: 'Số Lít', dataIndex: 'volume', key: 'volume', align: 'right' },
    { title: 'Đơn Giá', key: 'price', align: 'right', render: () => '23.456' },
    { title: 'Công Ty', dataIndex: 'owner', key: 'owner' },
    { title: 'Ghi Chú', key: 'note' },
    { 
      title: 'Chi Tiết', 
      key: 'action',
      align: 'center',
      render: () => <a className="text-blue-600 font-bold hover:underline" onClick={() => navigate('/cards')}>Xem</a>
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. TRỤ BƠM */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-blue-900 dark:text-blue-400 font-bold text-lg m-0 uppercase">Trụ Bơm</h2>
        </div>
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Pumps isDashboard={true} />
        </div>
      </section>

      {/* 2. BỒN NHIÊN LIỆU */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-blue-900 dark:text-blue-400 font-bold text-lg m-0 uppercase">Bồn Nhiên Liệu</h2>
        </div>
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2">
          <Tanks isDashboard={true} />
        </div>
      </section>

      {/* 3. BÁN HÀNG DÙNG THẺ */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-blue-900 dark:text-blue-400 font-bold text-lg m-0 uppercase">Bán Hàng Dùng Thẻ</h2>
        </div>
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Table 
            columns={transactionColumns} 
            dataSource={mockTransactions} 
            rowKey="id" 
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
            bordered
            rowClassName="text-center text-xs"
            components={{
              header: {
                cell: (props) => <th {...props} className="bg-blue-900 text-white text-center text-xs font-bold" />
              }
            }}
          />
        </div>
      </section>
    </div>
  );
};
