import React, { useState, useMemo } from 'react';
import { Button, Input, Form, Select, Switch, Table, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

const { Option } = Select;

const initialPrepaid = [
  { id: '1', uid: '1CBF99F5', plate: '51K-50687', totalMoney: 550000, totalVol: 23.447, totalTopup: 10000000, balance: 9450000, company: 'Cty Montech', note: '' },
];

const initialPostpaid = [
  { id: '1', uid: '1C01BEF5', plate: '51D-11644', totalMoney: 488000, totalVol: 20.803, totalTopup: 0, balance: 0, company: 'Cty Tai Viet', note: '' },
  { id: '2', uid: '66C01EB7', plate: '51C-77899', totalMoney: 150000, totalVol: 6.394, totalTopup: 0, balance: 0, company: 'Cty Montech', note: '' },
];

const formatNum = (num) => num.toLocaleString('vi-VN');
const formatVol = (num) => num.toLocaleString('vi-VN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export const Cards = () => {
  const navigate = useNavigate();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Search states
  const [searchPlate, setSearchPlate] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  
  const [filterPlate, setFilterPlate] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  const handleSearch = () => {
    setFilterPlate(searchPlate.trim().toLowerCase());
    setFilterCompany(searchCompany.trim().toLowerCase());
    toast.success('Đã lọc danh sách thẻ!');
  };

  const filteredPrepaid = useMemo(() => {
    return initialPrepaid.filter(c => 
      c.plate.toLowerCase().includes(filterPlate) && 
      c.company.toLowerCase().includes(filterCompany)
    );
  }, [filterPlate, filterCompany]);

  const filteredPostpaid = useMemo(() => {
    return initialPostpaid.filter(c => 
      c.plate.toLowerCase().includes(filterPlate) && 
      c.company.toLowerCase().includes(filterCompany)
    );
  }, [filterPlate, filterCompany]);

  const handleSaveForm = (values) => {
    const action = values.func;
    if (action === 'Xóa Thẻ') {
      toast.success(`Đã xóa thẻ ${values.uid}!`);
    } else if (action === 'RESET thẻ') {
      toast.success(`Đã reset số liệu bơm của thẻ ${values.uid}!`);
    } else if (action === 'RESET tất cả thẻ') {
      toast.success('Đã reset toàn bộ dữ liệu của tất cả thẻ!');
    } else {
      toast.success('Đã lưu thông tin thẻ thành công!');
    }
    setSettingsModalOpen(false);
  };

  const handleOpenCard = (record) => {
    form.setFieldsValue({
      func: 'Chỉnh sửa thẻ',
      uid: record.uid,
      type: record.totalTopup > 0 ? 'Trả trước' : 'Trả sau',
      plate: record.plate,
      company: record.company,
      note: record.note,
      topupTotal: formatNum(record.totalTopup),
      balance: formatNum(record.balance),
      addMoney: '0',
      addQuick: '0',
      allow: true
    });
    setSettingsModalOpen(true);
  };

  const columns = [
    { title: 'STT', dataIndex: 'id', key: 'id', align: 'center', width: 60 },
    { 
      title: 'Mã Thẻ', 
      dataIndex: 'uid', 
      key: 'uid', 
      align: 'center', 
      render: (val, record) => (
        <span 
          className="text-blue-500 font-bold cursor-pointer hover:underline"
          onClick={() => handleOpenCard(record)}
        >
          {val}
        </span>
      ) 
    },
    { title: 'Biển Số Xe', dataIndex: 'plate', key: 'plate', align: 'center' },
    { title: 'Tổng Tiền Đã Bơm', dataIndex: 'totalMoney', key: 'totalMoney', align: 'center', render: formatNum },
    { title: 'Tổng Lít Đã Bơm', dataIndex: 'totalVol', key: 'totalVol', align: 'center', render: formatVol },
    { title: 'Tổng Tiền Nạp Thẻ', dataIndex: 'totalTopup', key: 'totalTopup', align: 'center', render: formatNum },
    { title: 'Tiền Dư Còn Lại', dataIndex: 'balance', key: 'balance', align: 'center', render: formatNum },
    { title: 'Tên Công Ty', dataIndex: 'company', key: 'company', align: 'center' },
    { title: 'Ghi Chú', dataIndex: 'note', key: 'note', align: 'center' },
    { 
      title: 'Tải Về', 
      key: 'action', 
      align: 'center', 
      render: (_, record) => (
        <div 
          className="flex justify-center items-center h-full text-blue-600 cursor-pointer"
          onClick={() => toast.success(`Đã tải về lịch sử của thẻ ${record.uid} (CSV)!`)}
        >
          <ArrowDown size={16} className="stroke-[3px] hover:scale-125 transition-transform" />
        </div>
      ) 
    },
  ];

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center p-2 border-b-2 border-[#0f3460] bg-white shadow-sm mb-4">
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2" onClick={() => navigate('/')}>Trang Chủ</div>
        <div className="flex gap-16 text-sm font-bold text-blue-800">
          <span 
            className="cursor-pointer hover:underline" 
            onClick={() => {
              form.resetFields();
              setSettingsModalOpen(true);
            }}
          >
            Cài Đặt Thẻ
          </span>
          <span 
            className="cursor-pointer hover:underline"
            onClick={() => toast.success('Đã tải về toàn bộ lịch sử thẻ (CSV)!')}
          >
            Tải File
          </span>
        </div>
        <div className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2" onClick={() => navigate('/doi-mat-khau')}>Đổi Mật Khẩu</div>
      </div>

      <div className="px-4">
        {/* Search */}
        <div className="mb-4 text-xs font-bold text-gray-700">
          <div className="flex gap-4 mb-2">
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Từ Ngày</span>
              <input type="text" defaultValue="160726" className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Đến Ngày</span>
              <input type="text" defaultValue="160726" className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Từ Giờ</span>
              <input type="text" defaultValue="000000" className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Đến Giờ</span>
              <input type="text" defaultValue="235959" className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" />
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Biển Số Xe</span>
              <input 
                type="text" 
                placeholder="Nhập số xe..." 
                className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" 
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="mb-1">Tên Công Ty</span>
              <input 
                type="text" 
                placeholder="Nhập tên..." 
                className="w-full text-center border border-gray-300 rounded p-1 outline-none font-normal" 
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
            </div>
          </div>
          <Button type="primary" className="w-full bg-[#1677ff] font-bold" onClick={handleSearch}>TÌM KIẾM</Button>
        </div>

        {/* Tables */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="text-red-500 font-bold p-2 text-sm">THẺ TRẢ TRƯỚC</div>
          <Table
            columns={columns}
            dataSource={filteredPrepaid}
            pagination={false}
            size="small"
            bordered
            rowClassName="text-xs"
            components={{ header: { cell: (props) => <th {...props} className="bg-[#0f3460] text-white text-xs font-normal" /> } }}
            summary={(pageData) => {
              let totalMoney = 0; let totalVol = 0; let totalTopup = 0; let totalBal = 0;
              pageData.forEach(({ totalMoney: m, totalVol: v, totalTopup: t, balance: b }) => {
                totalMoney += m; totalVol += v; totalTopup += t; totalBal += b;
              });
              return (
                <Table.Summary.Row className="font-bold text-xs">
                  <Table.Summary.Cell index={0} colSpan={3} align="right">Tổng:</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">{formatNum(totalMoney)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">{formatVol(totalVol)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">{formatNum(totalTopup)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">{formatNum(totalBal)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />

          <div className="text-red-500 font-bold p-2 text-sm mt-4">THẺ TRẢ SAU</div>
          <Table
            columns={columns}
            dataSource={filteredPostpaid}
            pagination={false}
            size="small"
            bordered
            rowClassName="text-xs"
            components={{ header: { cell: (props) => <th {...props} className="bg-[#0f3460] text-white text-xs font-normal" /> } }}
            summary={(pageData) => {
              let totalMoney = 0; let totalVol = 0; let totalTopup = 0; let totalBal = 0;
              pageData.forEach(({ totalMoney: m, totalVol: v, totalTopup: t, balance: b }) => {
                totalMoney += m; totalVol += v; totalTopup += t; totalBal += b;
              });
              return (
                <Table.Summary.Row className="font-bold text-xs">
                  <Table.Summary.Cell index={0} colSpan={3} align="right">Tổng:</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">{formatNum(totalMoney)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">{formatVol(totalVol)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">{totalTopup === 0 ? '0' : formatNum(totalTopup)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">{totalBal === 0 ? '0' : formatNum(totalBal)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </div>
        
        <div className="text-center text-gray-500 text-[10px] mt-4 pb-4">
          Copyright © 2026 - Công ty TNHH Kỹ Thuật Mon
        </div>
      </div>

      <Modal
        title={<div className="text-xl font-bold text-[#0f3460] text-center mb-2">Cài Đặt Thẻ</div>}
        open={settingsModalOpen}
        onCancel={() => setSettingsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={handleSaveForm}
          initialValues={{
            func: 'Thêm thẻ',
            uid: '',
            type: 'Trả sau',
            plate: '',
            company: '',
            note: '',
            topupTotal: '0',
            balance: '0',
            addMoney: '0',
            addQuick: '0',
            allow: true
          }}
        >
          <Form.Item label={<span className="font-bold text-[#0f3460]">Chức Năng</span>} name="func">
            <Select>
              <Option value="Thêm thẻ">Thêm thẻ</Option>
              <Option value="Chỉnh sửa thẻ">Chỉnh sửa thẻ</Option>
              <Option value="Xóa Thẻ">Xóa Thẻ</Option>
              <Option value="RESET thẻ">RESET thẻ</Option>
              <Option value="RESET tất cả thẻ">RESET tất cả thẻ</Option>
            </Select>
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Mã Thẻ</span>} name="uid">
            <Input className="text-center" />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Loại Thẻ</span>} name="type">
            <Select>
              <Option value="Trả sau">Trả sau</Option>
              <Option value="Trả trước">Trả trước</Option>
            </Select>
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Biển Số Xe</span>} name="plate">
            <Input className="text-center" />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Tên Công Ty</span>} name="company">
            <Input className="text-center font-bold" />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Ghi Chú</span>} name="note">
            <Input className="text-center text-gray-400" placeholder="Nhập ghi chú" />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Tổng Tiền Nạp</span>} name="topupTotal">
            <Input className="text-center bg-gray-100" readOnly />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Tiền Dư Còn Lại</span>} name="balance">
            <Input className="text-center bg-gray-100" readOnly />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Nạp Thêm Tiền</span>} name="addMoney">
            <Input className="text-center" />
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Nạp Thêm Nhanh</span>} name="addQuick">
            <Select>
              <Option value="0">0</Option>
              <Option value="100000">100.000</Option>
              <Option value="200000">200.000</Option>
              <Option value="500000">500.000</Option>
              <Option value="1000000">1.000.000</Option>
              <Option value="2000000">2.000.000</Option>
              <Option value="3000000">3.000.000</Option>
              <Option value="4000000">4.000.000</Option>
              <Option value="5000000">5.000.000</Option>
            </Select>
          </Form.Item>
          <Form.Item label={<span className="font-bold text-[#0f3460]">Cho Phép</span>} name="allow" valuePropName="checked">
            <Switch className="bg-gray-300" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full bg-[#1677ff] font-bold h-10 rounded">
            XÁC NHẬN
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
