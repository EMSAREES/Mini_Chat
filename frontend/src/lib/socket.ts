import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

// Singleton — nunca se destruye, solo se conecta/desconecta
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export function getSocket(): Socket {
  return socket;
}

export function connectSocket(): void {
  if (!socket.connected) {
    socket.connect();
  }
}

// Solo se usa en logout total
export function disconnectSocket(): void {
  if (socket.connected) {
    socket.disconnect();
  }
}