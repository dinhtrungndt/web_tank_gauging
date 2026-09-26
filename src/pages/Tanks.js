import { Button, Select, Table, DatePicker, Modal } from 'antd';
import { Droplets, Thermometer, Info, ArrowLeft, Download, Edit3, AlertTriangle, Play, Square } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const mockStations = [
  { id: 'S1', name: 'Trạm Xăng Phú Chánh - Tân Uyên' },
  { id: 'S2', name: 'Trạm Xăng Gấu Trúc Vàng - Thuận An' },
];

const mockTanks = {
  'S1': [
    { id: 'Bồn 1', fuelType: 'Dầu DO', currentVolume: 1946, totalVolume: 25000, level: 323.9, waterLevel: 0, waterVolume: 0, temp: 31.4, status: 'normal' },
    { id: 'Bồn 2', fuelType: 'Xăng E10', currentVolume: 24500, totalVolume: 25000, level: 2315.6, waterLevel: 0, waterVolume: 0, temp: 30.2, status: 'overflowing' },
    { id: 'Bồn 3', fuelType: 'Xăng E5', currentVolume: 249, totalVolume: 10000, level: 149.2, waterLevel: 0, waterVolume: 0, temp: 30.2, status: 'empty' },
    { id: 'Bồn 4', fuelType: 'Xăng E10', currentVolume: 2298, totalVolume: 25000, level: 338.7, waterLevel: 10, waterVolume: 50, temp: 30.1, status: 'normal' },
  ],
  'S2': [
    { id: 'Bồn 1', fuelType: 'Xăng RON 95', currentVolume: 8500, totalVolume: 20000, level: 1200.5, waterLevel: 0, waterVolume: 0, temp: 32.0, status: 'normal' },
    { id: 'Bồn 2', fuelType: 'Dầu DO', currentVolume: 15200, totalVolume: 30000, level: 1850.0, waterLevel: 0, waterVolume: 0, temp: 31.8, status: 'normal' },
  ]
};

const chartData = [
  { time: '12:00', oil: 2490, water: 0 },
  { time: '12:01', oil: 2490, water: 0 },
  { time: '12:02', oil: 2490, water: 0 },
  { time: '12:03', oil: 2490, water: 0 },
  { time: '12:04', oil: 2490, water: 0 },
  { time: '12:05', oil: 2490, water: 0 },
  { time: '12:06', oil: 2490, water: 0 },
  { time: '12:07', oil: 2490, water: 0 },
  { time: '12:08', oil: 2490, water: 0 },
  { time: '12:09', oil: 2490, water: 0 },
  { time: '12:10', oil: 2490, water: 0 },
  { time: '12:12', oil: 2490, water: 0 },
  { time: '12:13', oil: 2490, water: 0 },
  { time: '12:14', oil: 2490, water: 0 },
  { time: '12:16', oil: 2490, water: 0 },
  { time: '12:17', oil: 2490, water: 0 },
  { time: '12:18', oil: 2490, water: 0 },
];

