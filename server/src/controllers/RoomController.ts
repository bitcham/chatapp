import { AppDataSource } from '../data/database';
import { Room } from '../entities/Room';
import { Message } from '../entities/Message';

const RoomRepository = AppDataSource.getRepository(Room);
const MessageRepository = AppDataSource.getRepository(Message);

export class RoomController {
    /**
     * Find or create a chat room
     * @param roomName Room name
     * @returns Room information
     */
    static async findOrCreateRoom(roomName: string): Promise<Room> {
        try {
            let room = await RoomRepository.findOne({ where: { name: roomName } });

            if (!room) {
                room = RoomRepository.create({ name: roomName });
                await RoomRepository.save(room);
            }

            return room;
        } catch (error) {
            console.error(`Error finding or creating room ${roomName}:`, error);
            throw error;
        }
    }

    /**
     * Delete a chat room
     * @param roomName Room name
     * @returns Success status
     */
    static async deleteRoom(roomName: string): Promise<boolean> {
        try {
            const room = await RoomRepository.findOneBy({ name: roomName });

            if (!room) {
                return false;
            }

            await RoomRepository.remove(room);
            return true;
        } catch (error) {
            console.error(`Error deleting room ${roomName}:`, error);
            return false;
        }
    }

    /**
     * Get messages from a room
     * @param roomId Room ID
     * @returns List of messages
     */
    static async getRoomMessages(roomId: string): Promise<Message[]> {
        try {
            return await MessageRepository.find({
                where: { room: { id: roomId } },
                order: { timestamp: 'ASC' }
            });
        } catch (error) {
            console.error(`Error fetching messages for room ID ${roomId}:`, error);
            return [];
        }
    }
} 