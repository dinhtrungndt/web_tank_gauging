import React from 'react';
import { Table, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const generateMockDataForShift = (shiftMultiplier) => {
  const pumps = [];
  for (let i = 1; i <= 4; i++) {
    const isE10 = i < 4;
    pumps.push({
      key: `${i}_1`,
      isFirstRow: true,
      id: i,
      fuel: isE10 ? 'E10' : 'DO_II',
      serial: isE10 ? 112 + i : 111,
      moneyStart: (1000000000 * shiftMultiplier + i * 10000000).toLocaleString('vi-VN'),
      moneyEnd: (1000000000 * shiftMultiplier + i * 10000000 + 1500000).toLocaleString('vi-VN'),
      moneyTotal: (1500000).toLocaleString('vi-VN'),
      litStart: (40000000 + i * 500000).toLocaleString('vi-VN'),
      litEnd: (40000000 + i * 500000 + 60000).toLocaleString('vi-VN'),
      litTotal: (60000).toLocaleString('vi-VN'),
      rowSpan: 2
    });
    pumps.push({
      key: `${i}_2`,
      isFirstRow: false,
      id: i,
      fuel: isE10 ? 'E10' : 'DO_II',
      serial: isE10 ? 112 + i : 111,
      moneyStart: (1000000000 * shiftMultiplier + i * 10000000).toLocaleString('vi-VN'),
      moneyEnd: (1000000000 * shiftMultiplier + i * 10000000 + 1500000).toLocaleString('vi-VN'),
      moneyTotal: (1500000).toLocaleString('vi-VN'),
      litStart: (40000000 + i * 500000).toLocaleString('vi-VN'),
      litEnd: (40000000 + i * 500000 + 60000).toLocaleString('vi-VN'),
      litTotal: (60000).toLocaleString('vi-VN'),
      rowSpan: 0
    });
  }
  return pumps;
};

const ShiftTable = ({ title, shiftMultiplier, buttonColor }) => {
  const dataSource = generateMockDataForShift(shiftMultiplier);

  const columns = [
    { 
      title: 'Vòi', dataIndex: 'id', align: 'center', width: 60,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    },
    { 
      title: 'Nhiên Liệu', dataIndex: 'fuel', align: 'center', width: 80,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (text) => <span className={text === 'E10' ? 'text-green-600 font-bold' : 'text-orange-500 font-bold'}>{text}</span>
    },
    { 
      title: 'Serial', dataIndex: 'serial', align: 'center', width: 80,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    },
    {
      title: 'Số Tiền',
      children: [
        { title: 'Bắt Đầu', dataIndex: 'moneyStart', align: 'center' },
        { title: 'Kết Thúc', dataIndex: 'moneyEnd', align: 'center' },
      ]
    },
    { 
      title: 'Tổng Số Tiền', dataIndex: 'moneyTotal', align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (text) => <span className="font-bold">{text}</span>
    },
    {
      title: 'Số Lít',
      children: [
        { title: 'Bắt Đầu', dataIndex: 'litStart', align: 'center' },
        { title: 'Kết Thúc', dataIndex: 'litEnd', align: 'center' },
      ]
    },
    { 
      title: 'Tổng Số Lít', dataIndex: 'litTotal', align: 'center',
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (text) => <span className="font-bold">{text}</span>
    },
    {
      title: 'Tải Về', align: 'center', width: 60,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (_, record) => (
        <span 
          className="text-blue-600 font-bold cursor-pointer hover:underline text-lg"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
              "Vòi,Nhiên Liệu,Serial,Số Tiền Bắt Đầu,Số Tiền Kết Thúc,Tổng Số Tiền,Số Lít Bắt Đầu,Số Lít Kết Thúc,Tổng Số Lít\n" +
              `${record.id},${record.fuel},${record.serial},"${record.moneyStart}","${record.moneyEnd}","${record.moneyTotal}","${record.litStart}","${record.litEnd}","${record.litTotal}"`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `BaoCao_Voi_${record.id}_${title}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >↓</span>
      )
    }
  ];

  const summary = (pageData) => {
    return (
      <Table.Summary>
        <Table.Summary.Row className="bg-white font-bold text-orange-500 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng DO:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">1.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">60.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white font-bold text-orange-500 text-xs border-b border-gray-200">
          <Table.Summary.Cell index={0} colSpan={4} align="center"></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">1.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">60.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>

        <Table.Summary.Row className="bg-white font-bold text-green-600 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng E10:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">4.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">180.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white font-bold text-green-600 text-xs border-b border-gray-200">
          <Table.Summary.Cell index={0} colSpan={4} align="center"></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">4.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">180.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>

        <Table.Summary.Row className="bg-white font-bold text-blue-800 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng {title.toLowerCase()}:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">6.000.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">240.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white font-bold text-blue-800 text-xs border-b border-gray-200">
          <Table.Summary.Cell index={0} colSpan={4} align="center"></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">6.000.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">240.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <div className="mb-8 border border-gray-300 rounded shadow-sm bg-white overflow-hidden">
      {/* Search Header for Shift */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <Button type="primary" className={`${buttonColor} border-none font-bold min-w-[120px]`}>{title}</Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Ngày</span>
            <Input size="small" defaultValue="150726" className="text-center" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Ngày</span>
            <Input size="small" defaultValue="160726" className="text-center" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Giờ</span>
            <Input size="small" defaultValue={shiftMultiplier === 1 ? "210000" : shiftMultiplier === 2 ? "050000" : "130000"} className="text-center" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Giờ</span>
            <Input size="small" defaultValue={shiftMultiplier === 1 ? "050000" : shiftMultiplier === 2 ? "130000" : "210000"} className="text-center" />
          </div>
        </div>
      </div>
      
      {/* Table */}
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        pagination={false} 
        bordered
        size="small"
        rowClassName={(record) => 
          record.isFirstRow ? "bg-white text-center text-xs" : "bg-white text-center text-xs border-b-2 border-gray-200"
        }
        components={{
          header: {
            cell: (props) => <th {...props} className="bg-[#0f3460] text-white text-center text-[10px] font-bold p-1" />
          }
        }}
        summary={summary}
      />
    </div>
  );
};

export const BaoCao = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center p-2 border-b-2 border-[#0f3460] bg-white shadow-sm mb-4">
        <div 
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2"
          onClick={() => navigate('/')}
        >
          Trang Chủ
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-red-600 font-bold text-lg uppercase mb-0">Cửa Hàng Xăng Dầu MONTECH</h1>
          <div className="text-[10px] text-gray-800 font-medium">51 Trần Thị Trọng - Phường Tân Sơn - Tp. Hồ Chí Minh</div>
          <div className="text-[10px] font-bold text-blue-800 mt-1">16/07/2026 20:16:46</div>
          <div className="text-[10px] font-bold text-green-600">Đang Kết Nối 2</div>
        </div>
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2">
          Khung Thời Gian
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <ShiftTable title="CA BÁN 1" shiftMultiplier={1} buttonColor="bg-blue-600" />
        <ShiftTable title="CA BÁN 2" shiftMultiplier={2} buttonColor="bg-blue-600" />
        <ShiftTable title="CA BÁN 3" shiftMultiplier={3} buttonColor="bg-blue-600" />

        {/* Global Summary */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden mt-4 mb-8">
          <div className="text-center py-2 bg-gray-50 border-b border-gray-200 font-bold text-red-500">
            Tổng Trạm
          </div>
          <div className="flex flex-col text-xs">
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-orange-500 border-r border-gray-200">Tổng DO:</div>
              <div className="w-1/2 p-2 text-center font-bold text-gray-800">4.500.000 <br/> 4.500.000</div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-green-600 border-r border-gray-200">Tổng E10:</div>
              <div className="w-1/2 p-2 text-center font-bold text-gray-800">13.500.000 <br/> 13.500.000</div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-red-500 border-r border-gray-200">Tổng trạm:</div>
              <div className="w-1/2 p-2 text-center font-bold text-red-500">18.000.000 <br/> 18.000.000</div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-[10px] pb-4">
          Copyright © 2026 - Công ty TNHH Kỹ Thuật Mon
        </div>
      </div>
    </div>
  );
};
