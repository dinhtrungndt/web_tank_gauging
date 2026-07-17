import { Button, DatePicker, Modal, Table } from 'antd';
import { AlertTriangle, Download, Droplets, Play, Square, Thermometer } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const mockTanks = [
  { id: 'Bồn 1', fuelType: 'E10', currentVolume: 2968, emptyVolume: 7032, totalVolume: 10000, level: 807, waterLevel: 0, waterVolume: 0, temp: 32 },
  { id: 'Bồn 2', fuelType: 'E10', currentVolume: 11876, emptyVolume: 3124, totalVolume: 15000, level: 1813, waterLevel: 0, waterVolume: 0, temp: 32 },
  { id: 'Bồn 3', fuelType: 'DO_II', currentVolume: 8888, emptyVolume: 6112, totalVolume: 15000, level: 1409, waterLevel: 0, waterVolume: 0, temp: 33 },
  { id: 'Bồn 4', fuelType: 'DO_II', currentVolume: 13849, emptyVolume: 1151, totalVolume: 15000, level: 1607, waterLevel: 234, waterVolume: 1089, temp: 30 },
  { id: 'Bồn 5', fuelType: 'E10', currentVolume: 0, emptyVolume: 25000, totalVolume: 25000, level: 0, waterLevel: 0, waterVolume: 0, temp: 30 },
];

