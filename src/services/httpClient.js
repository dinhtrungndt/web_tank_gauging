const API_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:1141/api').replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = {
      method: options.method || 'GET',
      path,
      status: response.status,
      message: payload.message
    };
    console.error('[API request failed]', details);

    const error = new Error('Không thể thực hiện yêu cầu. Vui lòng thử lại.');
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const download = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    console.error('[API download failed]', {
      path,
      status: response.status
    });
    throw new Error('Không thể tải báo cáo. Vui lòng thử lại.');
  }

  return response.blob();
};

export { API_URL };
