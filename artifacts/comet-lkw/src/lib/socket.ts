import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(window.location.origin, {
      path: "/api/socket.io",
      reconnectionDelayMax: 10000,
      transports: ["polling", "websocket"],
      withCredentials: true,
    });
  }
  return socket;
};