const LineChart = () => {
  const MAX_Y = 2500;
  
  // Calculate SVG polyline points (0 to 100 for X and Y)
  const oilPoints = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - (d.oil / MAX_Y) * 100}`).join(' ');
  const waterPoints = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - (d.water / MAX_Y) * 100}`).join(' ');

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative flex flex-col mt-4 shadow-sm font-sans">
       <div className="text-[11px] font-bold text-gray-500 mb-4 ml-8">Lít</div>
       
       <div className="relative w-full h-[250px] pl-10 pr-2">
          {/* Y-axis labels */}
          <div className="absolute left-0 bottom-[0%] text-[10px] font-medium text-gray-500 translate-y-1/2">0</div>
          <div className="absolute left-0 bottom-[20%] text-[10px] font-medium text-gray-500 translate-y-1/2">500</div>
          <div className="absolute left-0 bottom-[40%] text-[10px] font-medium text-gray-500 translate-y-1/2">1,000</div>
          <div className="absolute left-0 bottom-[60%] text-[10px] font-medium text-gray-500 translate-y-1/2">1,500</div>
          <div className="absolute left-0 bottom-[80%] text-[10px] font-medium text-gray-500 translate-y-1/2">2,000</div>
          <div className="absolute left-0 bottom-[100%] text-[10px] font-medium text-gray-500 translate-y-1/2">2,500</div>

          {/* Chart Area */}
          <div className="relative w-full h-full border-b border-l border-gray-300 dark:border-gray-600">
            {/* Horizontal Grid lines */}
            <div className="absolute w-full h-px bg-gray-100 dark:bg-gray-700 bottom-[20%]" />
            <div className="absolute w-full h-px bg-gray-100 dark:bg-gray-700 bottom-[40%]" />
            <div className="absolute w-full h-px bg-gray-100 dark:bg-gray-700 bottom-[60%]" />
            <div className="absolute w-full h-px bg-gray-100 dark:bg-gray-700 bottom-[80%]" />
            <div className="absolute w-full h-px bg-gray-100 dark:bg-gray-700 bottom-[100%]" />

            {/* Vertical Grid lines */}
            {chartData.map((d, i) => (
              <div key={i} className="absolute h-full w-px bg-gray-100 dark:bg-gray-700 top-0" style={{ left: `${(i / (chartData.length - 1)) * 100}%` }} />
            ))}

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline fill="none" stroke="#eab308" strokeWidth="2" points={oilPoints} vectorEffect="non-scaling-stroke" />
              <polyline fill="none" stroke="#7dd3fc" strokeWidth="2" points={waterPoints} vectorEffect="non-scaling-stroke" />
            </svg>

            {/* CSS Dots for perfect roundness */}
            {chartData.map((d, i) => (
              <div key={`oil-${i}`} className="absolute w-2 h-2 rounded-full bg-[#fde047] border border-[#ca8a04] -ml-1 -mb-1 z-10" style={{ left: `${(i / (chartData.length - 1)) * 100}%`, bottom: `${(d.oil / MAX_Y) * 100}%` }} />
            ))}
            {chartData.map((d, i) => (
              <div key={`water-${i}`} className="absolute w-2 h-2 rounded-full bg-[#bae6fd] border border-[#0284c7] -ml-1 -mb-1 z-10" style={{ left: `${(i / (chartData.length - 1)) * 100}%`, bottom: `${(d.water / MAX_Y) * 100}%` }} />
            ))}
          </div>
       </div>

       {/* X-axis labels */}
       <div className="relative w-full pl-10 pr-2 mt-2 h-4">
         {chartData.map((d, i) => (
           <div key={i} className="absolute text-[9px] font-medium text-gray-500 -ml-3" style={{ left: `${(i / (chartData.length - 1)) * 100}%` }}>
             {d.time}
           </div>
         ))}
       </div>

       {/* Legend matching mockup */}
       <div className="flex justify-center gap-4 mt-6">
         <div className="flex items-center gap-2">
           <div className="w-8 h-3 bg-[#fef08a] border-2 border-[#d97706]"></div>
           <span className="text-xs font-medium text-gray-600 dark:text-gray-300">V(Dầu)</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-8 h-3 bg-[#bae6fd] border-2 border-[#0ea5e9]"></div>
           <span className="text-xs font-medium text-gray-600 dark:text-gray-300">V(Nước)</span>
         </div>
       </div>
    </div>
  )
}

