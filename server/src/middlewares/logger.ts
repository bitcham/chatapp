import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

export const socketLogger = (event: string, ...args: any[]) => {
    console.log(`${new Date().toISOString()} - Socket Event: ${event}`, ...args);
};
