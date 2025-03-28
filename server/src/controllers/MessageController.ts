import { AppDataSource } from '../data/database';
import { Message } from '../entities/Message';
import { User } from '../entities/User';
import { Room } from '../entities/Room';

const MessageRepository = AppDataSource.getRepository(Message);
const UserRepository = AppDataSource.getRepository(User);
const RoomRepository = AppDataSource.getRepository(Room);

export class MessageController {
    /**
     * Create a new message
     * @param userId User ID who sent the message
     * @param roomName Room name where the message was sent
     * @param content Message content
     * @returns Created message and room information
     */
    static async createMessage(userId: string, roomName: string, content: string): Promise<{
        message: Message | null;
        room: Room | null;
        user: User | null;
    }> {
        try {
            const room = await RoomRepository.findOneBy({ name: roomName });
            const user = await UserRepository.findOneBy({ id: userId });

            if (!room || !user) {
                return { message: null, room: null, user: null };
            }

            const message = MessageRepository.create({
                text: content,
                room: room,
                user: user
            });

            await MessageRepository.save(message);

            return { message, room, user };
        } catch (error) {
            console.error('Error creating message:', error);
            return { message: null, room: null, user: null };
        }
    }

    /**
     * Get messages from a room
     * @param roomId Room ID
     * @returns List of messages
     */
    static async getMessagesByRoomId(roomId: string): Promise<Message[]> {
        try {
            return await MessageRepository.find({
                where: { room: { id: roomId } },
                order: { timestamp: 'ASC' }
            });
        } catch (error) {
            console.error(`Error fetching messages for room ${roomId}:`, error);
            return [];
        }
    }
} 