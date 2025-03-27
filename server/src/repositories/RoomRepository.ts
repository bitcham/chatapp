import {}
import { Room } from '../models/Room';
import { User } from '../models/User';

const rooms: Room[] = [];

export const RoomRepository = {
    findAll: async (): Promise<Room[]> => {
        return rooms;
    },
    
    
};
