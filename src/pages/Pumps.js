import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { FileText, Filter, Lock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const initialPumps = [
  { id: 'MT0001', fuelType: 'Xăng E10 RON95 Mức 3', money: 20000, volume: 0.973, price: 20550, status: 'idle', serial: 113, totalMoney: 25496900, totalCount: 17 },
  { id: 'MT0002', fuelType: 'Xăng RON 95-III', money: 60000, volume: 2.919, price: 20550, status: 'idle', serial: 114, totalMoney: 26731467, totalCount: 22 },
  { id: 'MT0003', fuelType: 'Xăng E5 RON 92-II', money: 50000, volume: 2.433, price: 20550, status: 'idle', serial: 89, totalMoney: 27966034, totalCount: 27 },
  { id: 'MT0004', fuelType: 'Dầu DO 0,05S-II', money: 1600000, volume: 68.610, price: 23320, status: 'idle', serial: 111, totalMoney: 29200601, totalCount: 32 },
];

const PumpCard = ({ pump, onOpenDetails }) => {
  // Determine colors based on status
  let bgClass = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'; // idle (Trắng)
  let headerClass = 'bg-blue-900 text-white';

  if (pump.status === 'lifted') {
    bgClass = 'bg-yellow-400 border-yellow-500 shadow-yellow-400/50'; // Vàng
    headerClass = 'bg-yellow-500 text-yellow-900';
  } else if (pump.status === 'pumping') {
    bgClass = 'bg-green-500 border-green-600 shadow-green-500/50'; // Xanh
    headerClass = 'bg-green-600 text-white';
  }

  return (
    <div 
      onClick={() => onOpenDetails({ open: true, pump })}
      className={`relative flex flex-col rounded-md overflow-hidden border-2 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md hover:opacity-90 ${bgClass}`}
    >
      {/* Header */}
      <div className={`py-1 px-1 text-center flex flex-col items-center justify-center min-h-[48px] ${headerClass}`}>
        <div className="font-bold text-sm leading-none">{pump.id}</div>
        <div className="text-[10px] font-semibold uppercase opacity-90 line-clamp-2 leading-tight mt-1 w-full whitespace-normal">{pump.fuelType}</div>
      </div>

      {/* Body - Digital Display */}
      <div className="flex-1 p-1 flex flex-col gap-1 bg-white dark:bg-gray-900">
        <div className="border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <span className="text-gray-400 text-[9px] font-bold">VNĐ</span>
          <span className={`text-sm font-bold font-mono tracking-wide ${pump.status === 'pumping' ? 'text-red-500' : 'text-red-600 dark:text-red-400'}`}>
            {Math.floor(pump.money).toLocaleString('en-US')}
          </span>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <span className="text-gray-400 text-[9px] font-bold">LÍT</span>
          <span className={`text-sm font-bold font-mono tracking-wide ${pump.status === 'pumping' ? 'text-red-500' : 'text-red-600 dark:text-red-400'}`}>
            {pump.volume.toFixed(3)}
          </span>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <span className="text-gray-400 text-[9px] font-bold">GIÁ</span>
          <span className="text-xs font-bold font-mono tracking-wide text-red-600 dark:text-red-400">
            {pump.price.toLocaleString('en-US')}
          </span>
        </div>
      </div>

      {/* Footer - Total */}
      <div className="bg-black text-white py-1 px-1 text-center text-[10px] font-mono font-bold tracking-widest border-t border-gray-300 dark:border-gray-700 truncate w-full">
        {pump.totalMoney.toLocaleString('en-US')}
      </div>

      {/* Pumping indicator dot */}
      {pump.status === 'pumping' && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
      )}
    </div>
  );
};

