import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
}; 

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Not Found' });
};
