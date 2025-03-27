export interface Room {
    id: string;
    name: string;
    users: string[]; // Array of user IDs
    messages: Message[];
}

export interface Message {
    id: string;
    roomId: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

