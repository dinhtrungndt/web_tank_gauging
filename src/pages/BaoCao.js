import { Button, Form, Input, Modal, Table } from 'antd';
import React from 'react';
import toast from 'react-hot-toast';
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
        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-orange-500 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng DO:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">1.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">60.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-orange-500 text-xs border-b border-gray-200 dark:border-gray-700">
          <Table.Summary.Cell index={0} colSpan={4} align="center"></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">1.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">60.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>

        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-green-600 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng {title.toLowerCase()}:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">4.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">180.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-green-600 text-xs border-b border-gray-200 dark:border-gray-700">
          <Table.Summary.Cell index={0} colSpan={4} align="center"></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">4.500.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">180.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>

        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-blue-800 dark:text-blue-400 text-xs">
          <Table.Summary.Cell index={0} colSpan={4} align="center">Tổng {title.toLowerCase()}:</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">6.000.000</Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={2} />
          <Table.Summary.Cell index={3} align="center">240.000</Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
        </Table.Summary.Row>
        <Table.Summary.Row className="bg-white dark:bg-gray-800 font-bold text-blue-800 dark:text-blue-400 text-xs border-b border-gray-200 dark:border-gray-700">
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
    <div className="mb-8 border border-gray-300 dark:border-gray-700 rounded shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
      {/* Search Header for Shift */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <Button type="primary" className={`${buttonColor} border-none font-bold min-w-[120px]`}>{title}</Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Ngày</span>
            <input type="date" defaultValue="2026-07-15" className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Ngày</span>
            <input type="date" defaultValue="2026-07-16" className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Giờ</span>
            <input type="time" step="1" defaultValue={shiftMultiplier === 1 ? "21:00:00" : shiftMultiplier === 2 ? "05:00:00" : "13:00:00"} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Giờ</span>
            <input type="time" step="1" defaultValue={shiftMultiplier === 1 ? "05:00:00" : shiftMultiplier === 2 ? "13:00:00" : "21:00:00"} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
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
          record.isFirstRow ? "bg-white dark:bg-gray-800 text-center text-xs dark:text-gray-200" : "bg-white dark:bg-gray-800 text-center text-xs dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700"
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
  const [khungThoiGianModalOpen, setKhungThoiGianModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const handleSaveKhungThoiGian = (values) => {
    toast.success('Lưu cài đặt thành công!');
    setKhungThoiGianModalOpen(false);
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-[#0b1120] min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center p-2 border-b-2 border-[#0f3460] bg-white dark:bg-gray-800 shadow-sm mb-4">
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2"
          onClick={() => navigate('/')}
        >
          Trang Chủ
        </div>
        <div className="flex flex-col items-center flex-1">
          {/* Empty spacer since AppLayout handles the global header */}
        </div>
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2"
          onClick={() => setKhungThoiGianModalOpen(true)}
        >
          Khung Thời Gian
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <ShiftTable title="CA BÁN 1" shiftMultiplier={1} buttonColor="bg-blue-600" />
        <ShiftTable title="CA BÁN 2" shiftMultiplier={2} buttonColor="bg-blue-600" />
        <ShiftTable title="CA BÁN 3" shiftMultiplier={3} buttonColor="bg-blue-600" />

        {/* Global Summary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-sm overflow-hidden mt-4 mb-8">
          <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-bold text-red-500">
            Tổng Trạm
          </div>
          <div className="flex flex-col text-xs">
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-orange-500 border-r border-gray-200">Tổng DO:</div>
              <div className="w-1/2 p-2 text-center font-bold text-gray-800">4.500.000 <br /> 4.500.000</div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-green-600 border-r border-gray-200">Tổng E10:</div>
              <div className="w-1/2 p-2 text-center font-bold text-gray-800">13.500.000 <br /> 13.500.000</div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 p-2 text-right font-bold text-red-500 border-r border-gray-200">Tổng trạm:</div>
              <div className="w-1/2 p-2 text-center font-bold text-red-500">18.000.000 <br /> 18.000.000</div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-[10px] pb-4">
          Copyright © 2026 - Công ty DVN Technology
        </div>
      </div>

      {/* Modal Khung Thời Gian */}
      <Modal
        title={<div className="text-xl font-bold text-[#0f3460] text-center mb-2">Cài Đặt Khung Thời Gian</div>}
        open={khungThoiGianModalOpen}
        onCancel={() => setKhungThoiGianModalOpen(false)}
        footer={null}
        width={500}
        className="dark:bg-gray-800"
      >
        <Form form={form} layout="horizontal" onFinish={handleSaveKhungThoiGian} initialValues={{
          ca1_start: '210000', ca1_end: '050000',
          ca2_start: '050000', ca2_end: '130000',
          ca3_start: '130000', ca3_end: '210000'
        }}>

          <div className="py-2 border-b border-gray-200">
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

          <div className="py-2 border-b border-gray-200 mt-2">
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

          <div className="py-2 mt-2">
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

          <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center mt-4">
            <p className="text-xs text-gray-500 mb-4">Nhập thời gian theo định dạng <strong>hhmmss</strong>, ví dụ <strong>060000</strong> là 06:00:00.</p>
            <Button type="primary" htmlType="submit" className="w-full bg-[#1677ff] h-10 text-base font-bold rounded">
              Lưu Cài Đặt
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
