import { request } from './httpClient';

export const stationService = {
  list: () => request('/stations')
};
