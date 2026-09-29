import { download } from './httpClient';

export const reportService = {
  downloadExcel: (tankId, from, to) => download(
    `/reports/tanks/${tankId}/excel?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  )
};
