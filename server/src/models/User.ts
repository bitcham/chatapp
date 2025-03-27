export interface User {
    id: string;
    username: string;
    password: string;
    roomId: string | null;
}

export interface ConnectedUser extends User {
    socketId: string;
}

