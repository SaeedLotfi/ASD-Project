import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token: string | null) {
  if (!token) return null;
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      auth: { token },
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}
