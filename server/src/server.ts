import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { initializeDatabase } from './data/database';
import { initializeSocket } from './socket';
import { requestLogger } from './middlewares/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
dotenv.config();

const app = express();
const server = createServer(app);

const startServer = async () => {
    try{
        await initializeDatabase();
        console.log('Database connection established successfully');

        const io = initializeSocket(server);
        
        if (!io) {
            throw new Error('Failed to initialize Socket.IO server');
        }
        
        console.log('Socket.IO server initialized successfully');

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLogger);

        app.use(notFoundHandler);
        app.use(errorHandler);
        
        server.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error('Error during server initialization:', error);
        process.exit(1);
    }
};

startServer();











