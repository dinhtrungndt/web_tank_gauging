import { Button, Form, Input, Modal, Select } from 'antd';
import { FileText, Filter, Lock, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// Mock data with status: 'idle' (chưa nhận cò), 'lifted' (đã nhận cò), 'pumping' (đang đổ)
const initialPumps = Array.from({ length: 14 }).map((_, i) => {
  let status = 'idle';
  if (i === 1 || i === 4 || i === 7 || i === 9) status = 'pumping';
  else if (i === 2 || i === 5 || i === 8) status = 'lifted';

  const price = i % 2 === 0 ? 21590 : 20810;
  // Khởi tạo một chút tiền/lít cho các máy đang hoạt động
  const volume = status !== 'idle' ? (Math.random() * 5 + 1) : 0;
  const money = volume * price;

  return {
    id: `MT${(i + 1).toString().padStart(4, '0')}`,
    fuelType: i % 2 === 0 ? 'Dầu Điêzen 0,05S Mức 2' : 'Xăng E10 RON95 Mức 3',
    money: money,
    volume: volume,
    price: price,
    status: status,
    totalMoney: 25496900 + i * 1234567,
    totalCount: 17 + i * 5,
  };
});

const PumpCard = ({ pump }) => {
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
    <div className={`relative flex flex-col rounded-md overflow-hidden border-2 shadow-sm transition-all duration-300 ${bgClass}`}>
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

export const Pumps = () => {
  const [pumps, setPumps] = useState(initialPumps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filtering state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');

  // Simulate real-time pumping
  useEffect(() => {
    const interval = setInterval(() => {
      setPumps(prev => prev.map(p => {
        if (p.status === 'pumping') {
          return {
            ...p,
            volume: p.volume + 0.11,
            money: p.money + (0.11 * p.price)
          };
        }
        return p;
      }));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleChotSo = (values) => {
    if (values.pin === '1234') {
      toast.success('Chốt số thành công!');
      setIsModalOpen(false);
      form.resetFields();
    } else {
      toast.error('Sai mật khẩu!');
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Giám Sát Bán Hàng</h2>
          <div className="flex gap-4 mt-1 text-xs">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white border border-gray-400"></div> Đang chờ</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Đã nhắc cò</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Đang bơm</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button icon={<FileText size={16} />}>Báo Cáo</Button>
          <Button type="primary" className="bg-blue-600" icon={<Lock size={16} />} onClick={() => setIsModalOpen(true)}>
            Chốt Số
          </Button>
        </div>
      </div>

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
            { value: 'Dầu Điêzen', label: 'Dầu Điêzen' },
            { value: 'Xăng E10', label: 'Xăng E10' },
          ]}
        />
      </div>

      {/* Pumps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-2 p-3 bg-gray-200 dark:bg-gray-800/50 rounded-lg">
        {filteredPumps.map(pump => (
          <PumpCard key={pump.id} pump={pump} />
        ))}
        {filteredPumps.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy trụ bơm nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* Modal Chốt Số */}
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
