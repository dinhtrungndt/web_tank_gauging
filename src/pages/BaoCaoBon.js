import { Button, Form, Input, Modal, Table } from 'antd';
import { ArrowDown, Download } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/report.service';

const mockCa1 = [
  { id: '1', fuel: 'E10', startMm: 403, startLit: 1106, endMm: 402, endLit: 1102, export: 4, import: 0 },
  { id: '2', fuel: 'E10', startMm: 913, startLit: 5087, endMm: 902, endLit: 5005, export: 82, import: 0 },
  { id: '3', fuel: 'DO_II', startMm: 917, startLit: 5097, endMm: 905, endLit: 5007, export: 90, import: 0 },
];

const mockCa2 = [
  { id: '1', fuel: 'E10', startMm: 402, startLit: 1102, endMm: 386, endLit: 1038, export: 64, import: 0 },
  { id: '2', fuel: 'E10', startMm: 902, startLit: 5005, endMm: 812, endLit: 4334, export: 671, import: 0 },
  { id: '3', fuel: 'DO_II', startMm: 905, startLit: 5007, endMm: 798, endLit: 4215, export: 792, import: 0 },
];

const mockCa3 = [
  { id: '1', fuel: 'E10', startMm: 386, startLit: 1038, endMm: 807, endLit: 2968, export: 0, import: 1930 },
  { id: '2', fuel: 'E10', startMm: 812, startLit: 4334, endMm: 1813, endLit: 11876, export: 0, import: 7542 },
  { id: '3', fuel: 'DO_II', startMm: 798, startLit: 4215, endMm: 1409, endLit: 8888, export: 0, import: 4673 },
];

const formatNum = (num) => num.toLocaleString('vi-VN');

export const BaoCaoBon = () => {
  const navigate = useNavigate();
  const [khungThoiGianModalOpen, setKhungThoiGianModalOpen] = useState(false);
  const [logModal, setLogModal] = useState({ open: false, tankId: null });
  const [form] = Form.useForm();

  const handleSaveKhungThoiGian = () => {
    toast.success('Lưu cài đặt thành công!');
    setKhungThoiGianModalOpen(false);
  };

  const handleDownloadCsv = async () => {
    try {
      const to = new Date();
      const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
      const blob = await reportService.downloadExcel(logModal.tankId, from.toISOString(), to.toISOString());
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `bao-cao-bon-${logModal.tankId}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success('Đã tải báo cáo Excel');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderTable = (caNum, data, datesAndTimes, sums) => (
    <div className="mb-4">
      {/* Date/Time Headers */}
      <div className="flex items-center mb-2 px-2">
        <div className="w-24 shrink-0">
          <Button type="primary" className="bg-blue-600 font-bold w-full rounded">CA BÁN {caNum}</Button>
        </div>
        <div className="flex items-center gap-2 flex-1 ml-4">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Ngày</span>
            <input type="date" defaultValue={datesAndTimes.fromDate} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Ngày</span>
            <input type="date" defaultValue={datesAndTimes.toDate} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Từ Giờ</span>
            <input type="time" step="1" defaultValue={datesAndTimes.fromTime} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-600 font-bold mb-1">Đến Giờ</span>
            <input type="time" step="1" defaultValue={datesAndTimes.toTime} className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1 outline-none" />
          </div>
        </div>
      </div>

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
            {/* Sums row */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <td colSpan={6} className="p-2 text-right font-bold text-green-600">Tổng Lượng E10:</td>
              <td className="p-2 font-bold text-green-600">{formatNum(sums.e10Export)}</td>
              <td className="p-2 font-bold text-green-600">{formatNum(sums.e10Import)}</td>
              <td></td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan={6} className="p-2 text-right font-bold text-orange-500">Tổng Lượng DO_II:</td>
              <td className="p-2 font-bold text-orange-500">{formatNum(sums.doExport)}</td>
              <td className="p-2 font-bold text-orange-500">{formatNum(sums.doImport)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

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
        <div className="flex gap-16 text-sm font-bold text-blue-800">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/nhap-bon')}>Nhập Bồn</span>
          <span className="cursor-pointer hover:underline">Cài Đặt Bồn</span>
        </div>
        <div
          className="text-sm font-bold text-blue-800 cursor-pointer hover:underline pr-2"
          onClick={() => setKhungThoiGianModalOpen(true)}
        >
          Khung Thời Gian
        </div>
      </div>

      <div className="flex-1 px-2 pb-4">
        {renderTable(
          1, mockCa1,
          { fromDate: '2026-07-15', toDate: '2026-07-16', fromTime: '21:00:00', toTime: '05:00:00' },
          { e10Export: 86, e10Import: 0, doExport: 90, doImport: 0 }
        )}

        {renderTable(
          2, mockCa2,
          { fromDate: '2026-07-16', toDate: '2026-07-16', fromTime: '05:00:00', toTime: '13:00:00' },
          { e10Export: 735, e10Import: 0, doExport: 792, doImport: 0 }
        )}

        {renderTable(
          3, mockCa3,
          { fromDate: '2026-07-16', toDate: '2026-07-16', fromTime: '13:00:00', toTime: '21:00:00' },
          { e10Export: 0, e10Import: 9472, doExport: 0, doImport: 4673 }
        )}

        {/* Global Sum */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 mb-4 text-xs font-bold text-center">
          <div className="text-red-500 uppercase mb-2">TỔNG TRẠM</div>
          <div className="flex justify-center gap-16 mb-2">
            <span className="text-green-600 w-32 text-right">Tổng Lượng E10:</span>
            <div className="flex gap-16">
              <span className="text-green-600 w-16 text-center">{formatNum(821)}</span>
              <span className="text-green-600 w-16 text-center">{formatNum(9472)}</span>
            </div>
          </div>
          <div className="flex justify-center gap-16">
            <span className="text-orange-500 w-32 text-right">Tổng Lượng DO_II:</span>
            <div className="flex gap-16">
              <span className="text-orange-500 w-16 text-center">{formatNum(882)}</span>
              <span className="text-orange-500 w-16 text-center">{formatNum(4673)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-[10px]">
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
      >
        <Form form={form} layout="horizontal" onFinish={handleSaveKhungThoiGian} initialValues={{
          ca1_start: '210000', ca1_end: '050000',
          ca2_start: '050000', ca2_end: '130000',
          ca3_start: '130000', ca3_end: '210000'
        }}>
          {/* Re-used from BaoCao.js */}
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
