import { download, request } from './httpClient';

export const reportService = {
  getTankReport: (tankId, from, to) => request(
    `/reports/tanks/${tankId}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  ),
  downloadExcel: (tankId, from, to) => download(
    `/reports/tanks/${tankId}/excel?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  ),
  sendEmail: (tankId, from, to, recipient, stationName) => request(
    `/reports/tanks/${tankId}/email?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    {
      method: 'POST',
      body: JSON.stringify({ to: recipient, stationName })
    }
  )
};
