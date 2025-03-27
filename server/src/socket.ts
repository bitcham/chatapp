import { Server, Socket } from 'socket.io';
import {Server as HttpServer} from 'http';
import { socketLogger } from './middlewares/logger';


export const initializeSocket = (server: HttpServer): Server => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['my-custom-header'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 30000,
    });

    io.on('connection', async (socket: Socket) => {
        socketLogger(`User connected: ${socket.id}`);

        const rooms = await RoomRepository.findAll();
    });

    return io;
    
    
    
