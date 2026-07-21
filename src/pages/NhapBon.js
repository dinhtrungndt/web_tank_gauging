import { Button, Modal, Table } from 'antd';
import { ArrowDown, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const initialData = [
  { id: '1', fuel: 'E10', startMm: 807, startLit: 2968, endMm: 807, endLit: 2968, export: 0, import: '-' },
  { id: '2', fuel: 'E10', startMm: 1813, startLit: 11876, endMm: 1813, endLit: 11876, export: 0, import: '-' },
  { id: '3', fuel: 'DO_II', startMm: 1409, startLit: 8888, endMm: 1409, endLit: 8888, export: 0, import: '-' },
];

const formatNum = (num) => num === '-' ? '-' : num.toLocaleString('vi-VN');

export const NhapBon = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState('idle'); // idle -> started -> ended
  const [startTime, setStartTime] = useState(null);
  const [startTimeDate, setStartTimeDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [logModal, setLogModal] = useState({ open: false, tankId: null });

  useEffect(() => {
    let interval;
    if (status === 'started' && startTimeDate) {
      interval = setInterval(() => {
        setElapsed(Math.floor((new Date() - startTimeDate) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, startTimeDate]);

  const handleStart = () => {
    setStatus('started');
    const now = new Date();
    setStartTime(`${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB')}`);
    setStartTimeDate(now);
    setElapsed(0);
    toast.success('Đã bắt đầu ghi nhận dữ liệu nhập bồn.');
  };

  const handleEnd = () => {
    setStatus('ended');
    const now = new Date();
    setEndTime(`${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB')}`);
    // Simulate some imported data
    setData(prev => prev.map(p => {
      if (p.id === '1') return { ...p, endMm: 950, endLit: 3500, import: 532 };
      return p;
    }));
    toast.success('Đã kết thúc nhập bồn và chốt số liệu!');
  };

  const formatElapsed = (seconds) => {
    if (status === 'idle') return '';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleDownloadCsv = () => {
    toast.success(`Đã tải về file nhat_ky_bon_${logModal.tankId}.csv`);
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-[#0b1120] min-h-screen">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-2 border-b-2 border-[#0f3460] bg-white dark:bg-gray-800 shadow-sm mb-4">
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pl-2"
          onClick={() => navigate('/')}
        >
          Trang Chủ
        </div>
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2"
          onClick={() => navigate('/bao-cao-bon')}
        >
          Báo Cáo Bồn
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 mb-4">
          <div className="flex items-center gap-4 mb-2">
            <Button
              type="primary"
              className="bg-[#1677ff] font-bold w-24 rounded"
              onClick={handleStart}
              disabled={status !== 'idle'}
            >
              BẮT ĐẦU
            </Button>
            <div className="flex gap-4 items-center">
              <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{startTime}</span>
              {status === 'started' && <span className="font-bold text-blue-600 dark:text-blue-400 animate-pulse text-xs">Đang nhập: {formatElapsed(elapsed)}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="primary"
              className="bg-[#1677ff] font-bold w-24 rounded"
              onClick={handleEnd}
              disabled={status !== 'started'}
            >
              KẾT THÚC
            </Button>
            <div className="flex gap-4 items-center">
              <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{endTime}</span>
              {status === 'ended' && <span className="font-bold text-green-600 text-xs">Tổng thời gian: {formatElapsed(elapsed)}</span>}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-[#0f3460] text-white">
                <th className="border border-gray-400 p-2 font-bold w-12" rowSpan={2}>Bồn</th>
                <th className="border border-gray-400 p-2 font-bold w-24" rowSpan={2}>Nhiên<br />Liệu</th>
                <th className="border border-gray-400 p-1 font-bold" colSpan={2}>Mức Đầu</th>
                <th className="border border-gray-400 p-1 font-bold" colSpan={2}>Mức Cuối</th>
                <th className="border border-gray-400 p-2 font-bold w-20" rowSpan={2}>Xuất<br />(Lít)</th>
                <th className="border border-gray-400 p-2 font-bold w-20" rowSpan={2}>Nhập<br />(Lít)</th>
                <th className="border border-gray-400 p-2 font-bold w-12" rowSpan={2}>Tải<br />Về</th>
              </tr>
              <tr className="bg-[#0f3460] text-white">
                <th className="border border-gray-400 p-1 font-bold w-16">mm</th>
                <th className="border border-gray-400 p-1 font-bold w-20">Lít</th>
                <th className="border border-gray-400 p-1 font-bold w-16">mm</th>
                <th className="border border-gray-400 p-1 font-bold w-20">Lít</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 dark:text-gray-200">{row.id}</td>
                  <td className={`p-2 font-bold ${row.fuel === 'E10' ? 'text-green-600' : 'text-orange-500'}`}>{row.fuel}</td>
                  <td className="p-2 dark:text-gray-200">{formatNum(row.startMm)}</td>
                  <td className="p-2 dark:text-gray-200">{formatNum(row.startLit)}</td>
                  <td className="p-2 dark:text-gray-200">{formatNum(row.endMm)}</td>
                  <td className="p-2 dark:text-gray-200">{formatNum(row.endLit)}</td>
                  <td className="p-2 font-bold dark:text-gray-200">{formatNum(row.export)}</td>
                  <td className="p-2 font-bold dark:text-gray-200">{formatNum(row.import)}</td>
                  <td className="p-2 cursor-pointer text-blue-600 flex justify-center items-center h-full pt-3" onClick={() => setLogModal({ open: true, tankId: row.id })}>
                    <ArrowDown size={14} className="font-bold stroke-[3px] hover:scale-125 transition-transform" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center text-gray-500 text-[10px] mt-4">
          Copyright © 2026 - Công ty DVN Technology
        </div>
      </div>

      {/* Nhật Ký Modal */}
      <Modal
        title={`Nhật Ký Bồn ${logModal.tankId}`}
        open={logModal.open}
        onCancel={() => setLogModal({ open: false, tankId: null })}
        width={700}
        footer={null}
      >
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
            Tải File CSV
          </Button>
        </div>
        <Table
          columns={[
            { title: 'Thời gian', dataIndex: 'time', key: 'time' },
            { title: 'Thao tác', dataIndex: 'action', key: 'action' },
            { title: 'Số lượng (Lít)', dataIndex: 'amount', key: 'amount', align: 'right' },
            { title: 'Tồn sau (Lít)', dataIndex: 'balance', key: 'balance', align: 'right' },
          ]}
          dataSource={[
            { key: 1, time: '17/07/2026 10:30', action: 'Bán hàng (Ca 1)', amount: -500, balance: 2468 },
            { key: 2, time: '16/07/2026 14:00', action: 'Nhập bồn', amount: +10000, balance: 2968 },
          ]}
          pagination={false}
          size="small"
          bordered
        />
      </Modal>
    </div>
  );
};
