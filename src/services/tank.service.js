import { request } from './httpClient';

export const tankService = {
  listByStation: (stationId) => request(`/stations/${stationId}/tanks`)
};
