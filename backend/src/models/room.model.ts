import type { Room } from "../types/room.types";

const rooms: Record<string, string[]> = {};

export function create(room: Room) {
    if (!rooms[room.id]) {
        rooms[room.id] = [];
    }
    // Evitar duplicados al crear
    for (const user of room.users) {
        if (!rooms[room.id]?.includes(user)) {
            rooms[room.id]?.push(user);
        }
    }
    return rooms[room.id];
}

export function join(roomId: string, username: string) {
    if (!rooms[roomId]) {
        return null;
    }
    // Evitar duplicados al unirse (ej: reconexión por recarga)
    if (!rooms[roomId].includes(username)) {
        rooms[roomId].push(username);
    }
    return rooms[roomId];
}

export function getRooms() {
    return rooms;
}

export function deleteRoom(roomId: string) {
    if (rooms[roomId]) {
        delete rooms[roomId];
        return true;
    }
    return false;
}

// ─── NUEVO: quitar un usuario específico de una sala ─────────────────────────
export function removeUserFromRoom(roomId: string, username: string): string[] {
    if (!rooms[roomId]) return [];

    rooms[roomId] = rooms[roomId].filter(u => u !== username);

    return rooms[roomId];
}