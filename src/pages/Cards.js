import React, { useState } from 'react';
import { Table, Button, Form, Input, InputNumber, Select, Switch, Row, Col, DatePicker, Card, Divider } from 'antd';
import { Search, Download, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const { RangePicker } = DatePicker;

// Dữ liệu giả lập
const initialCards = [
  { id: '1', uid: '1CBF99F5', licensePlate: '51K-50687', type: 'Trả trước', pumpedMoney: 550000, pumpedVolume: 23.447, totalTopup: 10000000, balance: 9450000, company: 'Cty Montech', note: '', allow: true },
  { id: '2', uid: '1C01BEF5', licensePlate: '51D-11644', type: 'Trả sau', pumpedMoney: 488000, pumpedVolume: 20.803, totalTopup: 0, balance: 0, company: 'Cty Tai Viet', note: '', allow: true },
  { id: '3', uid: '66C01EB7', licensePlate: '51C-77899', type: 'Trả sau', pumpedMoney: 150000, pumpedVolume: 6.394, totalTopup: 0, balance: 0, company: 'Cty Montech', note: '', allow: true },
];

export const Cards = () => {
  const [cards, setCards] = useState(initialCards);
  const [form] = Form.useForm();
  
  // Trạng thái form
  const [formMode, setFormMode] = useState('Thêm thẻ'); // 'Thêm thẻ' | 'Chỉnh sửa thẻ'
  const [selectedCardId, setSelectedCardId] = useState(null);

  // Phân loại thẻ
  const prepaidCards = cards.filter(c => c.type === 'Trả trước');
  const postpaidCards = cards.filter(c => c.type === 'Trả sau');

  // Xử lý khi Submit Form (Thêm/Sửa/Nạp tiền)
  const handleSubmitForm = (values) => {
    if (formMode === 'Thêm thẻ') {
      const newCard = {
        id: Date.now().toString(),
        uid: values.uid,
        licensePlate: values.licensePlate || '',
        type: values.type,
        pumpedMoney: 0,
        pumpedVolume: 0,
        totalTopup: values.topup || 0,
        balance: values.topup || 0,
        company: values.company || '',
        note: values.note || '',
        allow: values.allow !== false,
      };
      setCards([...cards, newCard]);
      toast.success('Đã thêm thẻ mới thành công!');
    } else {
      // Chỉnh sửa hoặc nạp tiền
      setCards(cards.map(c => {
        if (c.uid === values.uid) {
          const addedMoney = values.topup || 0;
          return {
            ...c,
            licensePlate: values.licensePlate,
            type: values.type,
            company: values.company,
            note: values.note,
            allow: values.allow,
            totalTopup: c.totalTopup + addedMoney,
            balance: c.balance + addedMoney,
          };
        }
        return c;
      }));
      toast.success('Đã cập nhật thông tin thẻ!');
    }
    form.resetFields();
    setFormMode('Thêm thẻ');
  };

  // Nạp tiền nhanh (gán giá trị vào ô Nạp Thêm Tiền)
  const handleFastTopupChange = (value) => {
    if (value) {
      form.setFieldsValue({ topup: value });
    }
  };

  // Chọn thẻ từ bảng để chỉnh sửa
  const handleSelectCard = (record) => {
    setFormMode('Chỉnh sửa thẻ');
    setSelectedCardId(record.id);
    form.setFieldsValue({
      action: 'Chỉnh sửa thẻ',
      uid: record.uid,
      type: record.type,
      licensePlate: record.licensePlate,
      company: record.company,
      note: record.note,
      totalTopupDisplay: record.totalTopup,
      balanceDisplay: record.balance,
      topup: 0,
      allow: record.allow,
    });
    // Scroll lên form (tuỳ chọn)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cột cho bảng
  const columns = [
    { title: 'STT', key: 'stt', width: 60, align: 'center', render: (_, __, index) => index + 1 },
    { 
      title: 'Mã Thẻ', 
      dataIndex: 'uid', 
      key: 'uid',
      render: (text, record) => (
        <a className="text-blue-600 font-bold font-mono" onClick={() => handleSelectCard(record)}>{text}</a>
      )
    },
    { title: 'Biển Số Xe', dataIndex: 'licensePlate', key: 'licensePlate', align: 'center' },
    { title: 'Tổng Tiền Đã Bơm', dataIndex: 'pumpedMoney', key: 'pumpedMoney', align: 'right', render: val => val.toLocaleString() },
    { title: 'Tổng Lít Đã Bơm', dataIndex: 'pumpedVolume', key: 'pumpedVolume', align: 'right', render: val => val.toFixed(3) },
    { title: 'Tổng Tiền Nạp', dataIndex: 'totalTopup', key: 'totalTopup', align: 'right', render: val => val.toLocaleString() },
    { title: 'Tiền Dư Còn Lại', dataIndex: 'balance', key: 'balance', align: 'right', render: val => <span className="font-bold text-green-600">{val.toLocaleString()}</span> },
    { title: 'Tên Công Ty', dataIndex: 'company', key: 'company' },
    { title: 'Ghi Chú', dataIndex: 'note', key: 'note' },
    { 
      title: 'Tải Về', 
      key: 'download',
      align: 'center',
      render: () => <Button type="text" icon={<Download size={16} className="text-blue-600" />} />
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cài Đặt Thẻ (RFID)</h2>
          <p className="text-gray-500 dark:text-gray-400">Đăng ký thẻ trả trước/trả sau, nạp tiền và theo dõi công nợ.</p>
        </div>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700" bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={6}>
            <div className="text-xs text-gray-500 mb-1">Thời gian</div>
            <RangePicker className="w-full" format="DD/MM/YYYY" />
          </Col>
          <Col xs={24} md={5}>
            <div className="text-xs text-gray-500 mb-1">Biển Số Xe</div>
            <Input placeholder="Nhập số xe..." />
          </Col>
          <Col xs={24} md={5}>
            <div className="text-xs text-gray-500 mb-1">Tên Công Ty</div>
            <Input placeholder="Nhập tên..." />
          </Col>
          <Col xs={24} md={4}>
            <Button type="primary" className="bg-blue-600 w-full" icon={<Search size={16} />}>
              TÌM KIẾM
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={24} className="mt-2">
        {/* Form Cài Đặt Thẻ (Trái/Giữa) */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="flex items-center gap-2"><CreditCard size={18} /> Cài Đặt Thẻ</span>} 
            className="shadow-sm dark:bg-gray-800 dark:border-gray-700 sticky top-4"
          >
            <Form 
              form={form} 
              layout="horizontal" 
              labelCol={{ span: 8 }} 
              wrapperCol={{ span: 16 }}
              onFinish={handleSubmitForm}
              initialValues={{ action: 'Thêm thẻ', type: 'Trả trước', allow: true }}
              size="middle"
            >
              <Form.Item name="action" label="Chức Năng" className="mb-3">
                <Select 
                  options={[
                    { value: 'Thêm thẻ', label: 'Thêm thẻ' },
                    { value: 'Chỉnh sửa thẻ', label: 'Chỉnh sửa thẻ' },
                    { value: 'Xóa thẻ', label: 'Xóa thẻ' },
                    { value: 'Reset thẻ', label: 'Reset thẻ (Xóa DL bơm)' }
                  ]}
                  onChange={val => {
                    setFormMode(val);
                    if (val === 'Thêm thẻ') form.resetFields();
                  }}
                />
              </Form.Item>
              <Form.Item name="uid" label="Mã Thẻ" rules={[{ required: true }]} className="mb-3">
                <Input className="font-mono text-blue-600 font-bold" placeholder="VD: 66C01EB7" />
              </Form.Item>
              <Form.Item name="type" label="Loại Thẻ" className="mb-3">
                <Select options={[{ value: 'Trả trước', label: 'Trả trước' }, { value: 'Trả sau', label: 'Trả sau' }]} />
              </Form.Item>
              <Form.Item name="licensePlate" label="Biển Số Xe" className="mb-3">
                <Input placeholder="VD: 51K-78899" />
              </Form.Item>
              <Form.Item name="company" label="Tên Công Ty" className="mb-3">
                <Input placeholder="Nhập công ty..." />
              </Form.Item>
              <Form.Item name="note" label="Ghi Chú" className="mb-3">
                <Input placeholder="Nhập ghi chú..." />
              </Form.Item>
              
              <Divider className="my-3" />
              
              <Form.Item name="totalTopupDisplay" label="Tổng Tiền Nạp" className="mb-3">
                <Input disabled className="bg-gray-100 font-bold" />
              </Form.Item>
              <Form.Item name="balanceDisplay" label="Tiền Dư Còn Lại" className="mb-3">
                <Input disabled className="bg-gray-100 font-bold text-green-600" />
              </Form.Item>
              <Form.Item name="topup" label="Nạp Thêm Tiền" className="mb-3">
                <InputNumber 
                  className="w-full" 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label="Nạp Nhanh" className="mb-3">
                <Select 
                  placeholder="Chọn mệnh giá"
                  onChange={handleFastTopupChange}
                  options={[
                    { value: 100000, label: '100.000' },
                    { value: 200000, label: '200.000' },
                    { value: 500000, label: '500.000' },
                    { value: 1000000, label: '1.000.000' },
                    { value: 2000000, label: '2.000.000' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="allow" label="Cho Phép" valuePropName="checked" className="mb-4">
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Button type="primary" htmlType="submit" className="w-full bg-blue-600 h-10 font-bold">
                XÁC NHẬN
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Bảng Danh Sách Thẻ (Phải) */}
        <Col xs={24} lg={16}>
          <div className="flex flex-col gap-6">
            {/* Thẻ Trả Trước */}
            <Card title={<span className="text-blue-600 font-bold uppercase text-sm">Thẻ Trả Trước</span>} size="small" className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <Table 
                columns={columns} 
                dataSource={prepaidCards} 
                rowKey="id" 
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                className="dark-theme-table"
                summary={pageData => {
                  let totalPump = 0;
                  let totalVol = 0;
                  let totalTop = 0;
                  let totalBal = 0;
                  pageData.forEach(({ pumpedMoney, pumpedVolume, totalTopup, balance }) => {
                    totalPump += pumpedMoney; totalVol += pumpedVolume; totalTop += totalTopup; totalBal += balance;
                  });
                  return (
                    <Table.Summary.Row className="font-bold bg-blue-50/50 dark:bg-gray-700/50">
                      <Table.Summary.Cell index={0} colSpan={3} className="text-center text-blue-800 dark:text-blue-300">Tổng:</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">{totalPump.toLocaleString()}</Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">{totalVol.toFixed(3)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">{totalTop.toLocaleString()}</Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right" className="text-green-600">{totalBal.toLocaleString()}</Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={3} />
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>

            {/* Thẻ Trả Sau */}
            <Card title={<span className="text-orange-500 font-bold uppercase text-sm">Thẻ Trả Sau</span>} size="small" className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <Table 
                columns={columns} 
                dataSource={postpaidCards} 
                rowKey="id" 
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                className="dark-theme-table"
                summary={pageData => {
                  let totalPump = 0;
                  let totalVol = 0;
                  pageData.forEach(({ pumpedMoney, pumpedVolume }) => {
                    totalPump += pumpedMoney; totalVol += pumpedVolume;
                  });
                  return (
                    <Table.Summary.Row className="font-bold bg-orange-50/50 dark:bg-gray-700/50">
                      <Table.Summary.Cell index={0} colSpan={3} className="text-center text-orange-800 dark:text-orange-300">Tổng:</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">{totalPump.toLocaleString()}</Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">{totalVol.toFixed(3)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">0</Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">0</Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={3} />
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};