export const Pumps = ({ isDashboard }) => {
  const navigate = useNavigate();
  const [pumps, setPumps] = useState(initialPumps);
  const [authModal, setAuthModal] = useState({ open: false, action: null });
  const [detailsModal, setDetailsModal] = useState({ open: false, pump: null });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  // Filtering state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');

  // Bỏ realtime mô phỏng theo yêu cầu
  useEffect(() => {
    // Không cần chạy interval cập nhật số liệu liên tục nữa
  }, []);

  const handleAuthSubmit = (values) => {
    if (values.pin === '1234') {
      toast.success('Xác thực thành công!');
      const targetAction = authModal.action;
      setAuthModal({ open: false, action: null });
      form.resetFields();
      setDetailsModal({ open: false, pump: null });
      
      if (targetAction === 'chot-so') {
        navigate('/chot-so');
      } else if (targetAction === 'bao-cao') {
        navigate('/bao-cao');
      }
    } else {
      toast.error('Sai mật khẩu!');
    }
  };

  const handlePasswordChange = (values) => {
    if (values.oldPassword !== '1234') {
      toast.error('Mật khẩu cũ không chính xác!');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    toast.success('Đổi mật khẩu thành công!');
    setPasswordModalOpen(false);
    pwdForm.resetFields();
  };

  const filteredPumps = useMemo(() => {
    return pumps.filter(pump => {
      const matchSearch = pump.id.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter === 'all' || pump.status === statusFilter;
      const matchFuel = fuelFilter === 'all' || pump.fuelType.includes(fuelFilter);
      return matchSearch && matchStatus && matchFuel;
    });
  }, [pumps, searchText, statusFilter, fuelFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header & Actions */}
      {!isDashboard && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Giám Sát Bán Hàng</h2>
            <p className="text-gray-500 dark:text-gray-400">Theo dõi trạng thái các trụ bơm theo thời gian thực.</p>
          </div>
          <div className="flex gap-2">
            <Button icon={<FileText size={16} />} onClick={() => setAuthModal({ open: true, action: 'bao-cao' })}>Báo Cáo</Button>
            <Button type="primary" className="bg-blue-600" icon={<Lock size={16} />} onClick={() => setAuthModal({ open: true, action: 'chot-so' })}>
              Chốt Số
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 pr-3 mr-1">
          <Filter size={18} />
          <span>Bộ lọc:</span>
        </div>
        <Input
          placeholder="Tìm mã trụ..."
          prefix={<Search size={16} className="text-gray-400" />}
          className="w-40 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="all"
          className="w-36"
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            { value: 'idle', label: 'Đang chờ' },
            { value: 'lifted', label: 'Đã nhắc cò' },
            { value: 'pumping', label: 'Đang bơm' },
          ]}
        />
        <Select
          defaultValue="all"
          className="w-36"
          onChange={setFuelFilter}
          options={[
            { value: 'all', label: 'Tất cả nhiên liệu' },
            { value: 'Xăng RON 95-III', label: 'Xăng RON 95-III' },
            { value: 'Xăng E5 RON 92-II', label: 'Xăng E5 RON 92-II' },
            { value: 'Dầu hỏa 2-K', label: 'Dầu hỏa 2-K' },
            { value: 'Dầu DO 0,05S-II', label: 'Dầu DO 0,05S-II' },
            { value: 'Dầu DO 0,25S', label: 'Dầu DO 0,25S' },
            { value: 'Dầu DO 0,001S-V', label: 'Dầu DO 0,001S-V' },
            { value: 'Xăng RON 95-V', label: 'Xăng RON 95-V' },
            { value: 'Dầu FO 3,5%S', label: 'Dầu FO 3,5%S' },
            { value: 'Dầu KO', label: 'Dầu KO' },
            { value: 'Xăng E10 RON95 Mức 3', label: 'Xăng E10 RON95 Mức 3' },
          ]}
        />
      </div>

      {/* Pumps Table */}
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
        <Table 
          dataSource={filteredPumps.map((pump, index) => ({ ...pump, key: pump.id, idNum: index + 1 }))}
          pagination={false}
          size="small"
          bordered
          columns={[
            { title: 'Vòi', dataIndex: 'idNum', align: 'center' },
            { 
              title: 'Nhiên Liệu', dataIndex: 'fuelType', align: 'center',
              render: text => <span className={`font-bold ${text.includes('Xăng') ? 'text-green-600' : 'text-orange-500'}`}>{text}</span>
            },
            { title: 'Số Tiền', dataIndex: 'money', align: 'center', render: val => val.toLocaleString('vi-VN') },
            { title: 'Số Lít', dataIndex: 'volume', align: 'center', render: val => val.toFixed(3).replace('.', ',') },
            { title: 'Đơn Giá', dataIndex: 'price', align: 'center', render: val => val.toLocaleString('vi-VN') },
            { title: 'Serial', dataIndex: 'serial', align: 'center' },
            { title: 'Kết Nối', key: 'connect', align: 'center', render: () => <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" /> },
            { title: 'Trạng Thái', dataIndex: 'status', align: 'center', render: () => 'Đang chờ' },
            { 
              title: 'Chi Tiết', key: 'action', align: 'center',
              render: (_, record) => (
                <span 
                  className="text-blue-600 font-bold cursor-pointer hover:underline"
                  onClick={() => setDetailsModal({ open: true, pump: record })}
                >
                  Xem
                </span>
              )
            }
          ]}
          components={{
            header: {
              cell: (props) => <th {...props} className="bg-[#0f3460] text-white text-center text-xs font-bold" />
            }
          }}
          rowClassName="bg-white text-center text-xs"
        />
        {filteredPumps.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy trụ bơm nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* Modal Chi tiết Vòi Bơm */}
      <Modal
        title={null}
        open={detailsModal.open}
        onCancel={() => setDetailsModal({ open: false, pump: null })}
        footer={null}
        width={900}
        className="dark:bg-gray-800 p-0"
        closeIcon={null}
      >
        {detailsModal.pump && (
          <div className="flex flex-col border border-gray-300 dark:border-gray-700">
            {/* Top Navigation / Header like in Hình 2 */}
            <div className="flex justify-between text-xs font-bold text-blue-800 dark:text-blue-400 p-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
              <span className="cursor-pointer hover:underline" onClick={() => setDetailsModal({ open: false, pump: null })}>Trang Chủ</span>
              <div className="flex gap-8">
                <span className="cursor-pointer hover:underline" onClick={() => setAuthModal({ open: true, action: 'bao-cao' })}>Báo Cáo</span>
                <span className="cursor-pointer hover:underline" onClick={() => setAuthModal({ open: true, action: 'chot-so' })}>Chốt Số</span>
                <span className="cursor-pointer hover:underline" onClick={() => setPasswordModalOpen(true)}>Đổi Mật Khẩu</span>
              </div>
              <span className="cursor-pointer hover:underline">Restart</span>
            </div>

            {/* Top Table: Tổng kết vòi */}
            <Table
              size="small"
              pagination={false}
              dataSource={[{ ...detailsModal.pump, key: 1, serial: 113 + parseInt(detailsModal.pump.id.replace('MT', '')) }]}
              className="mb-4"
              columns={[
                { title: 'Vòi', dataIndex: 'id', align: 'center', render: id => parseInt(id.replace('MT', '')) },
                { title: 'Kết Nối', key: 'status', align: 'center', render: () => <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" /> },
                { title: 'Nhiên Liệu', dataIndex: 'fuelType', align: 'center', render: f => <span className={`font-bold ${f.includes('Xăng') ? 'text-green-600' : 'text-orange-500'}`}>{f}</span> },
                { title: 'Serial', dataIndex: 'serial', align: 'center' },
                { title: 'Tổng Số Tiền', dataIndex: 'totalMoney', align: 'center', render: v => v.toLocaleString() },
                { title: 'Tổng Số Lít', dataIndex: 'volume', align: 'center', render: () => '44,542.126' }, // Mock large volume
                { title: 'Tổng Lần Bán', dataIndex: 'totalCount', align: 'center' },
              ]}
              bordered
              rowClassName="bg-white dark:bg-gray-800 text-center"
              components={{
                header: {
                  cell: (props) => <th {...props} className="bg-blue-900 text-white text-center text-xs" />
                }
              }}
            />

            {/* Title & Navigation */}
            <div className="flex flex-col items-center mb-2">
              <div className="flex gap-2 mb-1">
                <Button size="small" icon={<span className="text-blue-600">←</span>} />
                <Button size="small" icon={<span className="text-blue-600">→</span>} />
              </div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-400">
                Nhật Ký Lần Bơm Gần Nhất Của Vòi {parseInt(detailsModal.pump.id.replace('MT', ''))}
              </div>
            </div>

            {/* Bottom Table: 5 cuộc bơm */}
            <Table
              size="small"
              pagination={false}
              dataSource={[
                { key: 1, bill: 13831, date: '16/07/2026', time: '19:29:32', money: 20000, volume: 0.973, price: detailsModal.pump.price },
                { key: 2, bill: 13830, date: '16/07/2026', time: '19:18:59', money: 70000, volume: 3.406, price: detailsModal.pump.price },
                { key: 3, bill: 13829, date: '16/07/2026', time: '19:09:31', money: 50000, volume: 2.433, price: detailsModal.pump.price },
                { key: 4, bill: 13828, date: '16/07/2026', time: '19:09:11', money: 50000, volume: 2.433, price: detailsModal.pump.price },
                { key: 5, bill: 13827, date: '16/07/2026', time: '18:53:02', money: 50000, volume: 2.433, price: detailsModal.pump.price },
              ]}
              columns={[
                { title: 'Lần', dataIndex: 'key', align: 'center' },
                { title: 'Số bill', dataIndex: 'bill', align: 'center' },
                { title: 'Ngày', dataIndex: 'date', align: 'center' },
                { title: 'Giờ', dataIndex: 'time', align: 'center' },
                { title: 'Số Tiền', dataIndex: 'money', align: 'center', render: v => v.toLocaleString() },
                { title: 'Số Lít', dataIndex: 'volume', align: 'center', render: v => v.toLocaleString('vi-VN', { minimumFractionDigits: 3 }) },
                { title: 'Đơn Giá', dataIndex: 'price', align: 'center', render: v => v.toLocaleString() },
              ]}
              bordered
              rowClassName="bg-white dark:bg-gray-800 text-center text-xs"
              components={{
                header: {
                  cell: (props) => <th {...props} className="bg-blue-900 text-white text-center text-xs" />
                }
              }}
            />
            <div className="text-center text-[10px] text-gray-400 py-1 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              Copyright © 2026 - Công ty TNHH Kỹ Thuật Mon
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Xác Thực */}
      <Modal
        title={authModal.action === 'bao-cao' ? "Nhập Mật Khẩu Xem Báo Cáo" : "Nhập Mật Khẩu Chốt Số"}
        open={authModal.open}
        onCancel={() => { setAuthModal({ open: false, action: null }); form.resetFields(); }}
        footer={null}
        className="dark:bg-gray-800"
      >
        <Form form={form} layout="vertical" onFinish={handleAuthSubmit}>
          <Form.Item
            name="pin"
            rules={[{ required: true, message: 'Vui lòng nhập mã PIN!' }]}
          >
            <Input.Password placeholder="Mã PIN (Mặc định: 1234)" size="large" />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button onClick={() => { setAuthModal({ open: false, action: null }); form.resetFields(); }} className="mr-2">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">Xác Nhận</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đổi Mật Khẩu */}
      <Modal
        title={<div className="text-xl font-bold text-[#0f3460] text-center mb-2">Đổi Mật Khẩu Đăng Nhập</div>}
        open={passwordModalOpen}
        onCancel={() => { setPasswordModalOpen(false); pwdForm.resetFields(); }}
        footer={null}
        width={450}
        className="dark:bg-gray-800"
      >
        <Form form={pwdForm} layout="vertical" onFinish={handlePasswordChange}>
          <div className="flex items-center justify-between mb-4 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Mật khẩu cũ</span>
            <Form.Item name="oldPassword" noStyle rules={[{ required: true, message: 'Nhập mật khẩu cũ' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-4 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Mật khẩu mới</span>
            <Form.Item name="newPassword" noStyle rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-6 border border-gray-300 rounded p-2">
            <span className="text-[#0f3460] font-bold w-1/2">Nhập lại mật khẩu mới</span>
            <Form.Item name="confirmPassword" noStyle rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}>
              <Input.Password className="w-1/2 border-gray-300" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" className="w-full bg-[#1677ff] h-12 text-lg font-bold rounded-md">
            Lưu
          </Button>
        </Form>
        <div className="text-center text-gray-500 text-xs mt-6">
          Copyright © 2026 - Công ty TNHH Kỹ Thuật Mon
        </div>
      </Modal>
    </div>
  );
};
