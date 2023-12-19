import { io } from 'socket.io-client';

const URL = 'ws://localhost:8081/ws';

export const socket = io(URL);