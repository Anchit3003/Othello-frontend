// socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('https://othello-backend-production.up.railway.app',{
        transports: ['websocket', 'polling'],
        autoConnect: true
    });
    
    // Connection event
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });
    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}