const TankCard = ({ tank, onDetails, onImport }) => {
  const percentage = (tank.currentVolume / tank.totalVolume) * 100;

  // Warnings
  const hasWater = tank.waterVolume > 0;
  const isLow = percentage < 10;
  const isHighTemp = tank.temp > 35;
  const isEmpty = tank.currentVolume === 0;

  let colorClass = 'bg-green-500';
  if (isEmpty) colorClass = 'bg-gray-300 dark:bg-gray-600';
  else if (tank.fuelType.includes('DO')) colorClass = 'bg-orange-500';

  if (isLow && !isEmpty) colorClass = 'bg-red-500';

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border-2 ${hasWater || isHighTemp || isEmpty ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          {tank.id} | {tank.fuelType}
        </div>
        <div className="flex gap-2">
          <Button size="small" type="text" className="text-blue-600 font-medium" onClick={() => onDetails(tank)}>Chi Tiết</Button>
          <Button size="small" type="primary" className="bg-blue-600" onClick={() => onImport(tank)}>Nhập Bồn</Button>
        </div>
      </div>

      <div className="p-4 flex gap-6">
        {/* Tank Visualizer */}
        <div className="w-24 h-48 bg-gray-100 dark:bg-gray-900 rounded-t-sm rounded-b-2xl border-4 border-gray-300 dark:border-gray-600 relative overflow-hidden flex flex-col justify-end">
          <div
            className={`w-full transition-all duration-1000 ease-in-out ${colorClass} relative flex items-center justify-center`}
            style={{ height: `${percentage}%` }}
          >
            {percentage > 15 && (
              <span className="text-white font-bold text-sm drop-shadow-md">
                {percentage.toFixed(1)}%
              </span>
            )}

            {/* Water indicator overlay at the bottom if water exists */}
            {hasWater && (
              <div
                className="absolute bottom-0 w-full bg-blue-400 opacity-80 border-t-2 border-blue-200 flex items-end justify-center pb-1"
                style={{ height: `${(tank.waterVolume / tank.totalVolume) * 100}%`, minHeight: '20px' }}
              >
                <Droplets size={14} className="text-white" />
              </div>
            )}
          </div>
          {percentage <= 15 && !isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-800 dark:text-gray-200 font-bold text-sm drop-shadow-sm">
                {percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Data */}
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
            <span className="text-xs text-gray-500 dark:text-gray-400">Còn lại (Lít)</span>
            <span className={`font-bold text-lg ${isEmpty ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
              {isEmpty ? 'Hết nhiên liệu' : tank.currentVolume.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
            <span className="text-xs text-gray-500 dark:text-gray-400">Trống (Lít)</span>
            <span className="font-bold text-lg text-gray-800 dark:text-white">{tank.emptyVolume.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
            <span className="text-xs text-gray-500 dark:text-gray-400">Mức (mm)</span>
            <span className="font-bold text-gray-800 dark:text-white">{tank.level}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
            <span className="text-xs text-gray-500 dark:text-gray-400">Dung tích (Lít)</span>
            <span className="font-bold text-gray-800 dark:text-white">{tank.totalVolume.toLocaleString()}</span>
          </div>

          <div className={`flex flex-col items-center p-2 rounded ${hasWater ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">Nước (mm/Lít)</span>
            <span className={`font-bold ${hasWater ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
              {tank.waterLevel}/{tank.waterVolume}
            </span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded ${isHighTemp ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">Nhiệt độ</span>
            <span className={`font-bold flex items-center ${isHighTemp ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
              <Thermometer size={14} className="mr-1" /> {tank.temp}°C
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Bar */}
      {(hasWater || isEmpty || isHighTemp) && (
        <div className="bg-red-500 text-white p-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle size={16} />
          {hasWater && `CẢNH BÁO NƯỚC: ${tank.waterLevel} mm / ${tank.waterVolume} Lít`}
          {isEmpty && !hasWater && `CẢNH BÁO MỨC NHIÊN LIỆU`}
          {isHighTemp && !hasWater && !isEmpty && `CẢNH BÁO NHIỆT ĐỘ CAO`}
        </div>
      )}
    </div>
  );
};

export const Tanks = ({ isDashboard }) => {
  const [detailsModal, setDetailsModal] = useState({ open: false, tank: null });
  const [importModal, setImportModal] = useState({ open: false, tank: null, status: 'idle' });

  const handleOpenDetails = (tank) => {
    setDetailsModal({ open: true, tank });
  };

  const handleOpenImport = (tank) => {
    setImportModal({ open: true, tank, status: 'idle' });
  };

  const handleStartImport = () => {
    setImportModal(prev => ({ ...prev, status: 'importing' }));
    toast.success('Đã bắt đầu nhập bồn. Vui lòng đợi xe bồn xả xong...');
  };

  const handleEndImport = () => {
    setImportModal(prev => ({ ...prev, status: 'done' }));
    toast.success('Đã kết thúc nhập bồn và chốt số liệu!');
  };

  return (
    <div className="flex flex-col gap-6">
      {!isDashboard && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bồn Nhiên Liệu</h2>
            <p className="text-gray-500 dark:text-gray-400">Giám sát tồn kho, mức nhiên liệu, cảnh báo nhiệt độ và nước.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {mockTanks.map(tank => (
          <TankCard
            key={tank.id}
            tank={tank}
            onDetails={handleOpenDetails}
            onImport={handleOpenImport}
          />
        ))}
      </div>

      {/* Details Modal */}
      <Modal
        title={`Chi tiết Bồn: ${detailsModal.tank?.id}`}
        open={detailsModal.open}
        onCancel={() => setDetailsModal({ open: false, tank: null })}
        width={800}
        footer={null}
      >
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <DatePicker.RangePicker format="DD/MM/YYYY" />
            <Button type="primary">Tìm Kiếm</Button>
          </div>
          <Button icon={<Download size={16} />}>Tải File CSV</Button>
        </div>
        <Table
          columns={[
            { title: 'Thời gian', dataIndex: 'time', key: 'time' },
            { title: 'Thao tác', dataIndex: 'action', key: 'action' },
            { title: 'Số lượng (Lít)', dataIndex: 'amount', key: 'amount', align: 'right' },
            { title: 'Tồn sau (Lít)', dataIndex: 'balance', key: 'balance', align: 'right' },
          ]}
          dataSource={[
            { key: 1, time: '17/07/2026 10:30', action: 'Bán hàng (Ca 1)', amount: -500, balance: detailsModal.tank?.currentVolume },
            { key: 2, time: '16/07/2026 14:00', action: 'Nhập bồn', amount: +10000, balance: (detailsModal.tank?.currentVolume || 0) + 500 },
          ]}
          pagination={false}
        />
      </Modal>

      {/* Import Modal */}
      <Modal
        title={`Nhập Hàng - ${importModal.tank?.id}`}
        open={importModal.open}
        onCancel={() => setImportModal({ open: false, tank: null, status: 'idle' })}
        footer={null}
        width={400}
      >
        <div className="flex flex-col items-center justify-center p-6 gap-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            {importModal.status === 'idle' && 'Nhấn BẮT ĐẦU trước khi xe bồn xả van nhập.'}
            {importModal.status === 'importing' && 'Đang trong quá trình nhập bồn. Sau khi nhập xong đợi bồn yên tĩnh 10 phút rồi nhấn KẾT THÚC.'}
            {importModal.status === 'done' && 'Nhập bồn hoàn tất. Số liệu đã được ghi nhận.'}
          </div>

          <div className="flex gap-4">
            <Button
              size="large"
              type="primary"
              className="bg-blue-600 w-32"
              icon={<Play size={16} />}
              disabled={importModal.status !== 'idle'}
              onClick={handleStartImport}
            >
              BẮT ĐẦU
            </Button>
            <Button
              size="large"
              danger
              type="primary"
              className="w-32"
              icon={<Square size={16} />}
              disabled={importModal.status !== 'importing'}
              onClick={handleEndImport}
            >
              KẾT THÚC
            </Button>
          </div>

          {importModal.status === 'done' && (
            <div className="mt-4 w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded text-center">
              <div className="text-green-600 dark:text-green-400 font-bold mb-1">Số lượng đã nhập:</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">10,000 Lít</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