const TankCard = ({ tank, onDetails, onImport }) => {
  const percentage = (tank.currentVolume / tank.totalVolume) * 100;
  
  const isOil = tank.fuelType.includes('Dầu');
  const fuelColor = isOil ? '#d97706' : '#22c55e'; // orange-600 : green-500

  // Warning system
  const isOverflowing = tank.status === 'overflowing';
  const isEmpty = tank.status === 'empty';
  const hasWarning = isOverflowing || isEmpty;

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 transition-all duration-300 ${hasWarning ? 'border-red-500 shadow-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-3 border-b ${hasWarning ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700'}`}>
        <div className="font-bold text-gray-800 dark:text-gray-100 text-[13px] flex items-center">
          {tank.id} {tank.fuelType} <span className="mx-2 text-gray-400">|</span> {tank.totalVolume.toLocaleString()} Lít 
          {!hasWarning && <span className="text-green-500 font-normal ml-2">| Đang Làm Việc</span>}
          {isOverflowing && <span className="text-red-600 dark:text-red-400 font-bold ml-2 animate-pulse flex items-center gap-1"><AlertTriangle size={14}/> Cảnh Báo Tràn!</span>}
          {isEmpty && <span className="text-red-600 dark:text-red-400 font-bold ml-2 animate-pulse flex items-center gap-1"><AlertTriangle size={14}/> Cảnh Báo Cạn!</span>}
        </div>
        <div className="flex gap-2">
          <Button 
            size="small" 
            type="primary" 
            className="bg-[#1677ff] rounded flex items-center gap-1 text-[11px] h-7 px-3 shadow-sm" 
            onClick={() => onDetails && onDetails(tank)}
          >
            Chi tiết <Info size={12} />
          </Button>
          {!hasWarning && (
             <Button 
               size="small" 
               type="default" 
               className="rounded flex items-center gap-1 text-[11px] h-7 px-3 border-blue-500 text-blue-600 dark:bg-gray-800 dark:text-blue-400 hover:bg-blue-50" 
               onClick={() => onImport && onImport(tank)}
             >
               Nhập Bồn
             </Button>
          )}
        </div>
      </div>

      <div className="p-5 flex gap-8 items-center justify-center relative">
        {/* Sirens/Visual Alerts */}
        {hasWarning && (
          <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 animate-pulse pointer-events-none" />
        )}

        {/* Circular Gauge Visualizer */}
        <div className={`w-[140px] h-[140px] rounded-full border-4 relative overflow-hidden flex-shrink-0 flex flex-col justify-end bg-white dark:bg-gray-800 shadow-inner ${hasWarning ? 'border-red-400' : 'border-[#f0f0f0] dark:border-gray-600'}`}>
          <div 
            className={`w-full relative transition-all duration-1000 ease-in-out ${hasWarning ? 'opacity-80' : 'opacity-60'}`}
            style={{ 
              height: `${percentage}%`,
              background: `linear-gradient(to top, ${hasWarning ? '#ef4444' : fuelColor}, ${hasWarning ? '#f87171' : fuelColor}88)`,
              borderTop: `2px solid ${hasWarning ? '#ef4444' : fuelColor}`
            }}
          >
            {/* Simple simulated wave */}
            <div className="absolute top-[-10px] left-0 w-[200%] h-[20px] opacity-30" 
                 style={{ background: hasWarning ? '#ef4444' : fuelColor, borderRadius: '50%', transform: 'translateX(-25%)' }} />
          </div>
          {/* Water level indicator if any */}
          {tank.waterVolume > 0 && (
             <div className="absolute bottom-0 w-full bg-blue-500 opacity-60 border-t-2 border-blue-400" 
                  style={{ height: `${(tank.waterVolume / tank.totalVolume) * 100}%` }} />
          )}
        </div>

        {/* Stats Data List */}
        <div className="flex flex-col gap-2 flex-1 min-w-[170px] z-10">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <span className="font-bold text-gray-700 dark:text-gray-200">Còn lại:</span>
             </div>
             <div className="font-bold text-blue-600 dark:text-blue-400">
               {tank.currentVolume.toLocaleString()} <span className="text-gray-400 font-normal text-[10px] ml-1">Lít</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <span className="font-bold text-gray-700 dark:text-gray-200">Trống:</span>
             </div>
             <div className="font-bold text-orange-500">
               {(tank.totalVolume - tank.currentVolume).toLocaleString()} <span className="text-gray-400 font-normal text-[10px] ml-1">Lít</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1 mt-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-[9px] font-bold border border-green-200">↕</div>
               <span className="font-medium">H({tank.fuelType.includes('Dầu') ? 'Dầu' : 'Xăng'})</span>
             </div>
             <div className="font-bold text-gray-800 dark:text-gray-100">
               {tank.level.toFixed(1)} <span className="text-gray-400 font-normal text-[10px] ml-1">mm</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[9px] font-bold border border-blue-200">↕</div>
               <span className="font-medium">H(Nước)</span>
             </div>
             <div className="font-bold text-gray-800 dark:text-gray-100">
               {tank.waterLevel.toFixed(1)} <span className="text-gray-400 font-normal text-[10px] ml-1">mm</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <div className="w-4 h-4 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 border border-yellow-200"><Droplets size={10} /></div>
               <span className="font-medium">V({tank.fuelType.includes('Dầu') ? 'Dầu' : 'Xăng'})</span>
             </div>
             <div className="font-bold text-gray-800 dark:text-gray-100">
               {tank.currentVolume.toLocaleString()} <span className="text-gray-400 font-normal text-[10px] ml-1">Lít</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-700/50 pb-1">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-200"><Droplets size={10} /></div>
               <span className="font-medium">V(Nước)</span>
             </div>
             <div className="font-bold text-gray-800 dark:text-gray-100">
               {tank.waterVolume.toLocaleString()} <span className="text-gray-400 font-normal text-[10px] ml-1">Lít</span>
             </div>
          </div>
          <div className="flex justify-between items-center text-xs">
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-200"><Thermometer size={10} /></div>
               <span className="font-medium">Nhiệt độ</span>
             </div>
             <div className="font-bold text-gray-800 dark:text-gray-100">
               {tank.temp.toFixed(1)} <span className="text-gray-400 font-normal text-[10px] ml-1">°C</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Tanks = ({ isDashboard = false }) => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState('S1');
  const [selectedTank, setSelectedTank] = useState(null);
  const currentTanks = mockTanks[selectedStation] || [];

  // Audio for alarm
  useEffect(() => {
    const hasAlarm = currentTanks.some(t => t.status === 'overflowing' || t.status === 'empty');
    if (hasAlarm) {
       toast.error("Cảnh báo: Phát hiện bồn tràn hoặc cạn nhiên liệu!", { id: 'tank-alarm', duration: 4000 });
    }
  }, [selectedStation, currentTanks]);

  const handleOpenDetails = (tank) => {
    navigate('/bao-cao-bon');
  };

  const handleOpenImport = (tank) => {
    navigate('/nhap-bon');
  };

  if (selectedTank) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-blue-50/30 dark:bg-[#0b1120]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
          <Button type="primary" className="bg-[#1677ff] font-bold rounded flex items-center gap-2" onClick={() => setSelectedTank(null)}>
            <ArrowLeft size={16} /> Quay lại
          </Button>
          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {selectedTank.id} {selectedTank.fuelType.includes('Dầu') ? 'Dầu' : 'Xăng'}
          </div>
          <Button type="primary" className="bg-[#1677ff] font-bold rounded">Đổi tên</Button>
        </div>

        <div className="p-6 flex flex-col items-center flex-1 bg-white dark:bg-gray-900 mx-4 mt-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="w-full max-w-sm mb-6 flex justify-center">
            <DatePicker className="w-64 h-10 font-bold text-center text-lg" format="DD/MM/YYYY" placeholder="22/6/2026" />
          </div>
          
          <div className="w-full max-w-5xl">
             <LineChart />
          </div>

          <div className="w-full max-w-5xl mt-6 flex justify-center">
             <Button type="primary" size="large" className="bg-[#1677ff] font-bold w-48 shadow-md" onClick={() => toast.success("Đã xuất file Excel!")}>
               Xuất file Excel
             </Button>
          </div>

          <div className="w-full max-w-5xl mt-12 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-inner">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 text-lg">
              Chi tiết Xuất / Nhập / Tồn
            </h3>
            <Table 
              dataSource={[
                { key: 1, time: '17/07/2026 10:30', action: 'Bán hàng (Ca 1)', export: 500, import: 0, balance: selectedTank.currentVolume },
                { key: 2, time: '16/07/2026 14:00', action: 'Nhập hàng', export: 0, import: 10000, balance: selectedTank.currentVolume + 500 },
                { key: 3, time: '16/07/2026 08:00', action: 'Bán hàng (Ca 3)', export: 1200, import: 0, balance: selectedTank.currentVolume - 9500 },
              ]}
              columns={[
                { title: 'Thời gian', dataIndex: 'time', align: 'center', width: 150 },
                { title: 'Thao tác', dataIndex: 'action', align: 'center' },
                { 
                  title: 'Xuất (Lít)', 
                  dataIndex: 'export', 
                  align: 'right',
                  render: (val) => val > 0 ? <span className="text-red-600 font-bold">-{val.toLocaleString()}</span> : '-'
                },
                { 
                  title: 'Nhập (Lít)', 
                  dataIndex: 'import', 
                  align: 'right',
                  render: (val) => val > 0 ? <span className="text-green-600 font-bold">+{val.toLocaleString()}</span> : '-'
                },
                { title: 'Tồn sau (Lít)', dataIndex: 'balance', align: 'right', render: val => <span className="font-bold text-blue-600">{val?.toLocaleString()}</span> },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Station Filter */}
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex gap-4 items-center">
          <span className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase">Trạm / Khu Vực:</span>
          <Select
            value={selectedStation}
            onChange={setSelectedStation}
            options={mockStations.map(s => ({ value: s.id, label: s.name }))}
            className="w-72 font-bold"
            size="large"
          />
        </div>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
        {currentTanks.map((tank) => (
          <TankCard 
            key={tank.id} 
            tank={tank} 
            onDetails={(t) => setSelectedTank(t)}
            onImport={handleOpenImport}
          />
        ))}
      </div>
    </div>
  );
};
