import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { socketLogger } from './middlewares/logger';
import { UserController } from './controllers/UserController';
import { RoomController } from './controllers/RoomController';
import { MessageController } from './controllers/MessageController';

interface UserSocket extends Socket {
    userId?: string | null;
    username?: string | null;
}

export const initializeSocket = (httpServer: HttpServer): Server => {
    const io = new Server(httpServer, {
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

    socketLogger('Socket.IO server initialized');

    io.on('connection', (socket: UserSocket) => {
        socketLogger(`User connected: ${socket.id}`);

        socket.on('authenticate', async (userId: number) => {
            try {
                // Use UserController to authenticate user
                const user = await UserController.authenticateUser(userId.toString());
                
                if (user) {
                    socket.userId = user.id;
                    socket.username = user.username;
                    socketLogger(`Socket ${socket.id} authenticated as user ${user.username} (ID: ${userId})`);
                    socket.emit('authenticated', { userId: user.id, username: user.username });
                } else {
                    socketLogger(`Authentication failed for socket ${socket.id}: User ${userId} not found.`);
                    socket.emit('auth_error', 'User not found');
                }
            } catch (error) {
                socketLogger(`Authentication error for socket ${socket.id}:`, error);
                socket.emit('auth_error', 'Server error during authentication');
            }
        });

        socket.on('join_room', async (roomName: string) => {
            if (!socket.userId || !socket.username) {
                socket.emit('error_message', 'Authentication required to join rooms.');
                return;
            }
            
            try {
                // Use RoomController to find or create a room
                const room = await RoomController.findOrCreateRoom(roomName);
                
                socket.join(roomName);
                socketLogger(`User ${socket.username} (Socket ${socket.id}) joined room: ${roomName}`);

                // Notify other users in the room
                socket.to(roomName).emit('user_joined', { username: socket.username, roomName });

                // Get room messages using RoomController
                const messages = await RoomController.getRoomMessages(room.id);
                socket.emit('joined_room', { roomName, messages });

            } catch (error) {
                socketLogger(`Error joining room ${roomName} for user ${socket.username}:`, error);
                socket.emit('error_message', `Failed to join room ${roomName}.`);
            }
        });

        socket.on('send_message', async (data: { roomName: string; content: string }) => {
            const { roomName, content } = data;
            
            if (!socket.userId || !socket.username) {
                socket.emit('error_message', 'Authentication required to send messages.');
                return;
            }
            
            if (!socket.rooms.has(roomName)) {
                socket.emit('error_message', `You are not in room '${roomName}'.`);
                return;
            }

            try {
                // Use MessageController to create a message
                const result = await MessageController.createMessage(socket.userId, roomName, content);
                
                if (!result.message || !result.room || !result.user) {
                    socket.emit('error_message', 'Room or User not found.');
                    return;
                }

                // Broadcast the message to everyone in the room
                io.to(roomName).emit('receive_message', {
                    id: result.message.id,
                    text: result.message.text,
                    timestamp: result.message.timestamp,
                    username: result.user.username,
                    roomName: result.room.name,
                    userId: result.user.id
                });
                
                socketLogger(`Message from ${result.user.username} in room ${roomName}: ${content}`);

            } catch (error) {
                socketLogger(`Error sending message in room ${roomName} for user ${socket.username}:`, error);
                socket.emit('error_message', `Failed to send message in room ${roomName}.`);
            }
        });

        socket.on('delete_room', async (roomName: string) => {
            if (!socket.userId || !socket.username) {
                socket.emit('error_message', 'Authentication required.');
                return;
            }

            try {
                // Use RoomController to delete a room
                const success = await RoomController.deleteRoom(roomName);
                
                if (!success) {
                    socket.emit('error_message', `Room '${roomName}' not found.`);
                    return;
                }

                // Notify users in the room
                io.to(roomName).emit('room_deleted', { roomName, message: `Room '${roomName}' has been deleted.` });

                // Make all sockets leave the room
                const socketsInRoom = await io.in(roomName).fetchSockets();
                socketsInRoom.forEach(s => s.leave(roomName));

                socketLogger(`User ${socket.username} deleted room: ${roomName}`);
                socket.emit('room_deleted_success', { roomName });

            } catch (error) {
                socketLogger(`Error deleting room ${roomName} by user ${socket.username}:`, error);
                socket.emit('error_message', `Failed to delete room ${roomName}.`);
            }
        });

        socket.on('disconnect', () => {
            socketLogger(`User disconnected: ${socket.id} (User: ${socket.username ?? 'Unknown'})`);
            if (socket.username) {
                socket.rooms.forEach(roomName => {
                    if (roomName !== socket.id) {
                        socket.to(roomName).emit('user_left', { username: socket.username, roomName });
                        socketLogger(`Notified room ${roomName} that ${socket.username} left.`);
                    }
                });
            }
        });
    });

    return io;
};



