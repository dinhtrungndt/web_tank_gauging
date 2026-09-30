import { request } from './httpClient';

export const authService = {
  login: (identifier, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getProfile: () => request('/users/profile'),
  updateProfile: (data) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};
