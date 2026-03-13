export interface JoinPayload {
    username: string;
}

export interface MessagePayload {
    message: string;
}

export interface ChatMessage {
    user: string;
    message: string;
}

export interface SwitchRoomPayload {
    userId: string;
}