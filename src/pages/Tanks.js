import { Button, Select, Spin } from 'antd';
import { AlertTriangle, Droplets, Info, Thermometer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { stationService } from '../services/station.service';
import { tankService } from '../services/tank.service';

const formatNumber = (value, digits = 0) =>
  Number(value || 0).toLocaleString('vi-VN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });

const normalizeTank = (tank) => {
  const currentVolume = Number(tank.currentVolumeLit || 0);
  const totalVolume = Number(tank.barem?.totalVolumeLit || tank.maxVolume || 0);
  const waterVolume = Number(tank.currentWater || 0);
  const status = tank.currentHeight >= (tank.barem?.safeHeightMm || Infinity)
    ? 'overflowing'
    : tank.currentHeight <= (tank.lowAlertHeightMm || 0)
      ? 'empty'
      : 'normal';
  return {
    ...tank,
    label: tank.tankCode,
    fuelType: tank.fuelType,
    currentVolume,
    totalVolume,
    waterVolume,
    level: Number(tank.currentHeight || 0),
    waterLevel: Number(tank.currentWater || 0),
    temp: Number(tank.currentTemp || 0),
    status
  };
};

const TankCard = ({ tank, onDetails }) => {
  const percentage = tank.totalVolume > 0
    ? Math.min(100, (tank.currentVolume / tank.totalVolume) * 100)
    : 0;
  const warning = tank.status !== 'normal';
  return (
    <div className={`rounded-lg border-2 bg-white shadow-md dark:bg-gray-800 ${warning ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className={`flex items-center justify-between border-b p-3 ${warning ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
        <div className="text-[13px] font-bold text-gray-800 dark:text-gray-100">
          {tank.label} <span className="mx-2 text-gray-400">|</span>{tank.fuelType}
          <span className={`ml-2 font-normal ${warning ? 'text-red-600' : 'text-green-600'}`}>
            | {warning ? (tank.status === 'empty' ? 'Cảnh báo cạn' : 'Cảnh báo tràn') : 'Đang làm việc'}
          </span>
        </div>
        <Button size="small" type="primary" onClick={() => onDetails(tank)}>
          Chi tiết <Info size={12} />
        </Button>
      </div>
      <div className="flex items-center gap-8 p-5">
        <div className={`relative flex h-36 w-36 shrink-0 items-end overflow-hidden rounded-full border-4 ${warning ? 'border-red-400' : 'border-gray-200'}`}>
          <div className={`w-full transition-all ${warning ? 'bg-red-400' : 'bg-yellow-400'}`} style={{ height: `${percentage}%` }} />
        </div>
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex justify-between font-bold">Còn lại <span className="text-blue-600">{formatNumber(tank.currentVolume)} Lít</span></div>
          <div className="flex justify-between">Dung tích toàn phần <span>{formatNumber(tank.totalVolume)} Lít</span></div>
          <div className="flex justify-between"><span><Droplets size={13} className="mr-1 inline" />Mức chất lỏng</span><span>{formatNumber(tank.level, 1)} mm</span></div>
          <div className="flex justify-between"><span><Droplets size={13} className="mr-1 inline text-blue-500" />Mức nước</span><span>{formatNumber(tank.waterLevel, 1)} mm</span></div>
          <div className="flex justify-between"><span><Thermometer size={13} className="mr-1 inline text-red-500" />Nhiệt độ</span><span>{formatNumber(tank.temp, 1)} °C</span></div>
          {warning && <div className="font-bold text-red-600"><AlertTriangle size={14} className="mr-1 inline" />Cần kiểm tra bồn</div>}
        </div>
      </div>
    </div>
  );
};

export const Tanks = ({ isDashboard = false }) => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState(null);
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStations = async () => {
    const result = await stationService.list();
    const data = result.data || [];
    setStations(data);
    setStationId(current => current || data[0]?.id || null);
  };

  const loadTanks = async (id = stationId) => {
    if (!id) return;
    const result = await tankService.listByStation(id);
    setTanks((result.data || []).map(normalizeTank));
  };

  useEffect(() => {
    loadStations()
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!stationId) return undefined;
    loadTanks().catch(error => toast.error(error.message));
    const timer = setInterval(() => loadTanks().catch(() => {}), 10000);
    return () => clearInterval(timer);
  }, [stationId]);

  const stationOptions = useMemo(() => stations.map(station => ({
    value: station.id,
    label: `${station.name} (${station._count?.tanks || 0} bồn)`
  })), [stations]);

  if (loading) return <div className="flex justify-center p-8"><Spin /></div>;
  return (
    <div className="space-y-4">
      {!isDashboard && (
        <Select value={stationId} options={stationOptions} onChange={setStationId} className="w-full max-w-md" placeholder="Chọn trạm/khu vực" />
      )}
      {isDashboard && stations.length > 1 && (
        <Select value={stationId} options={stationOptions} onChange={setStationId} className="w-full max-w-md" />
      )}
      {!stations.length && <div className="rounded border p-6 text-center text-gray-500">Chưa có trạm/khu vực được gán.</div>}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {tanks.map(tank => (
          <TankCard key={tank.id} tank={tank} onDetails={() => navigate(`/bao-cao-bon?tankId=${tank.id}`)} />
        ))}
      </div>
      {stationId && !tanks.length && <div className="rounded border p-6 text-center text-gray-500">Trạm chưa có bồn hoặc chưa có dữ liệu.</div>}
    </div>
  );
};
