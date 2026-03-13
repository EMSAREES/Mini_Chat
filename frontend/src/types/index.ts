// ─── Entidades del dominio ────────────────────────────────────────────────────

export interface Room {
    id: string;
    users: string[];
}

export interface ChatMessage {
    username: string;
    message: string;
    timestamp: string;
}

// ─── Payloads de la API ───────────────────────────────────────────────────────

export interface CreateRoomPayload {
    roomId: string;
    username: string;
}

export interface JoinRoomPayload {
    roomId: string;
    username: string;
}

export interface DeleteRoomPayload {
    roomId: string;
}

// ─── Respuestas de la API ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

export interface CreateRoomResponse {
    nuevaSala: string[];
    message: string;
}

export interface JoinRoomResponse {
    unirseSala: string[];
}

export interface AllRoomsResponse {
    allRoom: Record<string, string[]>;
}

// ─── Payloads de Socket ───────────────────────────────────────────────────────

export interface SocketJoinPayload {
    roomId: string;
    username: string;
}

export interface SocketMessagePayload {
    roomId: string;
    message: string;
}

export interface SocketUserJoinedEvent {
    username: string;
    message: string;
    users: string[];
}

export interface SocketUserLeftEvent {
    username: string;
    message: string;
    users: string[];
}

// ─── Estado global de la app ──────────────────────────────────────────────────

export type AppView = "username" | "rooms" | "chat";

export interface AppState {
    view: AppView;
    username: string;
    currentRoom: string | null;
}