import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

// Dữ liệu mô phỏng cho tất cả vòi bơm
const mockPumps = Array.from({ length: 4 }).map((_, i) => {
  const isE10 = i < 3;
  return {
    id: i + 1,
    fuel: isE10 ? 'E10' : 'DO_II',
    serial: isE10 ? 113 + i : 111,
    moneyCa: Math.floor(Math.random() * 1000000000 + 500000000),
    moneyLuu: Math.floor(Math.random() * 1000000000 + 500000000),
    litCa: (Math.random() * 50000 + 10000).toFixed(3),
    litLuu: (Math.random() * 50000 + 10000).toFixed(3),
    lanBanCa: Math.floor(Math.random() * 10000 + 5000),
    lanBanLuu: Math.floor(Math.random() * 10000 + 5000),
    price: isE10 ? '20.550' : '23.320'
  };
});

// Chuyển đổi dữ liệu để mỗi vòi thành 2 dòng (Ca và Lưu)
const tableData = [];
mockPumps.forEach(pump => {
  // Dòng Tổng Ca (trên)
  tableData.push({
    key: `${pump.id}_ca`,
    isFirstRow: true,
    id: pump.id,
    fuel: pump.fuel,
    serial: pump.serial,
    money: pump.moneyCa.toLocaleString('vi-VN'),
    lit: pump.litCa.toLocaleString('vi-VN'),
    lanBan: pump.lanBanCa.toLocaleString('vi-VN'),
    price: pump.price,
    rowSpan: 2 // Sẽ gộp các ô chung (Vòi, Nhiên Liệu, Serial, Giá)
  });
  // Dòng Tổng Lưu (dưới)
  tableData.push({
    key: `${pump.id}_luu`,
    isFirstRow: false,
    id: pump.id,
    fuel: pump.fuel,
    serial: pump.serial,
    money: pump.moneyLuu.toLocaleString('vi-VN'),
    lit: pump.litLuu.toLocaleString('vi-VN'),
    lanBan: pump.lanBanLuu.toLocaleString('vi-VN'),
    price: pump.price,
    rowSpan: 0 // Bị gộp
  });
});

export const ChotSo = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Vòi',
      dataIndex: 'id',
      align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    },
    {
      title: 'Nhiên Liệu',
      dataIndex: 'fuel',
      align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (text) => <span className={text === 'E10' ? 'text-green-600' : 'text-orange-500'}>{text}</span>
    },
    {
      title: 'Serial',
      dataIndex: 'serial',
      align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    },
    {
      title: 'Tổng Số Tiền',
      dataIndex: 'money',
      align: 'center'
    },
    {
      title: 'Tổng Số Lít',
      dataIndex: 'lit',
      align: 'center'
    },
    {
      title: 'Tổng Lần Bán',
      dataIndex: 'lanBan',
      align: 'center'
    },
    {
      title: 'Giá Bán Hiện Tại',
      dataIndex: 'price',
      align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    }
  ];

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-[#0b1120] min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center p-2 border-b-2 border-blue-900 bg-white dark:bg-gray-800 shadow-sm mb-4">
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2"
          onClick={() => navigate('/')}
        >
          Trang Chủ
        </div>
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2">
          Tải Lại Số Liệu
        </div>
      </div>

      {/* Main Table */}
      <div className="px-4">
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="small"
            rowClassName={(record) =>
              record.isFirstRow ? "bg-white dark:bg-gray-800 text-center text-xs dark:text-gray-200" : "bg-white dark:bg-gray-800 text-center text-xs dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700"
            }
            components={{
              header: {
                cell: (props) => <th {...props} className="bg-blue-900 text-white text-center text-xs font-bold py-3" />
              }
            }}
          />
        </div>
        <div className="text-center text-gray-500 text-xs mt-4">
          Copyright © 2026 - Công ty DVN Technology
        </div>
      </div>
    </div>
  );
};
