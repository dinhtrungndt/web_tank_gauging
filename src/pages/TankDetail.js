import { Button, Spin } from 'antd';
import { ArrowLeft, Download, FileBarChart, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { reportService } from '../services/report.service';

const toInputValue = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const formatNumber = (value, digits = 1) => Number(value || 0).toLocaleString('vi-VN', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : '-';

const HistoryChart = ({ readings }) => {
  if (!readings.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-gray-500">Chưa có dữ liệu đo trong khoảng thời gian này.</div>;
  }
  const values = readings.map(item => Number(item.volumeLit || 0));
  const waterValues = readings.map(item => Number(item.waterMm || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const waterMax = Math.max(...waterValues, 1);
  const points = values.map((value, index) => {
    const x = 20 + (index * 760) / Math.max(values.length - 1, 1);
    const y = 220 - ((value - min) / range) * 190;
    return `${x},${y}`;
  }).join(' ');
  const waterPoints = waterValues.map((value, index) => {
    const x = 20 + (index * 760) / Math.max(waterValues.length - 1, 1);
    const y = 220 - (value / waterMax) * 190;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 800 250" className="h-64 min-w-[640px] w-full" role="img" aria-label="Biểu đồ thể tích bồn">
        <line x1="20" y1="220" x2="780" y2="220" stroke="#cbd5e1" />
        <line x1="20" y1="30" x2="20" y2="220" stroke="#cbd5e1" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3" />
        <polyline points={waterPoints} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 4" />
        {values.map((value, index) => {
          const [x, y] = points.split(' ')[index].split(',');
          return <circle key={`${readings[index].measuredAt}-${index}`} cx={x} cy={y} r="3" fill="#1d4ed8"><title>{`${formatDate(readings[index].measuredAt)}: ${formatNumber(value)} L`}</title></circle>;
        })}
        <text x="25" y="20" className="fill-gray-500 text-[11px]">{formatNumber(max)} L</text>
        <text x="25" y="245" className="fill-gray-500 text-[11px]">{formatNumber(min)} L</text>
        <text x="690" y="20" className="fill-blue-600 text-[11px]">Thể tích</text>
        <text x="690" y="38" className="fill-cyan-600 text-[11px]">Mức nước</text>
      </svg>
    </div>
  );
};

export const TankDetail = () => {
  const { tankId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tank = location.state?.tank;
  const [from, setFrom] = useState(() => toInputValue(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(() => toInputValue(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const result = await reportService.getTankReport(tankId, new Date(from).toISOString(), new Date(to).toISOString());
      setReport(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [from, tankId, to]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const readings = report?.readings || [];
  const alerts = report?.alerts || [];
  const latest = readings[readings.length - 1];
  const tankName = tank?.label || tank?.tankCode || `Bồn ${tankId}`;
  const dateRange = useMemo(() => `${new Date(from).toLocaleDateString('vi-VN')} - ${new Date(to).toLocaleDateString('vi-VN')}`, [from, to]);

  const downloadExcel = async () => {
    setDownloading(true);
    try {
      const blob = await reportService.downloadExcel(tankId, new Date(from).toISOString(), new Date(to).toISOString());
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `bao-cao-bon-${tankId}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success('Đã tải báo cáo Excel');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Quay lại</Button>
        <div className="flex gap-2">
          <Button icon={<FileBarChart size={16} />} onClick={() => navigate(`/bao-cao-bon?tankId=${tankId}`, { state: { tank } })}>Báo cáo ca</Button>
          <Button type="primary" icon={<Download size={16} />} loading={downloading} onClick={downloadExcel}>Xuất Excel</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="m-0 text-xl font-bold text-blue-900 dark:text-blue-300">Lịch sử {tankName}</h1><span className="text-xs text-gray-500">{dateRange}</span></div>
        <div className="flex flex-wrap items-end gap-2 text-xs">
          <label>Từ ngày<input type="datetime-local" value={from} onChange={event => setFrom(event.target.value)} className="ml-1 rounded border p-1" /></label>
          <label>Đến ngày<input type="datetime-local" value={to} onChange={event => setTo(event.target.value)} className="ml-1 rounded border p-1" /></label>
          <Button icon={<RefreshCw size={14} />} onClick={loadReport}>Cập nhật</Button>
        </div>
      </div>
      {loading ? <div className="flex justify-center p-12"><Spin /></div> : (
        <>
          <div className="rounded border bg-white p-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-2 text-sm font-bold">Biểu đồ thể tích (lít)</h2>
            <HistoryChart readings={readings} />
          </div>
          <div className="rounded border bg-white shadow-sm dark:bg-gray-800">
            <h2 className="border-b p-3 text-sm font-bold">Lịch sử đo</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs"><thead className="bg-[#0f3460] text-left text-white"><tr><th className="p-2">Thời gian</th><th className="p-2">Mức (mm)</th><th className="p-2">Nước (mm)</th><th className="p-2">Thể tích (L)</th><th className="p-2">Nhiệt độ (°C)</th></tr></thead>
                <tbody>{readings.map((item, index) => <tr key={`${item.measuredAt}-${index}`} className="border-b dark:border-gray-700"><td className="p-2">{formatDate(item.measuredAt)}</td><td className="p-2">{formatNumber(item.heightMm)}</td><td className="p-2">{formatNumber(item.waterMm)}</td><td className="p-2 font-semibold">{formatNumber(item.volumeLit)}</td><td className="p-2">{formatNumber(item.temperature)}</td></tr>)}</tbody>
              </table>
            </div>
            {!readings.length && <div className="p-4 text-center text-sm text-gray-500">Không có lịch sử đo.</div>}
          </div>
          {alerts.length > 0 && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm"><b>Cảnh báo trong kỳ:</b> {alerts.length} lần</div>}
          {latest && <div className="text-xs text-gray-500">Lần đo gần nhất: {formatDate(latest.measuredAt)}</div>}
        </>
      )}
    </div>
  );
};
