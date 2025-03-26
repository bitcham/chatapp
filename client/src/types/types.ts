export interface Room {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    userId: string;
    userName: string;
    text: string;
    roomId: string;
    timestamp: string;
}

export interface User {
    id: string;
    username: string;
    password: string;
    roomId: string | null;
}

