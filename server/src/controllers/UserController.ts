import { AppDataSource } from '../data/database';
import { User } from '../entities/User';

const UserRepository = AppDataSource.getRepository(User);

export class UserController {
    /**
     * Authenticate a user
     * @param userId User ID
     * @returns User information or null
     */
    static async authenticateUser(userId: string): Promise<User | null> {
        try {
            const user = await UserRepository.findOneBy({ id: userId });
            return user;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    }

    /**
     * Get user information by ID
     * @param userId User ID
     * @returns User information or null
     */
    static async getUserById(userId: string): Promise<User | null> {
        try {
            return await UserRepository.findOneBy({ id: userId });
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
} 