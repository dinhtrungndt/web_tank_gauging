import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_WS_URL
  || (process.env.REACT_APP_API_URL || 'http://127.0.0.1:1141/api').replace(/\/api\/?$/, '');

let socket;

export const realtimeService = {
  connect() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: false
      });
    } else {
      socket.auth = { token };
    }

    if (!socket.connected) socket.connect();
    return socket;
  },

  disconnect() {
    socket?.disconnect();
    socket = undefined;
  },

  subscribe(event, handler) {
    const activeSocket = this.connect();
    if (!activeSocket) return () => {};

    activeSocket.on(event, handler);
    return () => activeSocket.off(event, handler);
  },

  onStatusChange(handler) {
    const activeSocket = this.connect();
    if (!activeSocket) return () => {};

    activeSocket.on('connect', () => handler('connected'));
    activeSocket.on('disconnect', () => handler('disconnected'));
    activeSocket.on('connect_error', () => handler('error'));
    return () => {
      activeSocket.off('connect', handler);
      activeSocket.off('disconnect', handler);
      activeSocket.off('connect_error', handler);
    };
  }
};
