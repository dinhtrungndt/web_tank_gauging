import React from 'react';
import { Table, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Pumps } from './Pumps';
import { Tanks } from './Tanks';

const mockTransactions = [
  { id: 1, date: '16/07/2026', time: '20:11:51', plate: '51K-50687', money: '50.000', vol: '2,131', price: '23.456', company: 'Cty Montech', note: '' },
  { id: 2, date: '16/07/2026', time: '20:11:20', plate: '51D-11644', money: '200.000', vol: '8,526', price: '23.456', company: 'Cty Tai Viet', note: '' },
  { id: 3, date: '16/07/2026', time: '20:11:05', plate: '51C-77899', money: '150.000', vol: '6,394', price: '23.456', company: 'Cty Montech', note: '' },
  { id: 4, date: '16/07/2026', time: '20:10:52', plate: '51D-11644', money: '100.000', vol: '4,263', price: '23.456', company: 'Cty Tai Viet', note: '' },
  { id: 5, date: '16/07/2026', time: '20:10:42', plate: '51D-11644', money: '100.000', vol: '4,263', price: '23.456', company: 'Cty Tai Viet', note: '' },
  { id: 6, date: '16/07/2026', time: '20:10:31', plate: '51D-11644', money: '88.000', vol: '3,751', price: '23.456', company: 'Cty Tai Viet', note: '' },
  { id: 7, date: '16/07/2026', time: '19:54:29', plate: '51K-50687', money: '500.000', vol: '21,316', price: '23.456', company: 'Cty Montech', note: '' },
  { id: 8, date: '', time: '', plate: '', money: '', vol: '', price: '', company: '', note: '' },
  { id: 9, date: '', time: '', plate: '', money: '', vol: '', price: '', company: '', note: '' },
  { id: 10, date: '', time: '', plate: '', money: '', vol: '', price: '', company: '', note: '' },
];

export const Home = () => {
  const navigate = useNavigate();

  const transactionColumns = [
    { title: 'STT', dataIndex: 'id', key: 'id', align: 'center', width: 60 },
    { title: 'Ngày', dataIndex: 'date', key: 'date', align: 'center' },
    { title: 'Giờ', dataIndex: 'time', key: 'time', align: 'center' },
    { title: 'Biển Số Xe', dataIndex: 'plate', key: 'plate', align: 'center' },
    { title: 'Số Tiền', dataIndex: 'money', key: 'money', align: 'center' },
    { title: 'Số Lít', dataIndex: 'vol', key: 'vol', align: 'center' },
    { title: 'Đơn Giá', dataIndex: 'price', key: 'price', align: 'center' },
    { title: 'Công Ty', dataIndex: 'company', key: 'company', align: 'center' },
    { title: 'Ghi Chú', dataIndex: 'note', key: 'note', align: 'center' },
    { 
      title: 'Chi Tiết', 
      key: 'action',
      align: 'center',
      render: (_, record) => record.date ? (
        <a className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => navigate('/cards')}>Xem</a>
      ) : null
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
            rowClassName="text-center text-xs bg-white dark:bg-gray-800 dark:text-gray-200"
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
