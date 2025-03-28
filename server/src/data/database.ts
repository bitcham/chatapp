import { DataSource } from 'typeorm';
import { Room } from '../entities/Room';
import { User } from '../entities/User';
import { Message } from '../entities/Message';



export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Room, Message],
    synchronize: true,
    // logging: true,
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established successfully');
        return AppDataSource;
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};


